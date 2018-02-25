package com.ra.castermovie.controller.vo.theater;

import com.ra.castermovie.model.theater.UserTheater;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateVO {
    private String id;
    private UserTheater userTheater;
}
