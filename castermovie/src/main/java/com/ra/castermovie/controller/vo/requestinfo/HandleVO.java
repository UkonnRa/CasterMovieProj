package com.ra.castermovie.controller.vo.requestinfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HandleVO {
    private String requestInfoId;
    private String isPositive;
}