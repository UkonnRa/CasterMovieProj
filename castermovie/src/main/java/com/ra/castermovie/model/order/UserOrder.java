package com.ra.castermovie.model.order;

import com.ra.castermovie.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserOrder {
    private String id;
    private String theaterName;
    private String theaterId;
    private String showName;
    private String email;
    private String payEmail;
    private Integer originalCost;
    private Integer actualCost;
    private Long createTime;
    private Long startTime;
    private List<Integer> seats;
    private OrderState orderState;
    private String couponName;

    public UserOrder(Order order, User me, User payUser, Coupon coupon, Show show, Theater theater, PublicInfo publicInfo){
        this.id = order.getId();
        this.theaterName = theater.getName();
        this.theaterId = theater.getId();
        this.showName = show.getName();
        this.email = me == null ? null : me.getId();
        this.payEmail = payUser == null? null: payUser.getId();
        this.originalCost = order.getOriginalCost();
        this.actualCost = order.getActualCost();
        this.createTime = order.getCreateTime();
        this.startTime = publicInfo.getSchedule();
        this.seats = order.getSeats();
        this.orderState = order.getOrderState();
        this.couponName = coupon == null? null: coupon.getName();
    }
}
