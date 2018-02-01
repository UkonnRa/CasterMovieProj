package com.ra.castermovie.repo;

import com.ra.castermovie.model.Region;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface RegionRepository extends ReactiveMongoRepository<Region, Integer> {
    Flux<Region> findAllByName(String name);

    Flux<Region> findAllByParent(int parent);
}
