package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.couponinfo.UserCouponInfo;

import java.util.List;
@Deprecated
public interface CouponInfoLogic {
    Result<CouponInfo> getCoupon(String userId, String couponId);

    Result<List<UserCouponInfo>> findAllByUserId(String userId);
}
