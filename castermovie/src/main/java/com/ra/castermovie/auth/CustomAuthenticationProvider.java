package com.ra.castermovie.auth;

import com.google.gson.Gson;
import com.ra.castermovie.auth.model.GrantedAuthorityImpl;
import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.Role;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.TheaterService;
import com.ra.castermovie.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

// 自定义身份认证验证组件
@Component
@Slf4j
public class CustomAuthenticationProvider implements AuthenticationProvider {
    private final UserService userService;
    private final TheaterService theaterService;

    @Autowired
    public CustomAuthenticationProvider(UserService userService, TheaterService theaterService) {
        this.userService = userService;
        this.theaterService = theaterService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.info("Authentication: {}", new Gson().toJson(authentication));
        String name = authentication.getName();
        String password = authentication.getCredentials().toString();
        Role role;
        try {
            role = Role.valueOf(new ArrayList<GrantedAuthority>(authentication.getAuthorities()).get(0).getAuthority());
        } catch (Exception e) {
            role = Role.CUSTOMER;
        }

        if (role == Role.CUSTOMER || role == Role.TICKETS) {
            User user = userService.findByUsername(name).block();
            if (user == null || user.getRole() != Role.CUSTOMER) {
                throw new BadCredentialsException("用户不存在");
            } else if (!user.getUsername().equals(name) || !user.getPassword().equals(password)) {
                throw new BadCredentialsException("用户名或密码错误");
            } else if (!user.getState().equals(State.REGISTERED)) {
                throw new BadCredentialsException("用户处于`" + user.getState().tip + "`状态， 无法登录");
            }
        } else if (Role.THEATER == role) {
            Theater theater = theaterService.findById(name).block();
            if (theater == null) {
                throw new BadCredentialsException("用户不存在");
            } else if (!theater.getId().equals(name) || !theater.getPassword().equals(password)) {
                throw new BadCredentialsException("用户名或密码错误");
            } else if (theater.getState().equals(com.ra.castermovie.model.theater.State.WAITING)) {
                throw new BadCredentialsException("用户处于`待验证`状态， 无法登录");
            }
        }
        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new GrantedAuthorityImpl(role.toString()));
        return new UsernamePasswordAuthenticationToken(name, password, authorities);

    }

    // 是否可以提供输入类型的认证服务
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}