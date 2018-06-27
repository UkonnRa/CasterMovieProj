package com.ra.castermovie.repo;

import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.State;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {

    Flux<User> findAllByState(State state);
}
