package com.ra.castermovie.logic.impl;

import com.ra.castermovie.auth.util.TokenAuthenticationService;
import com.ra.castermovie.logic.UserLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.Role;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.UserService;
import com.ra.castermovie.util.HttpRestUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserLogicImpl implements UserLogic {

    private final UserService userService;

    @Value("${casterpay.new-user}")
    private String newUserUrl;
    @Value("${casterpay.recharge}")
    private String rechargeUrl;

    @Autowired
    public UserLogicImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Result<User> register(String email, String name, String password) {
        User u;
        try {
            u = userService.save(new User(name, password, email, Role.CUSTOMER)).block();
        } catch (DuplicateKeyException e) {
            e.printStackTrace();
            return Result.fail("email 重复，请重试");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(e.getMessage());
        }
        if (u == null) return Result.fail("数据库连接失败");
        else {
            Map<String, Object> newUserMap = new HashMap<>();
            newUserMap.put("id", email);
            newUserMap.put("role", "CUSTOMER");
            newUserMap.put("initMoney", 0);
            HttpRestUtil.httpPost(newUserUrl, newUserMap, Result.class);

            return Result.succeed(u);
        }
    }

    @Override
    public Result<User> cancelUser(String id) {
        User u = userService.findById(id).block();
        if (u == null) return Result.fail("该用户不存在");
        else {
            u.setState(State.REMOVED);
            u.setTimestamp(System.currentTimeMillis());
            User user = userService.update(id, u).block();
            return user == null ? Result.fail("数据库连接失败") : Result.succeed(user);

        }
    }

    @Override
    public Result<User> update(String email, String name, String password) {
        User user = userService.findById(email).map(u -> {
            if (name != null && !name.equals("")) u.setName(name);
            if (password != null&& !password.equals("")) u.setPassword(password);
            return userService.update(email, u).block();
        }).block();
        return user == null ? Result.fail("数据库连接失败") : Result.succeed(user);
    }

    @Override
    public Result<User> recharge(String id, Integer money) {
        User user = userService.findById(id).block();
        if (user == null) return Result.fail("用户不存在");
        Map<String, Object> map = new HashMap<>();
        map.put("userId", id);
        map.put("money", money);
        HttpRestUtil.httpPost(rechargeUrl, map, Result.class);
        return Result.succeed(user);
    }

    @Override
    public Result<User> getByJwt(String jwtString) {
        Claims jwt = Jwts.parser()
                .setSigningKey(TokenAuthenticationService.SECRET)
                .parseClaimsJws(jwtString).getBody();
        User user = userService.findById(jwt.get("email", String.class)).block();
        if (user != null) {
            return Result.succeed(user);
        } else {
            return Result.fail("用户不存在");
        }
    }

    @Override
    public Result<User> findById(String userId) {
        User u = userService.findById(userId).block();
        if (u == null) return Result.fail("用户不存在");
        else return Result.succeed(u);
    }
}
