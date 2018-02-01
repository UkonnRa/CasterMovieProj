package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.coupon.NewCouponVO;
import com.ra.castermovie.controller.vo.coupon.UpdateVO;
import com.ra.castermovie.logic.CouponLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.coupon.ExpiredType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/castermovie/coupon")
public class CouponController {
    @Autowired
    private CouponLogic couponLogic;

    @PostMapping(value = "newcoupon", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Coupon> newCoupon(@RequestBody NewCouponVO vo) {
        return couponLogic.newCoupon(vo.getTheaterId(), vo.getName(), vo.getDescription(), vo.getDiscount(), vo.getExpiredType(), vo.getExpiredTime(), vo.getLimitPerUser(), vo.getLimitNumber());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Coupon> update(@RequestBody UpdateVO vo) {
        return couponLogic.update(vo.getId(), new Coupon(vo.getId(), vo.getCondition(), vo.getTheaterId(), vo.getName(), vo.getDescription(), vo.getDiscount(), vo.getExpiredType(), vo.getExpiredTime(), vo.getLimitPerUser(), vo.getLimitNumber()));
    }

    @GetMapping(value = "findallBtTheaterid/{theaterId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<Coupon>> findAllByTheaterId(@PathVariable String theaterId) {
        return couponLogic.findAllByTheaterId(theaterId);
    }

    @GetMapping(value = "findallbytheateridandname/{theaterId}/{name}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<Coupon>> findAllByTheaterIdAndName(@PathVariable String theaterId, @PathVariable String name) {
        return couponLogic.findAllByTheaterIdAndName(theaterId, name);
    }

}
