package com.ra.castermovie.repo;

import com.ra.castermovie.model.Coupon;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
@Deprecated
public interface CouponRepository extends ReactiveMongoRepository<Coupon, String> {
    Flux<Coupon> findAllByTheaterId(String theaterId);

    Flux<Coupon> findAllByTheaterIdAndName(String theaterId, String name);
}
