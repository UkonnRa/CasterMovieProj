package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;

public interface UserLogic {
    Result<User> register(String name, String username, String password, String email);

    Result<User> login(String username, String password);

    Result<User> validate(String id);

    Result<User> validateCheck(String bString);

    // User cannot be reinstated after cancelled
    Result<User> cancelUser(String id);

    Result<User> update(String id, User user);

    Result<User> recharge(String id, Integer money);
}
