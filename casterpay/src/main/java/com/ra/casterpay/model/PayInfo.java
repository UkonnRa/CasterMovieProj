package com.ra.casterpay.model;

import com.ra.casterpay.model.payinfo.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayInfo {
    @Id
    private String id;
    @NotNull(message = "PayInfo::fromUserId must not be null")
    private String fromUserId;
    @NotNull(message = "PayInfo::toUserId must not be null")
    private String toUserId;
    @NotNull(message = "PayInfo::orderId must not be null")
    private String orderId;
    @NotNull(message = "PayInfo::cost must not be null")
    private Integer cost;
    @NotNull(message = "PayInfo::state must not be null")
    private State state;

    public PayInfo(String fromUserId, String toUserId, String orderId, Integer cost, State state) {
        this.id = UUID.randomUUID().toString();
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.orderId = orderId;
        this.cost = cost;
        this.state = state;
    }
}
