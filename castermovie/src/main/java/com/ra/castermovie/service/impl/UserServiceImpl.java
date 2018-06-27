package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.User;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.repo.UserRepository;
import com.ra.castermovie.service.UserService;
import com.ra.castermovie.service.util.Filters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Flux<User> findAllByState(State state) {
        return Filters.filterDeleted(
                userRepository.findAllByState(state),
                User.class);
    }

    @Override
    public Flux<User> findAll() {
        return Filters.filterDeleted(
                userRepository.findAll(),
                User.class);
    }

    @Override
    public Mono<User> findById(String id) {
        return Filters.filterDeleted(
                userRepository.findById(id),
                User.class);
    }

    @Override
    public Mono<User> save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Flux<User> saveAll(Flux<User> ts) {
        return userRepository.saveAll(ts);
    }

    @Override
    public Mono<User> update(String id, User user) {
        user.setId(id);
        return userRepository.deleteById(id)
                .then(userRepository.save(user));
    }

    @Override
    public Mono<User> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<User> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }
}
