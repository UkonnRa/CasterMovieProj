package com.ra.castermovie.auth;

import com.ra.castermovie.auth.filter.JWTAuthenticationFilter;
import com.ra.castermovie.auth.filter.JWTLoginFilter;
import com.ra.castermovie.service.TheaterService;
import com.ra.castermovie.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private static final String[] permittedUrls = new String[]{
            "/api/castermovie/user/login",
            "/api/castermovie/user/register",
            "/api/castermovie/user/validate",
            "/api/castermovie/user/validateCheck/**",
            "/api/castermovie/show/**",
            "/api/castermovie/publicInfo/**",
            "/api/castermovie/theater/register",
            "/api/castermovie/theater/find*",
    };
    private final UserService userService;
    private final TheaterService theaterService;

    @Autowired
    public WebSecurityConfig(UserService userService, TheaterService theaterService) {
        this.userService = userService;
        this.theaterService = theaterService;
    }

    // 设置 HTTP 验证规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 关闭csrf验证
        http.csrf().disable()
                // 对请求进行认证
                .authorizeRequests()
                .antMatchers(permittedUrls).permitAll()
                // 所有请求需要身份认证
                .anyRequest().authenticated()
                .and()
                // 添加一个过滤器 所有访问 /login 的请求交给 JWTLoginFilter 来处理 这个类处理所有的JWT相关内容
                .addFilterBefore(new JWTLoginFilter(permittedUrls[0], authenticationManager()),
                        UsernamePasswordAuthenticationFilter.class)
                // 添加一个过滤器验证其他请求的Token是否合法
                .addFilterBefore(new JWTAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        // 使用自定义身份验证组件
        auth.authenticationProvider(new CustomAuthenticationProvider(userService, theaterService));

    }
}