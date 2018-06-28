package com.ra.castermovie.service;

import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowService extends BaseService<Show> {

    Flux<Show> findAllByGenreIn(List<Genre> genreList);

    Flux<Show> findAllByGenreInAndStartTime(List<Genre> genreList, Long startTime);
}
