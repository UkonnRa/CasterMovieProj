package com.ra.castermovie.service;

import com.ra.castermovie.model.Region;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface RegionService {
    Mono<Region> findById(int id);

    Flux<Region> findAllByName(String name);

    Flux<Region> findAllByParent(int parent);
}
