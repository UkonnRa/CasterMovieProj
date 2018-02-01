package com.ra.castermovie.controller.vo.show;

import com.ra.castermovie.model.common.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewShowVO {
    private String name;
    private Genre genre;
    private int duration;
}
