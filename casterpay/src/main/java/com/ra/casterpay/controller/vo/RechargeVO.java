package com.ra.casterpay.controller.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RechargeVO {
    private String userId;
    private int money;
}
