package com.ra.castermovie.service;

import com.ra.castermovie.model.RequestInfo;
import reactor.core.publisher.Flux;

public interface RequestInfoService extends BaseService<RequestInfo> {
    Flux<RequestInfo> findAllByTheaterId(String theaterId);
}
