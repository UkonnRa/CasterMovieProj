package com.ra.casterpay.controller.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayOrderVO {
    private String userId;
    private String theaterId;
    private String orderId;
    private int money;
}
