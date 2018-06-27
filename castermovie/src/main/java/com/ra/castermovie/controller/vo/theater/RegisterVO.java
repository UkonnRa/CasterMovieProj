package com.ra.castermovie.controller.vo.theater;

import com.ra.castermovie.model.theater.UserTheater;
import com.ra.castermovie.model.user.Level;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterVO {
    private String email;
    private String password;
    private String name;
    private Integer regionId;
    private String location;
    private Integer seatNumber;
    private Integer seatPerLine;
    private List<Double> discounts;

    public UserTheater toUserTheater() {
        Map<Level, Double> map = new HashMap<>();
        for (int i = 0; i < discounts.size(); i++) {
            map.put(Level.values()[i], discounts.get(i));
        }
        return new UserTheater(
                email,
                password,
                name,
                regionId,
                location,
                seatNumber,
                seatPerLine,
                map
        );
    }
}
