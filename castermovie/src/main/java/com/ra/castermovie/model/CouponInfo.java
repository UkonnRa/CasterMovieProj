package com.ra.castermovie.model;

import com.ra.castermovie.model.couponinfo.State;
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
@Document(collection = "coupon_info")
@Deprecated
public class CouponInfo {
    @Id
    private String id;
    @NotNull(message = "CouponInfo::couponId must not be null")
    private String couponId;
    @NotNull(message = "CouponInfo::userId must not be null")
    private String userId;
    @NotNull(message = "CouponInfo::createTime must not be null")
    private Long createTime;
    @NotNull(message = "CouponInfo::state must not be null")
    private State state;

    public CouponInfo(String couponId, String userId) {
        this.id = UUID.randomUUID().toString();
        this.couponId = couponId;
        this.userId = userId;
        this.createTime = System.currentTimeMillis();
        this.state = State.READY;
    }
}
