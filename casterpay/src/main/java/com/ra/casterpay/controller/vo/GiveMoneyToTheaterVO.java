package com.ra.casterpay.controller.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GiveMoneyToTheaterVO {
    private String theaterId;
    private Integer money;
}
