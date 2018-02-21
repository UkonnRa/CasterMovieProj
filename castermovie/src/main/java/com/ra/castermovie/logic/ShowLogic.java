package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;

import java.util.List;

public interface ShowLogic {
    Result<Show> newShow(String name, Genre genre, int duration);

    Result<List<Show>> findAllByGenreIn(List<Genre> genreList);

    Result<List<Show>> findAllByGenreInAndStartTime(List<Genre> genreList, Long startTime);

    Result<Show> findById(String id);
}
