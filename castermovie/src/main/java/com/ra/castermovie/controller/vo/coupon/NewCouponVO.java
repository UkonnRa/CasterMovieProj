package com.ra.castermovie.controller.vo.coupon;

import com.ra.castermovie.model.coupon.ExpiredType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewCouponVO {
    private String theaterId;
    private String name;
    private String description;
    private Double discount;
    private ExpiredType expiredType;
    private Long expiredTime;
    private Integer limitPerUser;
    private Integer limitNumber;
    private Integer consumingPoint;
}
