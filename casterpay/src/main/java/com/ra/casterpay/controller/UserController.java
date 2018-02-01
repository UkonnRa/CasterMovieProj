package com.ra.casterpay.controller;

import com.ra.casterpay.controller.vo.NewUserVO;
import com.ra.casterpay.logic.UserLogic;
import com.ra.casterpay.logic.common.Result;
import com.ra.casterpay.model.user.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/casterpay/user")
public class UserController {
    @Autowired
    private UserLogic userLogic;

    @PostMapping(value = "newuser", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> newUser(@RequestBody NewUserVO vo){
        System.out.println(vo.getId() + " " + vo.getRole() + " " + vo.getInitMoney());
        return userLogic.newUser(vo.getId(), vo.getRole(), vo.getInitMoney());
    }
}
