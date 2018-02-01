package com.ra.castermovie.controller;

import com.ra.castermovie.logic.CouponInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.CouponInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/couponinfo")
public class CouponInfoController {
    @Autowired
    private CouponInfoLogic couponInfoLogic;

    @GetMapping(value = "getcoupon/{userId}/{couponId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<CouponInfo> getCoupon(@PathVariable String userId, @PathVariable String couponId) {
        return couponInfoLogic.getCoupon(userId, couponId);
    }

    @GetMapping(value = "findallbyuserid/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<CouponInfo>> findAllByUserId(@PathVariable String userId) {
        return couponInfoLogic.findAllByUserId(userId);
    }
}
