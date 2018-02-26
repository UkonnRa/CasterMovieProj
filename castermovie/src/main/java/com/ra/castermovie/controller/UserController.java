package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.user.CancelUserVO;
import com.ra.castermovie.controller.vo.user.RegisterVO;
import com.ra.castermovie.controller.vo.user.UpdateVO;
import com.ra.castermovie.controller.vo.user.ValidateVO;
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

    @PostMapping(value = "validate", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> validate(@RequestBody ValidateVO vo) {
        return userLogic.validate(vo.getId());
    }

    @GetMapping(value = "validateCheck/{bString}", consumes = MediaType.ALL_VALUE)
    Result<User> validateCheck(@PathVariable String bString) {
        return userLogic.validateCheck(bString);
    }

    @PostMapping(value = "cancelUser", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> cancelUser(@RequestBody CancelUserVO vo) {
        return userLogic.cancelUser(vo.getId());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> update(@RequestBody UpdateVO vo) {
        return userLogic.update(vo.getId(), new User(vo.getId(), vo.getCondition(), vo.getTimestamp(), vo.getName(), vo.getUsername(), vo.getPassword(), vo.getEmail(), vo.getRole(), vo.getState(), vo.getPaid(), vo.getLevel(), vo.getPoint()));
    }

    @GetMapping(value = "getByJwt", consumes = MediaType.ALL_VALUE)
    Result<User> getByJwt(@RequestParam String jwt) {
        return userLogic.getByJwt(jwt);
    }

    @GetMapping(value = "findById", consumes = MediaType.ALL_VALUE)
    Result<User> findById(@RequestParam String userId) {
        return userLogic.findById(userId);
    }
}
