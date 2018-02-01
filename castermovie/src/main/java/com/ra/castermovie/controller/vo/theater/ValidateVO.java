package com.ra.castermovie.controller.vo.theater;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidateVO {
    private String theaterId;
    private int initMoney;
}
