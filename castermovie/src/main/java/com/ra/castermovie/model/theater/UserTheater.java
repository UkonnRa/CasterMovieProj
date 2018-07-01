package com.ra.castermovie.model.theater;

import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.user.Level;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTheater {
    private String id;
    private String password;
    private String name;
    private Integer regionId;
    private String location;
    private Integer seatNumber;
    private Integer seatPerLine;
    private Map<Level, Double> discounts;
    private String avatar;

    public Theater toTheater(Theater from) {
        if (this.id != null) from.setId(this.id);
        if (this.password != null) from.setPassword(this.password);
        if (this.name != null) from.setName(this.name);
        if (this.regionId != null) from.setRegionId(this.regionId);
        if (this.location != null) from.setLocation(this.location);
        if (this.seatNumber != null) from.setSeatNumber(this.seatNumber);
        if (this.seatPerLine != null) from.setSeatPerLine(this.seatPerLine);
        if (this.discounts != null) from.setDiscounts(this.discounts);
        if (this.avatar != null) from.setAvatar(this.avatar);
        return from;
    }
}
