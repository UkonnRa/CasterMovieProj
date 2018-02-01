package com.ra.castermovie.scheduler;

import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.couponinfo.State;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.service.CouponInfoService;
import com.ra.castermovie.service.CouponService;
import com.ra.castermovie.service.OrderService;
import com.ra.castermovie.service.PublicInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MongoScheduler {
    private static final long MIN15 = 15 * 60 * 1000;
    private final OrderService orderService;
    private final PublicInfoService publicInfoService;
    private final OrderLogic orderLogic;
    private final CouponService couponService;
    private final CouponInfoService couponInfoService;

    @Autowired
    public MongoScheduler(OrderService orderService, PublicInfoService publicInfoService, OrderLogic orderLogic, CouponService couponService, CouponInfoService couponInfoService) {
        this.orderService = orderService;
        this.publicInfoService = publicInfoService;
        this.orderLogic = orderLogic;
        this.couponService = couponService;
        this.couponInfoService = couponInfoService;
    }

    @Scheduled(fixedRate = 60000)
    private void scanExpiredUnpaidOrder() {
        orderService.findAllByOrderState(OrderState.UNPAID)
                .collectList().block()
                .stream().filter(o -> System.currentTimeMillis() - o.getCreateTime() > MIN15)
                .forEach(o -> orderLogic.retrieveOrder(o.getId()));
    }

    @Scheduled(fixedRate = 60000)
    private void scanOutDatedOrder() {
        orderService.findAllByOrderState(OrderState.READY)
                .collectList().block()
                .stream().filter(o -> {
            PublicInfo p = publicInfoService.findById(o.getPublicInfoId()).block();
            return System.currentTimeMillis() - p.getSchedule() > 0;
        }).forEach(o -> orderLogic.retrieveOrder(o.getId()));
    }

    @Scheduled(fixedRate = 60000)
    private void scanOutDatedCouponInfo() {
        couponInfoService.findAllByState(State.READY)
                .filter(info -> {
                    Coupon coupon = couponService.findById(info.getCouponId()).block();
                    if (coupon != null) {
                        switch (coupon.getExpiredType()) {
                            case TIME_PERIOD:
                                return coupon.getExpiredTime() + info.getCreateTime() < System.currentTimeMillis();
                            case TIME_POINT:
                                return coupon.getExpiredTime() < System.currentTimeMillis();
                            default:
                                return false;
                        }
                    } else {
                        return true;
                    }
                }).collectList().block()
                .forEach(info -> {
                    info.setState(State.EXPIRED);
                    couponInfoService.update(info.getId(), info).block();
                });
    }

    @Scheduled(fixedRate = 60000)
    private void scanDistributeTicket() {
        publicInfoService.findAllByHasBeenDistributed(false)
                .filter(p -> p.getSchedule() - System.currentTimeMillis() <= 3 * 7 * 24 * 3600 * 1000/*OrderLogic.TWO_WEEKS_MILLS*/)
                .collectList().block()
                .forEach(p -> orderLogic.distributeTicket(p.getId()));
    }
}
