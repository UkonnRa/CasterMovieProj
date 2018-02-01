package com.ra.castermovie.repo;

import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ShowRepository extends ReactiveMongoRepository<Show, String> {
    Flux<Show> findAllByName(String name);

    Flux<Show> findAllByGenreIn(List<Genre> genreList);
}
