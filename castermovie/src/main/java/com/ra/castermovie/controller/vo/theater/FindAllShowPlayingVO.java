package com.ra.castermovie.controller.vo.theater;

import com.ra.castermovie.model.common.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FindAllShowPlayingVO {
    private String theaterId;
    private long timeFrom;
    private long timeTo;
    private List<Genre> genreList;
}
