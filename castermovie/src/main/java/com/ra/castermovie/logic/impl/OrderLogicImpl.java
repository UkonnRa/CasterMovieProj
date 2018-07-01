package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.*;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.model.order.UserOrder;
import com.ra.castermovie.model.user.Level;
import com.ra.castermovie.service.*;
import com.ra.castermovie.util.HttpRestUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Component
public class OrderLogicImpl implements OrderLogic {
    private final OrderService orderService;
    private final PublicInfoService publicInfoService;
    private final UserService userService;
    private final TheaterService theaterService;
    private final ShowService showService;

    @Value("${casterpay.pay-order}")
    private String payOrderUrl;
    @Value("${casterpay.retrieve-order}")
    private String retrieveOrderUrl;

    @Autowired
    public OrderLogicImpl(ShowService showService, OrderService orderService, PublicInfoService publicInfoService, UserService userService, TheaterService theaterService, ShowService showService1) {
        this.orderService = orderService;
        this.publicInfoService = publicInfoService;
        this.userService = userService;
        this.theaterService = theaterService;
        this.showService = showService1;
    }

    @Override
    public synchronized Result<UserOrder> newOrder(String userId, String publicInfoId, List<Integer> seats) {
        User user = null;
        if (userId != null) {
            user = userService.findById(userId).block();
            if (user == null) return Result.fail("该用户不存在");
        }
        if (!seats.contains(null) && seats.size() > 6) return Result.fail("选座的用户每单最多可买6张");

        PublicInfo publicInfo = publicInfoService.findById(publicInfoId).block();
        if (publicInfo == null) return Result.fail("该剧集信息不存在");

        Theater theater = theaterService.findById(publicInfo.getTheaterId()).block();
        if (theater == null) return Result.fail("该剧院不存在");

        int originalCost = publicInfo.getBasePrice() * seats.size();
        int actualCost;
        if (user == null) {
            actualCost = originalCost;
        } else {
            actualCost = (int) (theater.getDiscounts().getOrDefault(user.getLevel(), 1.0) * originalCost);
        }
        return newOrder(userId, publicInfoId, originalCost, actualCost, seats);
    }

    @Override
    public Result<UserOrder> checkIn(String theaterId, String orderId) {
        Order order = orderService.findById(orderId).block();
        if (order == null) return Result.fail("订单不存在");
        PublicInfo publicInfo = publicInfoService.findById(order.getPublicInfoId()).block();
        if (publicInfo == null) return Result.fail("剧集信息不存在");
        User payUser = userService.findById(order.getPayUserId()).block();
        if (payUser == null) return Result.fail("付款用户不存在");

        if (!publicInfo.getTheaterId().equals(theaterId)) return Result.fail("该订单不属于该剧场");
        if (order.getSeats().contains(null)) return Result.fail("该订单未配票，不能check in");
        if (order.getOrderState() != OrderState.READY) return Result.fail("该订单未完成");

        order.setOrderState(OrderState.FINISHED);
        UserOrder result = orderToUserOrder(orderService.update(orderId, order));
        if(result == null) return Result.fail("入场失败，请重试");

        payUser.setPoint(payUser.getPoint() + order.getActualCost());
        payUser.setPaid(payUser.getPaid() + order.getActualCost());
        payUser.setLevel(IntStream.range(0, Level.values().length - 1)
                .filter(i -> Level.values()[i].minPaid <= payUser.getPaid() && payUser.getPaid() < Level.values()[i + 1].minPaid)
                .mapToObj(i -> Level.values()[i])
                .collect(Collectors.toList()).get(0)
        );
        User resultUpdate = userService.update(payUser.getId(), payUser).block();
        return resultUpdate == null? Result.fail("无法保存用户数据"): Result.succeed(result);
    }

    private synchronized Result<UserOrder> newOrder(String userId, String publicInfoId, Integer originalCost, Integer actualCost, List<Integer> seats) {
        PublicInfo p = publicInfoService.findById(publicInfoId).block();
        if (p == null) return Result.fail("剧集信息不存在");

        List<Boolean> distri = p.getSeatDistribution();

        Collections.sort(seats);
        if (seats.get(0) < 0 || seats.get(seats.size() - 1) >= distri.size()) return Result.fail("所选座位超出可选值");
        if (seats.stream().map(distri::get).reduce(true, (u, v) -> u && v)) {
            seats.forEach(i -> distri.set(i, false));
            p.setSeatDistribution(distri);
            publicInfoService.update(publicInfoId, p).block();
            UserOrder result = orderToUserOrder(orderService.save(new Order(userId, publicInfoId, originalCost, actualCost, seats)));

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
    public Result<UserOrder> payOrder(String userId, String orderId) {
        Order order = orderService.findById(orderId).block();
        if (order == null) return Result.fail("订单不存在");
        PublicInfo p = publicInfoService.findById(order.getPublicInfoId()).block();
        if (order == null) return Result.fail("剧集信息不存在");

        order.setPayUserId(userId);
        Order result = orderService.update(orderId, order).block();

        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("userId", userId);
        bodyMap.put("theaterId", p.getTheaterId());
        bodyMap.put("orderId", result.getId());
        bodyMap.put("money", result.getActualCost());
        Result back = HttpRestUtil.httpPost(payOrderUrl, bodyMap, Result.class);
        String backOrderId = (String) back.getValue();
        String backMessage = back.getMessage();
        if (backOrderId != null) {
            Order backOrder = orderService.findById(backOrderId).block();
            if (backOrder == null) return Result.fail("订单不存在");
            backOrder.setOrderState(OrderState.READY);
            UserOrder backResult = orderToUserOrder(orderService.update(backOrderId, backOrder));

            return backResult == null ? Result.fail("保存订单失败") : Result.succeed(backResult);
        }

        return Result.fail(backMessage);
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

    @Override
    public Result<UserOrder> orderOffline(String userId, String publicInfoId, List<Integer> seats) {
        Result<UserOrder> userOrder = newOrder(userId, publicInfoId, seats);
        if (userOrder.ifFailed()) return userOrder;
        Order order = orderService.findById(userOrder.getValue().getId()).block();
        if (order == null) return Result.fail("订单不存在");
        order.setOrderState(OrderState.READY);
        order.setPayUserId(userId);
        UserOrder result = orderToUserOrder(orderService.save(order));
        if (result == null) return Result.fail("数据库异常");
        else return Result.succeed(result);
    }

    @Override
    public Result<List<UserOrder>> findAllByTheaterId(String theaterId) {
        return Result.succeed(orderToUserOrder(publicInfoService.findAllByTheaterId(theaterId).flatMap(info -> orderService.findAllByPublicInfoId(info.getId()))));
    }

    private UserOrder mapper(Order o) {
        User me = o.getUserId() == null ? null : userService.findById(o.getUserId()).block();
        User pay = o.getPayUserId() == null ? null : userService.findById(o.getPayUserId()).block();
        PublicInfo publicInfo = publicInfoService.findById(o.getPublicInfoId()).block();
        Show show = showService.findById(publicInfo.getShowId()).block();
        Theater theater = theaterService.findById(publicInfo.getTheaterId()).block();
        return new UserOrder(o, me, pay, show, theater, publicInfo);
    }

    private UserOrder orderToUserOrder(Mono<Order> mono) {
        Order order = mono.block();
        return mapper(order);
    }

    private List<UserOrder> orderToUserOrder(Flux<Order> flux) {
        List<Order> list = flux.collectList().block();
        return list.stream().map(this::mapper).collect(Collectors.toList());
    }
}
