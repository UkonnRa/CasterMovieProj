package com.ra.castermovie.service;

import com.ra.castermovie.model.Theater;
import reactor.core.publisher.Flux;

public interface TheaterService extends BaseService<Theater> {

    Flux<Theater> findAllByRegionId(Integer regionId);
}
