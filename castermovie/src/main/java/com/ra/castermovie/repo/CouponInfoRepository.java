package com.ra.castermovie.repo;

import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.couponinfo.State;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface CouponInfoRepository extends ReactiveMongoRepository<CouponInfo, String> {
    Flux<CouponInfo> findAllByState(State state);

    Flux<CouponInfo> findAllByUserId(String userId);

    Flux<CouponInfo> findAllByUserIdAndState(String userId, State state);

    Flux<CouponInfo> findAllByUserIdAndCouponId(String userId, String couponId);
}
