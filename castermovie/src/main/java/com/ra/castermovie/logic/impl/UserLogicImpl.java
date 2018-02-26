package com.ra.castermovie.logic.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ra.castermovie.auth.util.TokenAuthenticationService;
import com.ra.castermovie.logic.UserLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.Role;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.MailService;
import com.ra.castermovie.service.UserService;
import com.ra.castermovie.util.HttpRestUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class UserLogicImpl implements UserLogic {

    private final UserService userService;
    private final MailService mailService;

    @Value("${casterpay.new-user}")
    private String newUserUrl;
    @Value("${casterpay.recharge}")
    private String rechargeUrl;

    @Autowired
    public UserLogicImpl(UserService userService, MailService mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }

    @Override
    public Result<User> register(String name, String username, String password, String email) {
        User u;
        try {
            u = userService.save(new User(name, username, password, email, Role.CUSTOMER)).block();
        } catch (DuplicateKeyException e) {
            e.printStackTrace();
            return Result.fail("用户名重名，请重试");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(e.getMessage());
        }
        if (u == null) return Result.fail("数据库连接失败");
        else {
            validate(u.getId());
            return Result.succeed(u);
        }
    }

    @Override
    public Result<User> validate(String id) {
        User u = userService.findById(id).block();
        if (u == null) {
            return Result.fail("该用户不存在");
        } else if (!u.getState().equals(State.UNCHECKED)) {
            return Result.fail("该用户不处于" + State.UNCHECKED.tip + "状态");
        }
        if (u.getEmail() == null) return Result.fail("该用户未填写email");
        mailService.send(u.getEmail(), id);
        return Result.succeed(u);
    }

    @Override
    public Result<User> validateCheck(String bString) {
        final Map<String, String> map = new Gson().fromJson(new String(Base64.getDecoder().decode(bString)), new TypeToken<Map<String, String>>() {
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
                Map<String, Object> newUserMap = new HashMap<>();
                newUserMap.put("id", id);
                newUserMap.put("role", "CUSTOMER");
                newUserMap.put("initMoney", 0);
                HttpRestUtil.httpPost(newUserUrl, newUserMap, Result.class);

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
            u.setTimestamp(System.currentTimeMillis());
            return update(id, u);
        }
    }

    @Override
    public Result<User> update(String id, User user) {
        User u = userService.update(id, user).block();
        return u == null ? Result.fail("数据库连接失败") : Result.succeed(u);
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
        User user = userService.findByUsername(jwt.get("username", String.class)).block();
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
