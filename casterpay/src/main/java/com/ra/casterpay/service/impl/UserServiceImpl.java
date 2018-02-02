package com.ra.casterpay.service.impl;

import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;
import com.ra.casterpay.repository.UserRepository;
import com.ra.casterpay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Flux<User> findAllByRole(Role role) {
        return userRepository.findAllByRole(role);
    }

    @Override
    public Flux<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Mono<User> findById(String id) {
        return userRepository.findById(id);
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
}
