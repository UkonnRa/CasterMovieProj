package com.ra.castermovie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayInfo {
    private String orderId;
    private Boolean payOk;
    private String message;
}
