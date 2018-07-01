package com.ra.castermovie.service;

import com.ra.castermovie.model.Coupon;
import reactor.core.publisher.Flux;
@Deprecated
public interface CouponService extends BaseService<Coupon> {
    Flux<Coupon> findAllByTheaterId(String theaterId);

    Flux<Coupon> findAllByTheaterIdAndName(String theaterId, String name);
}
