package com.ra.castermovie.controller.vo.theater;

import com.ra.castermovie.model.Theater;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateVO {
    private String id;
    private Theater theater;
}
