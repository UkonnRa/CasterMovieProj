package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;

public interface UserLogic {
    Result<User> register(String email, String name, String password);

    // User cannot be reinstated after cancelled
    Result<User> cancelUser(String email);

    Result<User> update(String email, String name, String password);

    Result<User> recharge(String email, Integer money);

    Result<User> getByJwt(String jwt);

    Result<User> findById(String id);
}
