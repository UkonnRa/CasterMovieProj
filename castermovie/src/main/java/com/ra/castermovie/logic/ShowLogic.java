package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.model.show.WillPlayShow;

import java.util.List;
import java.util.Set;

public interface ShowLogic {
    Result<Show> newShow(String name, Genre genre, int duration, String poster);

    Result<List<Show>> findAllByGenreIn(List<Genre> genreList);

    Result<List<Show>> findAllByGenreInAndStartTime(List<Genre> genreList, Long startTime);

    Result<Show> findById(String id);

    Result<List<Show>> findAllPlayingNow(String theaterId);

    Result<List<WillPlayShow>> findAllWillPlay(String theaterId);

    Result<Set<Show>> findAllPlayingNowInRegion(int regionId);

    Result<Set<WillPlayShow>> findAllWillPlayInRegion(int regionId);
}
