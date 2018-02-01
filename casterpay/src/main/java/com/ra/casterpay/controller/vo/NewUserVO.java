package com.ra.casterpay.controller.vo;

import com.ra.casterpay.model.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewUserVO {
    private String id;
    private Role role;
    private int initMoney;
}
