package com.ra.castermovie.repo;

import com.ra.castermovie.model.PublicInfo;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface PublicInfoRepository extends ReactiveMongoRepository<PublicInfo, String> {
    Flux<PublicInfo> findAllByTheaterId(String theaterId);

    Flux<PublicInfo> findAllByShowId(String showId);

    Flux<PublicInfo> findAllBySchedule(Long schedule);

    Flux<PublicInfo> findAllByScheduleAfter(Long schedule);

    Flux<PublicInfo> findAllByScheduleBetween(Long start, Long end);
}
