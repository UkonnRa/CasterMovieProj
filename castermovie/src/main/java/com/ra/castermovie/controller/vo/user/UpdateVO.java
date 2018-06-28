package com.ra.castermovie.controller.vo.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateVO {
    private String email;
    private String name;
    private String password;
}
