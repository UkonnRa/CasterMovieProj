package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.couponinfo.GetCouponVO;
import com.ra.castermovie.logic.CouponInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.couponinfo.UserCouponInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Deprecated
@RestController
@RequestMapping("api/castermovie/couponInfo")
public class CouponInfoController {
    @Autowired
    private CouponInfoLogic couponInfoLogic;

    @PostMapping(value = "getCoupon", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<CouponInfo> getCoupon(@RequestBody GetCouponVO vo) {
        return couponInfoLogic.getCoupon(vo.getUserId(), vo.getCouponId());
    }

    @GetMapping(value = "findAllByUserId", consumes = MediaType.ALL_VALUE)
    Result<List<UserCouponInfo>> findAllByUserId(@RequestParam String userId) {
        return couponInfoLogic.findAllByUserId(userId);
    }
}
