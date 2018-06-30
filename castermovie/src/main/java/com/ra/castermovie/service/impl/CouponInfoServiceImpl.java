package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.couponinfo.State;
import com.ra.castermovie.repo.CouponInfoRepository;
import com.ra.castermovie.service.CouponInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Deprecated
public class CouponInfoServiceImpl implements CouponInfoService {
    @Autowired
    private CouponInfoRepository couponInfoRepository;

    @Override
    public Flux<CouponInfo> findAllByState(State state) {
        return couponInfoRepository.findAllByState(state);
    }

    @Override
    public Flux<CouponInfo> findAllByUserId(String userId) {
        return couponInfoRepository.findAllByUserId(userId);
    }

    @Override
    public Flux<CouponInfo> findAllByUserIdAndState(String userId, State state) {
        return couponInfoRepository.findAllByUserIdAndState(userId, state);
    }

    @Override
    public Flux<CouponInfo> findAllByUserIdAndCouponId(String userId, String couponId) {
        return couponInfoRepository.findAllByUserIdAndCouponId(userId, couponId);
    }

    @Override
    public Flux<CouponInfo> findAll() {
        return couponInfoRepository.findAll();
    }

    @Override
    public Mono<CouponInfo> findById(String id) {
        return couponInfoRepository.findById(id);
    }

    @Override
    public Mono<CouponInfo> save(CouponInfo couponInfo) {
        return couponInfoRepository.save(couponInfo);
    }

    @Override
    public Flux<CouponInfo> saveAll(Flux<CouponInfo> ts) {
        return couponInfoRepository.saveAll(ts);
    }

    @Override
    public Mono<CouponInfo> update(String id, CouponInfo couponInfo) {
        couponInfo.setId(id);
        return couponInfoRepository.deleteById(id)
                .then(couponInfoRepository.save(couponInfo));
    }

    @Override
    public Mono<CouponInfo> deleteById(String id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Flux<CouponInfo> deleteAllById(Flux<String> ids) {
        throw new UnsupportedOperationException();
    }
}
