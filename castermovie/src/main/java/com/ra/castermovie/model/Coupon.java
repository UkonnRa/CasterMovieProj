package com.ra.castermovie.model;

import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.coupon.ExpiredType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "coupon")
public class Coupon {
    @Id
    private String id;
    @NotNull(message = "Coupon::condition must not be null")
    private Condition condition;
    @NotNull(message = "Coupon::theaterId must not be null")
    private String theaterId;
    @NotNull(message = "Coupon::name must not be null")
    private String name;
    @NotNull(message = "Coupon::description must not be null")
    private String description;
    @NotNull(message = "Coupon::discount must not be null")
    private Double discount;
    @NotNull(message = "Coupon::expiredType must not be null")
    private ExpiredType expiredType;
    @NotNull(message = "Coupon::expiredTime must not be null")
    private Long expiredTime;
    @NotNull(message = "Coupon::limitPerUser must not be null")
    private Integer limitPerUser;
    @NotNull(message = "Coupon::limitNumber must not be null")
    private Integer limitNumber;
    @NotNull(message = "Coupon::consumingPoint must not be null")
    private Integer consumingPoint;


    public Coupon(String theaterId, String name, String description, Double discount, ExpiredType expiredType, Long expiredTime, Integer limitPerUser, Integer limitNumber, Integer consumingPoint) {
        this.id = UUID.randomUUID().toString();
        this.condition = Condition.EXISTING;
        this.theaterId = theaterId;
        this.name = name;
        this.description = description;
        this.discount = discount;
        this.expiredType = expiredType;
        this.expiredTime = expiredTime;
        this.limitPerUser = limitPerUser;
        this.limitNumber = limitNumber;
        this.consumingPoint = consumingPoint;
    }
}
