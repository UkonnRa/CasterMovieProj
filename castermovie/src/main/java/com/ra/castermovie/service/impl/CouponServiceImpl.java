package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.repo.CouponRepository;
import com.ra.castermovie.service.CouponService;
import com.ra.castermovie.service.util.Filters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Deprecated
public class CouponServiceImpl implements CouponService {
    @Autowired
    private CouponRepository couponRepository;

    @Override
    public Flux<Coupon> findAllByTheaterId(String theaterId) {
        return Filters.filterDeleted(couponRepository.findAllByTheaterId(theaterId), Coupon.class);
    }

    @Override
    public Flux<Coupon> findAllByTheaterIdAndName(String theaterId, String name) {
        return Filters.filterDeleted(couponRepository.findAllByTheaterIdAndName(theaterId, name), Coupon.class);
    }

    @Override
    public Flux<Coupon> findAll() {
        return Filters.filterDeleted(couponRepository.findAll(), Coupon.class);
    }

    @Override
    public Mono<Coupon> findById(String id) {
        return Filters.filterDeleted(couponRepository.findById(id), Coupon.class);
    }

    @Override
    public Mono<Coupon> save(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Flux<Coupon> saveAll(Flux<Coupon> ts) {
        return couponRepository.saveAll(ts);
    }

    @Override
    public Mono<Coupon> update(String id, Coupon coupon) {
        coupon.setId(id);
        return couponRepository.deleteById(id)
                .then(couponRepository.save(coupon));
    }

    @Override
    public Mono<Coupon> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<Coupon> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }
}
