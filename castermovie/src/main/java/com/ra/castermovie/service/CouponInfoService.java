package com.ra.castermovie.service;

import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.couponinfo.State;
import reactor.core.publisher.Flux;
@Deprecated
public interface CouponInfoService extends BaseService<CouponInfo> {
    Flux<CouponInfo> findAllByState(State state);

    Flux<CouponInfo> findAllByUserId(String userId);

    Flux<CouponInfo> findAllByUserIdAndState(String userId, State state);

    Flux<CouponInfo> findAllByUserIdAndCouponId(String userId, String couponId);
}
