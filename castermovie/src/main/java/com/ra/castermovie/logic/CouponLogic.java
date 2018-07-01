package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.coupon.ExpiredType;

import java.util.List;
@Deprecated
public interface CouponLogic {
    Result<Coupon> newCoupon(String theaterId, String name, String description, Double discount, ExpiredType expiredType, Long expiredTime, Integer limitPerUser, Integer limitNumber, Integer consumingPoint);

    Result<Coupon> update(String id, Coupon coupon);

    Result<List<Coupon>> findAllByTheaterId(String theaterId);

    Result<List<Coupon>> findAllByTheaterIdAndName(String theaterId, String name);
}
