package com.ra.castermovie.controller;

import com.ra.castermovie.logic.CouponInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.CouponInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/couponinfo")
public class CouponInfoController {
    @Autowired
    private CouponInfoLogic couponInfoLogic;

    @GetMapping(value = "getcoupon", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<CouponInfo> getCoupon(@RequestParam String userId, @RequestParam String couponId) {
        return couponInfoLogic.getCoupon(userId, couponId);
    }

    @GetMapping(value = "findallbyuserid", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<CouponInfo>> findAllByUserId(@RequestParam String userId) {
        return couponInfoLogic.findAllByUserId(userId);
    }
}
