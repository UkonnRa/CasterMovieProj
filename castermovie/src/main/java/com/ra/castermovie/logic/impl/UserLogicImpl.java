package com.ra.castermovie.logic.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ra.castermovie.logic.UserLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.MailService;
import com.ra.castermovie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Map;

@Component
public class UserLogicImpl implements UserLogic {

    private final UserService userService;
    private final MailService mailService;

    @Autowired
    public UserLogicImpl(UserService userService, MailService mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }

    @Override
    public Result<User> register(String name, String username, String password, String email) {
        User u = userService.save(new User(name, username, password, email)).block();
        return u == null ? Result.fail("数据库连接失败") : Result.succeed(u);
    }

    @Override
    public Result<User> login(String username, String password) {
        User u = userService.findByUsername(username).block();
        return u == null ? Result.fail("该用户不存在") : Result.succeed(u);
    }

    @Override
    public Result<User> validate(String id, String email) {
        User u = userService.findById(id).block();
        if (u == null) {
            return Result.fail("该用户不存在");
        } else if (!u.getState().equals(State.UNCHECKED)) {
            return Result.fail("该用户不处于" + State.UNCHECKED.tip + "状态");
        }
        mailService.send(email, id);
        return Result.succeed(u);
    }

    @Override
    public Result<User> validateCheck(String bString) {
        Map<String, String> map = new Gson().fromJson(new String(Base64.getDecoder().decode(bString)), new TypeToken<Map<String, String>>() {
        }.getType());
        String id = map.get("id");
        Long timestamp = Long.parseLong(map.get("timestamp"));
        if (System.currentTimeMillis() - timestamp <= 24 * 3600 * 1000) {
            User u = userService.findById(id).block();
            if (u == null) {
                return Result.fail("该用户不存在");
            } else if (!u.getState().equals(State.UNCHECKED)) {
                return Result.fail("该用户不处于" + State.UNCHECKED.tip + "状态");
            } else {
                u.setState(State.REGISTERED);
                return update(u.getId(), u);
            }
        } else {
            return Result.fail("该验证码已过期，请重新获取");
        }
    }

    @Override
    public Result<User> cancelUser(String id) {
        User u = userService.findById(id).block();
        if (u == null) return Result.fail("该用户不存在");
        else {
            u.setState(State.REMOVED);
            return update(id, u);
        }
    }

    @Override
    public Result<User> update(String id, User user) {
        User u = userService.update(id, user).block();
        return u == null ? Result.fail("数据库连接失败") : Result.succeed(u);
    }
}
