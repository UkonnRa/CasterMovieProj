package com.ra.castermovie.service;

import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.State;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService {
    Flux<User> findAll();

    Mono<User> findById(String id);

    Mono<User> save(User t);

    Flux<User> saveAll(Flux<User> ts);

    Mono<User> update(String id, User t);

    Mono<User> deleteById(String id);

    Flux<User> deleteAllById(Flux<String> ids);

    Mono<User> deleteByUsername(String username);

    Mono<User> findByUsername(String username);

    Flux<User> findAllByName(String name);

    Flux<User> findAllByEmail(String email);

    Flux<User> findAllByState(State state);
}
