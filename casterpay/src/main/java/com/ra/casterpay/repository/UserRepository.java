package com.ra.casterpay.repository;

import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Flux<User> findAllByRole(Role role);
}
