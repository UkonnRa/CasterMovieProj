package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.CouponInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.service.CouponInfoService;
import com.ra.castermovie.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CouponInfoLogicImpl implements CouponInfoLogic {
    private final CouponService couponService;
    private final CouponInfoService couponInfoService;

    @Autowired
    public CouponInfoLogicImpl(CouponService couponService, CouponInfoService couponInfoService) {
        this.couponService = couponService;
        this.couponInfoService = couponInfoService;
    }

    @Override
    public synchronized Result<CouponInfo> getCoupon(String userId, String couponId) {
        int hadNumber = couponInfoService.findAllByUserIdAndCouponId(userId, couponId)
                .collectList().map(List::size).block();
        Coupon coupon = couponService.findById(couponId).block();
        if (coupon == null) return Result.fail("数据库获取优惠券失败");
        if (coupon.getLimitPerUser() <= hadNumber) return Result.fail("获取优惠券已达上限，无法继续获得");
        if (coupon.getLimitNumber() <= 0) return Result.fail("优惠券已经被领取完，无法获取");
        coupon.setLimitNumber(coupon.getLimitNumber() - 1);
        Coupon saveCoupon = couponService.update(couponId, coupon).block();
        CouponInfo couponInfo = couponInfoService.save(new CouponInfo(couponId, userId)).block();
        return (saveCoupon == null || couponInfo == null) ? Result.fail("数据库异常，用户取得优惠券失败") : Result.succeed(couponInfo);
    }

    @Override
    public Result<List<CouponInfo>> findAllByUserId(String userId) {
        return Result.succeed(couponInfoService.findAllByUserId(userId).collectList().block());
    }
}
