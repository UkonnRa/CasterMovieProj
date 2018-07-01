package com.ra.castermovie.model.couponinfo;

import com.ra.castermovie.model.Coupon;
import com.ra.castermovie.model.CouponInfo;
import com.ra.castermovie.model.coupon.ExpiredType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Deprecated
public class UserCouponInfo {
    private String id;
    private Long createTime;
    private State state;
    private String theaterId;
    private String name;
    private String description;
    private Double discount;
    private ExpiredType expiredType;
    private Long expiredTime;

    public UserCouponInfo(CouponInfo info, Coupon coupon) {
        this.id = info.getId();
        this.createTime = info.getCreateTime();
        this.state = info.getState();
        this.theaterId = coupon.getTheaterId();
        this.name = coupon.getName();
        this.description = coupon.getDescription();
        this.discount = coupon.getDiscount();
        this.expiredTime = coupon.getExpiredTime();
        this.expiredType = coupon.getExpiredType();
    }
}
