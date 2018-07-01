package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.coupon.NewCouponVO;
import com.ra.castermovie.controller.vo.coupon.UpdateVO;
import com.ra.castermovie.logic.CouponLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Coupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Deprecated
@RestController
@RequestMapping("api/castermovie/coupon")
public class CouponController {
    @Autowired
    private CouponLogic couponLogic;

    @PostMapping(value = "newCoupon", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Coupon> newCoupon(@RequestBody NewCouponVO vo) {
        return couponLogic.newCoupon(vo.getTheaterId(), vo.getName(), vo.getDescription(), vo.getDiscount(), vo.getExpiredType(), vo.getExpiredTime(), vo.getLimitPerUser(), vo.getLimitNumber(), vo.getConsumingPoint());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Coupon> update(@RequestBody UpdateVO vo) {
        return couponLogic.update(vo.getId(), new Coupon(vo.getId(), vo.getCondition(), vo.getTheaterId(), vo.getName(), vo.getDescription(), vo.getDiscount(), vo.getExpiredType(), vo.getExpiredTime(), vo.getLimitPerUser(), vo.getLimitNumber(), vo.getConsumingPoint()));
    }

    @GetMapping(value = "findAllByTheaterId", consumes = MediaType.ALL_VALUE)
    Result<List<Coupon>> findAllByTheaterId(@RequestParam String theaterId) {
        return couponLogic.findAllByTheaterId(theaterId);
    }

    @GetMapping(value = "findAllByTheaterIdAndName", consumes = MediaType.ALL_VALUE)
    Result<List<Coupon>> findAllByTheaterIdAndName(@RequestParam String theaterId, @RequestParam String name) {
        return couponLogic.findAllByTheaterIdAndName(theaterId, name);
    }

}
