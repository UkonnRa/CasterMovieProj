package com.ra.castermovie.repo;

import com.ra.castermovie.model.Theater;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface TheaterRepository extends ReactiveMongoRepository<Theater, String> {
    Flux<Theater> findAllByRegionId(Integer regionId);
}
