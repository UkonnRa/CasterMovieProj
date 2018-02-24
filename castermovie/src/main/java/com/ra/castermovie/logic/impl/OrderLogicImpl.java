package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.*;
import com.ra.castermovie.model.couponinfo.State;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.model.order.UserOrder;
import com.ra.castermovie.model.user.Level;
import com.ra.castermovie.service.*;
import com.ra.castermovie.util.HttpRestUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@RestController
public class OrderLogicImpl implements OrderLogic {
    private final OrderService orderService;
    private final PublicInfoService publicInfoService;
    private final CouponInfoService couponInfoService;
    private final CouponService couponService;
    private final UserService userService;
    private final TheaterService theaterService;
    private final ShowService showService;

    @Value("${casterpay.pay-order}")
    private String payOrderUrl;
    @Value("${casterpay.retrieve-order}")
    private String retrieveOrderUrl;

    @Autowired
    public OrderLogicImpl(ShowService showService, OrderService orderService, PublicInfoService publicInfoService, CouponInfoService couponInfoService, CouponService couponService, UserService userService, TheaterService theaterService, ShowService showService1) {
        this.orderService = orderService;
        this.publicInfoService = publicInfoService;
        this.couponInfoService = couponInfoService;
        this.couponService = couponService;
        this.userService = userService;
        this.theaterService = theaterService;
        this.showService = showService1;
    }

    @Override
    public synchronized Result<UserOrder> newOrder(String userId, String publicInfoId, List<Integer> seats, String coupnInfoId) {
        if (seats.contains(null)) {
            if(seats.size() > 20) return Result.fail("未选座的用户每单最多可买20张");
            return newOrder(userId, publicInfoId, null, null, seats, coupnInfoId);
        }
        if (!seats.contains(null) && seats.size() > 6) return Result.fail("选座的用户每单最多可买6张");

        User user = userService.findById(userId).block();
        if (user == null) return Result.fail("该用户不存在");
        PublicInfo publicInfo = publicInfoService.findById(publicInfoId).block();
        if (publicInfo == null) return Result.fail("该剧集信息不存在");

        Theater theater = theaterService.findById(publicInfo.getTheaterId()).block();
        if (theater == null) return Result.fail("该剧院不存在");

        Map<Integer, Double> priceTable = publicInfo.getPriceTable();
        List<Integer> keyList = new ArrayList<>(priceTable.keySet());
        Collections.sort(keyList);
        int originalCost = seats.stream().mapToInt(seat -> {
            int i = 0;
            if (keyList.get(keyList.size() - 1) <= seat) {
                i = keyList.size() - 1;
            } else {
                for (; i < keyList.size(); i++) {
                    if (keyList.get(i) <= seat && seat < keyList.get(i + 1)) break;
                }
            }
            double disc = priceTable.getOrDefault(keyList.get(i), 1.0);
            return (int) (publicInfo.getBasePrice() * disc);
        }).sum();
        int actualCost = (int) (theater.getDiscounts().getOrDefault(user.getLevel(), 1.0) * originalCost);
        return newOrder(userId, publicInfoId, originalCost, actualCost, seats, coupnInfoId);
    }

    @Override
    public Result<UserOrder> checkIn(String theaterId, String orderId) {
        Order order = orderService.findById(orderId).block();
        if (order == null) return Result.fail("订单不存在");
        PublicInfo publicInfo = publicInfoService.findById(order.getPublicInfoId()).block();
        if (publicInfo == null) return Result.fail("剧集信息不存在");

        if (!publicInfo.getTheaterId().equals(theaterId)) return Result.fail("该订单不属于该剧场");
        if (order.getSeats().contains(null)) return Result.fail("该订单未配票，不能check in");
        if (order.getOrderState() != OrderState.READY) return Result.fail("该订单未完成");

        order.setOrderState(OrderState.FINISHED);
        UserOrder result = orderToUserOrder(orderService.update(orderId, order));
        return result == null ? Result.fail("入场失败，请重试") : Result.succeed(result);
    }

    private synchronized Result<UserOrder> newOrder(String userId, String publicInfoId, Integer originalCost, Integer actualCost, List<Integer> seats, String couponInfoId) {
        PublicInfo p = publicInfoService.findById(publicInfoId).block();
        if (p == null) return Result.fail("剧集信息不存在");

        List<Boolean> distri = p.getSeatDistribution();
        if (seats.contains(null)) {
            if (p.getSchedule() - System.currentTimeMillis() < TWO_WEEKS_MILLS) {
                return Result.fail("开演前两周内禁止出售配坐票");
            }
            Collections.fill(seats, null);
            Order o = new Order(userId, publicInfoId, originalCost, actualCost, seats,  couponInfoId);
            o.setOrderState(OrderState.WAITING_DISTRI);
            UserOrder result = orderToUserOrder(orderService.save(o));
            return result == null ? Result.fail("数据库异常，请重试") : Result.succeed(result);
        }
        Collections.sort(seats);
        if (seats.get(0) < 0 || seats.get(seats.size() - 1) >= distri.size()) return Result.fail("所选座位超出可选值");
        if (seats.stream().map(distri::get).reduce(true, (u, v) -> u && v)) {
            seats.forEach(i -> distri.set(i, false));
            p.setSeatDistribution(distri);
            publicInfoService.update(publicInfoId, p).block();
            UserOrder result = orderToUserOrder(orderService.save(new Order(userId, publicInfoId, originalCost, actualCost, seats, couponInfoId)));

            if (result == null) {
                return Result.fail("数据库异常，请重试");
            }

            return Result.succeed(result);
        } else {
            return Result.fail("所选座位已经被选，请重新尝试");
        }
    }

    @Override
    // payUser and orderUser may not the same
    // Only deal with coupon discount
    public Result<UserOrder> payOrder(String userId, String couponInfoId, String orderId) {
        Order order = orderService.findById(orderId).block();
        if (order == null) return Result.fail("订单不存在");
        PublicInfo p = publicInfoService.findById(order.getPublicInfoId()).block();
        if (order == null) return Result.fail("剧集信息不存在");
        User payUser = userService.findById(userId).block();
        if (payUser == null) return Result.fail("付款用户不存在");
        double couponDiscount = 1.0;

        for (String id : Arrays.asList(couponInfoId)) {
            if (id != null) {
                CouponInfo selectedCoupon = couponInfoService.findById(id).block();
                if (selectedCoupon == null) return Result.fail("该优惠券信息不存在");
                else if (selectedCoupon.getState() != State.READY) return Result.fail("该优惠券不可用");

                Coupon coupon = couponService.findById(selectedCoupon.getCouponId()).block();
                if (coupon == null) {
                    selectedCoupon.setState(State.EXPIRED);
                    couponInfoService.update(id, selectedCoupon).block();
                    return Result.fail("该优惠券不存在或已经被店家删除");
                }

                if (!selectedCoupon.getUserId().equals(userId)) return Result.fail("该优惠券不属于该用户");

                selectedCoupon.setState(State.USED);
                CouponInfo resultInfo = couponInfoService.update(id, selectedCoupon).block();
                if (resultInfo == null) return Result.fail("数据库异常，优惠券信息无法更新");

                couponDiscount *= coupon.getDiscount();
            }
        }

        order.setPayUserId(userId);
        order.setActualCost((int) (order.getActualCost() * couponDiscount));
        order.setUsedCouponInfoId(couponInfoId);
        Order result = orderService.update(orderId, order).block();

        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("userId", userId);
        bodyMap.put("theaterId", p.getTheaterId());
        bodyMap.put("orderId", result.getId());
        bodyMap.put("money", result.getActualCost());
        Result back = HttpRestUtil.httpPost(payOrderUrl, bodyMap, Result.class);
        log.info("OrderLogic.payOrder ==> {}", back);
        String backOrderId = (String) back.getValue();
        String backMessage = back.getMessage();
        if (backOrderId != null) {
            Order backOrder = orderService.findById(backOrderId).block();
            if (backOrder == null) return Result.fail("订单不存在");
            backOrder.setOrderState(OrderState.READY);
            UserOrder backResult = orderToUserOrder(orderService.update(backOrderId, backOrder));
            payUser = userService.findById(userId).block();
            if (payUser == null) return Result.fail("付款用户不存在");
            payUser.setPoint(payUser.getPoint() + backOrder.getActualCost());
            payUser.setPaid(payUser.getPaid() + backOrder.getActualCost());
            User finalPayUser = payUser;
            payUser.setLevel(IntStream.range(0, Level.values().length - 1)
                    .filter(i -> Level.values()[i].minPaid <= finalPayUser.getPaid() && finalPayUser.getPaid() < Level.values()[i + 1].minPaid)
                    .mapToObj(i -> Level.values()[i])
                    .collect(Collectors.toList()).get(0)
            );
            User resultUpdate = userService.update(payUser.getId(), payUser).block();
            return resultUpdate == null || backResult == null ? Result.fail("保存订单失败") : Result.succeed(backResult);
        }

        return Result.fail(backMessage);
    }

    @Override
    public synchronized Result<Map<String, List<String>>> distributeTicket(String publicInfoId) {
        Map<String, List<String>> result = new HashMap<String, List<String>>() {{
            put(SUCCEED, new ArrayList<>());
            put(FAILED, new ArrayList<>());
        }};
        PublicInfo publicInfo = publicInfoService.findById(publicInfoId).block();
        if (publicInfo == null) return Result.fail("无法获得public info");
        Theater theater = theaterService.findById(publicInfo.getTheaterId()).block();
        if (theater == null) return Result.fail("无法获得剧院信息");
        List<Boolean> seatDist = publicInfo.getSeatDistribution();
        List<Integer> unseatIndexes = IntStream.range(0, seatDist.size())
                .filter(seatDist::get)
                .boxed().collect(Collectors.toList());
        List<Integer> newAddedSeats = new ArrayList<>();
        List<Order> undistri = orderService.findAllByPublicInfoId(publicInfoId)
                .collectList().block().stream()
                .filter(o -> o.getSeats().contains(null))
                .collect(Collectors.toList());
        for (int i = 0; i < undistri.size(); i++) {
            Order tempOrder = undistri.get(i);
            User user = userService.findById(tempOrder.getUserId()).block();
            if (user == null) return Result.fail("用户信息获取失败");

            int tempSeatSize = tempOrder.getSeats().size();
            if (tempSeatSize <= unseatIndexes.size()) {
                newAddedSeats.addAll(unseatIndexes.subList(0, tempSeatSize));
                tempOrder.setSeats(unseatIndexes.subList(0, tempSeatSize));
                unseatIndexes = unseatIndexes.subList(tempSeatSize, unseatIndexes.size());
                List<String> succeed = result.getOrDefault(SUCCEED, new ArrayList<>());
                succeed.add(tempOrder.getId());
                result.put(SUCCEED, succeed);

                Map<Integer, Double> priceTable = publicInfo.getPriceTable();
                List<Integer> keyList = new ArrayList<>(priceTable.keySet());
                Collections.sort(keyList);
                int originalCost = tempOrder.getSeats().stream().mapToInt(seat -> {
                    int ii = 0;
                    if (keyList.get(keyList.size() - 1) <= seat) {
                        ii = keyList.size() - 1;
                    } else {
                        for (; ii < keyList.size(); ii++) {
                            if (keyList.get(ii) <= seat && seat < keyList.get(ii + 1)) break;
                        }
                    }
                    double disc = priceTable.getOrDefault(keyList.get(ii), 1.0);
                    return (int) (publicInfo.getBasePrice() * disc);
                }).sum();
                int actualCost = (int) (theater.getDiscounts().getOrDefault(user.getLevel(), 1.0) * originalCost);

                tempOrder.setOriginalCost(originalCost);
                tempOrder.setActualCost(actualCost);
                Order afterSetPriceOrder = orderService.update(tempOrder.getId(), tempOrder).block();
                Result<UserOrder> afterPay = payOrder(afterSetPriceOrder.getUserId(), afterSetPriceOrder.getUsedCouponInfoId(), afterSetPriceOrder.getId());
                if (afterPay.ifFailed()) {
                    List<String> failed = result.getOrDefault(FAILED, new ArrayList<>());
                    failed.add(afterSetPriceOrder.getId());
                    result.put(FAILED, failed);
                }
            } else {
                List<String> failed = result.getOrDefault(FAILED, new ArrayList<>());
                failed.add(tempOrder.getId());
                result.put(FAILED, failed);
            }
        }

        newAddedSeats.forEach(i -> seatDist.set(i, false));
        publicInfo.setSeatDistribution(seatDist);
        publicInfo.setHasBeenDistributed(true);
        publicInfoService.update(publicInfoId, publicInfo).block();

        result.get(FAILED).forEach(this::retrieveOrder);

        return Result.succeed(result);
    }

    @Override
    public synchronized Result<UserOrder> retrieveOrder(String orderId) {
        Order order = orderService.findById(orderId).block();
        if (order == null) return Result.fail("获取订单失败，订单不存在");
        PublicInfo publicInfo = publicInfoService.findById(order.getPublicInfoId()).block();
        if (publicInfo == null) return Result.fail("获取发布信息失败，发布信息不存在");
        Instant now = Instant.now();
        long interval = ChronoUnit.DAYS.between(now, Instant.ofEpochMilli(publicInfo.getSchedule()));
        if (order.getOrderState() == OrderState.CANCELLED || order.getOrderState() == OrderState.FINISHED) {
            return Result.fail("订单状态不符合条件，无法取消");
        }

        // 取消已分配座位
        List<Boolean> seats = publicInfo.getSeatDistribution();
        order.getSeats().forEach(seat -> {
            if (seat != null) seats.set(seat, true);
        });
        publicInfo.setSeatDistribution(seats);
        publicInfo = publicInfoService.update(publicInfo.getId(), publicInfo).block();
        if (publicInfo == null) return Result.fail("保存public info失败");

        if (order.getOrderState() == OrderState.READY) {
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("orderId", orderId);
            if (interval >= MIN_FULL_RETRIEVE_DAY) {
                bodyMap.put("discount", String.valueOf(1.0));
            } else if (interval > 0) {
                bodyMap.put("discount", String.valueOf(((MIN_FULL_RETRIEVE_DAY - interval) * 1.0 / MIN_FULL_RETRIEVE_DAY)));
            }
            Result back = HttpRestUtil.httpPost(retrieveOrderUrl, bodyMap, Result.class);
            String backOrderId = (String) back.getValue();
            if (backOrderId != null) {
                Order backOrder = orderService.findById(backOrderId).block();
                if (backOrder == null) return Result.fail("订单不存在");
                backOrder.setOrderState(OrderState.CANCELLED);
                UserOrder backResult = orderToUserOrder(orderService.update(backOrderId, backOrder));
                return backResult == null ? Result.fail("保存订单失败") : Result.succeed(backResult);
            }
        } else if (order.getOrderState() == OrderState.UNPAID) {
            order.setOrderState(OrderState.CANCELLED);
            UserOrder result = orderToUserOrder(orderService.update(orderId, order));
            return result == null ? Result.fail("存储订单失败") : Result.succeed(result);
        }
        return Result.fail("遇见未知的订单状态");
    }

    @Override
    public Result<List<UserOrder>> findAllByUserId(String userId) {
        return Result.succeed(orderToUserOrder(orderService.findAllByUserId(userId)));
    }

    @Override
    public Result<UserOrder> findById(String id) {
        UserOrder order = orderToUserOrder(orderService.findById(id));
        return order == null ? Result.fail("订单不存在") : Result.succeed(order);
    }

    private UserOrder mapper(Order o) {
        User me = userService.findById(o.getUserId()).block();
        User pay = o.getPayUserId() == null ? null : userService.findById(o.getPayUserId()).block();
        CouponInfo info = o.getUsedCouponInfoId() == null ? null : couponInfoService.findById(o.getUsedCouponInfoId()).block();
        Coupon coupon = info == null ? null : couponService.findById(info.getCouponId()).block();
        PublicInfo publicInfo = publicInfoService.findById(o.getPublicInfoId()).block();
        Show show = showService.findById(publicInfo.getShowId()).block();
        Theater theater = theaterService.findById(publicInfo.getTheaterId()).block();
        return new UserOrder(o, me, pay, coupon, show, theater, publicInfo);
    }

    private UserOrder orderToUserOrder(Mono<Order> mono) {
        return mono.map(this::mapper).block();
    }

    private List<UserOrder> orderToUserOrder(Flux<Order> mono) {
        return mono.map(this::mapper).collectList().block();
    }
}
