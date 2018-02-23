package com.ra.castermovie.auth;

import com.ra.castermovie.auth.model.GrantedAuthorityImpl;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.UserService;
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
public class CustomAuthenticationProvider implements AuthenticationProvider {
    private final UserService userService;

    @Autowired
    public CustomAuthenticationProvider(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // 获取认证的用户名 & 密码
        String name = authentication.getName();
        String password = authentication.getCredentials().toString();

        User user = userService.findByUsername(name).block();

        if (user == null) {
            throw new BadCredentialsException("用户不存在");
        } else if (!user.getUsername().equals(name) || !user.getPassword().equals(password)) {
            throw new BadCredentialsException("用户名或密码错误");
        }else if (!user.getState().equals(State.REGISTERED)) {
            throw new BadCredentialsException("用户处于`" + user.getState().tip + "`状态， 无法登陆");
        } else {
            ArrayList<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new GrantedAuthorityImpl(user.getRole().name()));
            // 生成令牌
            return new UsernamePasswordAuthenticationToken(name, password, authorities);
        }
    }

    // 是否可以提供输入类型的认证服务
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}