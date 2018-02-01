package com.ra.casterpay.logic;

import com.ra.casterpay.logic.common.Result;
import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;

public interface UserLogic {
    Result<String> newUser(String id, Role role, Integer initMoney);
}
