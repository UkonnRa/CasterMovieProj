package com.ra.castermovie.controller.vo.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderOfflineVO {
    private String userId;
    private String publicInfoId;
    private List<Integer> seats;
}
