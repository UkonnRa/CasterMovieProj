package com.ra.castermovie.repo;

import com.ra.castermovie.model.RequestInfo;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface RequestInfoRepository extends ReactiveMongoRepository<RequestInfo, String> {
    Flux<RequestInfo> findAllByTheaterId(String theaterId);
}
