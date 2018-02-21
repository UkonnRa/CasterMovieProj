package com.ra.castermovie.model.order;

import com.ra.castermovie.model.*;
import com.ra.castermovie.model.common.Condition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserOrder {
    private String id;
    private String theaterName;
    private String showName;
    private String username;
    private String payUsername;
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
        this.showName = show.getName();
        this.username = me.getUsername();
        this.payUsername = payUser == null? null: payUser.getUsername();
        this.originalCost = order.getOriginalCost();
        this.actualCost = order.getActualCost();
        this.createTime = order.getCreateTime();
        this.startTime = publicInfo.getSchedule();
        this.seats = order.getSeats();
        this.orderState = order.getOrderState();
        this.couponName = coupon == null? null: coupon.getName();
    }
}
