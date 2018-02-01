package com.ra.casterpay.controller.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RetrieveVO {
    private String orderId;
    private double discount;
}
