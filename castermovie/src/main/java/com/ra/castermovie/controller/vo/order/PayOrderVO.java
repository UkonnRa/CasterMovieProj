package com.ra.castermovie.controller.vo.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayOrderVO {
    private String userId;
    private String couponInfoId;
    private String orderId;
}
