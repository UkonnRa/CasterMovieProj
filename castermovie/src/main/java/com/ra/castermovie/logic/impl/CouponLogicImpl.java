package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.CouponLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.coupon.ExpiredType;
import com.ra.castermovie.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Deprecated
public class CouponLogicImpl implements CouponLogic {
    private final CouponService couponService;

    @Autowired
    public CouponLogicImpl(CouponService couponService) {
        this.couponService = couponService;
    }

    @Override
    public Result<Coupon> newCoupon(String theaterId, String name, String description, Double discount, ExpiredType expiredType, Long expiredTime, Integer limitPerUser, Integer limitNumber, Integer consumingPoint) {
        Coupon coupon = couponService.save(new Coupon(theaterId, name, description, discount, expiredType, expiredTime, limitPerUser, limitNumber, consumingPoint)).block();
        return coupon == null ? Result.fail("数据库异常，优惠券信息保存失败") : Result.succeed(coupon);
    }

    @Override
    public Result<Coupon> update(String id, Coupon coupon) {
        Coupon result = couponService.update(id, coupon).block();
        return result == null ? Result.fail("数据库异常，优惠券信息保存失败") : Result.succeed(result);
    }

    @Override
    public Result<List<Coupon>> findAllByTheaterId(String theaterId) {
        return Result.succeed(couponService.findAllByTheaterId(theaterId).collectList().block());
    }

    @Override
    public Result<List<Coupon>> findAllByTheaterIdAndName(String theaterId, String name) {
        return Result.succeed(couponService.findAllByTheaterIdAndName(theaterId, name).collectList().block());
    }
}
