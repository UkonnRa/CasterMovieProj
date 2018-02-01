package com.ra.castermovie.controller.vo.theater;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterVO {
    private String password;
    private String name;
    private int regionId;
    private String location;
    private int seatNumber;
}
