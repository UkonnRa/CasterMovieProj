package com.ra.castermovie.service;

import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ShowService extends BaseService<Show> {
    Flux<Show> findAllByName(String name);

    Flux<Show> findAllByGenreIn(List<Genre> genreList);
}
