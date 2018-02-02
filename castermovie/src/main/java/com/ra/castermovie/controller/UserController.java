package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.user.*;
import com.ra.castermovie.logic.UserLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/castermovie/user")
public class UserController {
    @Autowired
    private UserLogic userLogic;

    @PostMapping(value = "register", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> register(@RequestBody RegisterVO vo) {
        return userLogic.register(vo.getName(), vo.getUsername(), vo.getPassword(), vo.getEmail());
    }

    @PostMapping(value = "login", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> login(@RequestBody LoginVO vo) {
        return userLogic.login(vo.getUsername(), vo.getPassword());
    }

    @PostMapping(value = "validate", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> validate(@RequestBody ValidateVO vo) {
        return userLogic.validate(vo.getId());
    }

    @GetMapping(value = "validatecheck/{bString}", consumes = MediaType.ALL_VALUE)
    Result<User> validateCheck(@PathVariable String bString) {
        return userLogic.validateCheck(bString);
    }

    @PostMapping(value = "canceluser", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> cancelUser(@RequestBody CancelUserVO vo) {
        return userLogic.cancelUser(vo.getId());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> update(@RequestBody UpdateVO vo) {
        return userLogic.update(vo.getId(), new User(vo.getId(), vo.getCondition(), vo.getName(), vo.getUsername(), vo.getPassword(), vo.getEmail(), vo.getState(), vo.getPaid(), vo.getLevel(), vo.getPoint()));
    }

}
