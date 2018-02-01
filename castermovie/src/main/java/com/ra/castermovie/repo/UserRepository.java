package com.ra.castermovie.repo;

import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.State;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Mono<User> findByUsername(String username);

    Flux<User> findAllByName(String name);

    Flux<User> findAllByEmail(String email);

    Flux<User> findAllByState(State state);

    Mono<User> deleteByUsername(String username);
}
