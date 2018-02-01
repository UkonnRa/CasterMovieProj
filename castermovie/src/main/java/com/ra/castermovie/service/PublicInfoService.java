package com.ra.castermovie.service;

import com.ra.castermovie.model.PublicInfo;
import reactor.core.publisher.Flux;


public interface PublicInfoService extends BaseService<PublicInfo> {
    Flux<PublicInfo> findAllByTheaterId(String theaterId);

    Flux<PublicInfo> findAllByShowId(String showId);

    Flux<PublicInfo> findAllBySchedule(Long localDateTime);

    Flux<PublicInfo> findAllByHasBeenDistributed(boolean hasBeenDist);
}
