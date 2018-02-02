package com.ra.casterpay.logic.impl;

import com.ra.casterpay.logic.PayLogic;
import com.ra.casterpay.logic.UserLogic;
import com.ra.casterpay.logic.common.Result;
import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;
import com.ra.casterpay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserLogicImpl implements UserLogic {
    private final UserService userService;

    @Autowired
    public UserLogicImpl(UserService userService, PayLogic payLogic) {
        this.userService = userService;
    }

    @Override
    public Result<String> newUser(String id, Role role, Integer initMoney) {
        User user = userService.save(new User(id, role, initMoney)).block();
        return user == null ? Result.fail("无法创建用户") : Result.succeed(user.getId());
    }
}
