package com.ra.casterpay.service;

import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;
import reactor.core.publisher.Flux;

public interface UserService extends BaseService<User> {
    Flux<User> findAllByRole(Role role);
}
