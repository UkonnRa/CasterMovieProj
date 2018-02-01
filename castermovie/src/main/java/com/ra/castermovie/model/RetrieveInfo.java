package com.ra.castermovie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RetrieveInfo {
    private String orderId;
    private Boolean retrieveOk;
    private String message;
}
