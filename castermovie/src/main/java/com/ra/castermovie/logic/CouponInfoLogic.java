package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.CouponInfo;

import java.util.List;

public interface CouponInfoLogic {
    Result<CouponInfo> getCoupon(String userId, String couponId);

    Result<List<CouponInfo>> findAllByUserId(String userId);
}
