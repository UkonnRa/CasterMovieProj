package com.ra.castermovie.controller.vo.ticketmanager;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RechargeVO {
    private String userId;
    private Integer money;
}