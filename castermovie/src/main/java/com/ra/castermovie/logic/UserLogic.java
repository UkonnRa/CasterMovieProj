package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;

public interface UserLogic {
    Result<User> register(String username, String password, String email);

    // User cannot be reinstated after cancelled
    Result<User> cancelUser(String email);

    Result<User> update(String email, User user);

    Result<User> recharge(String email, Integer money);

    Result<User> getByJwt(String jwt);

    Result<User> findById(String id);
}
