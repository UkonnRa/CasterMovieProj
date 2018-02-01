package com.ra.castermovie.controller.vo.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckInVO {
    private String theaterId;
    private String orderId;
}
