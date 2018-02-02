package com.ra.castermovie.controller.vo.couponinfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCouponVO {
    private String userId;
    private String couponId;
}
