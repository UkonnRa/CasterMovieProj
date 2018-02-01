package com.ra.casterpay.service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BaseService<T> {

    Flux<T> findAll();

    Mono<T> findById(String id);

    Mono<T> save(T t);

    Flux<T> saveAll(Flux<T> ts);

    Mono<T> update(String id, T t);
}
