package com.ra.castermovie.auth.util;

import com.ra.castermovie.auth.model.JSONResult;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;
@Slf4j
public class TokenAuthenticationService {
    private static final long EXPIRATION_TIME = 24 * 3_600_000;     // 1d
    private static final String TOKEN_PREFIX = "Bearer";        // Token前缀
    private static final String HEADER_STRING = "Authorization";// 存放Token的Header Key
    public static String SECRET = "Y2FzdGVybW92aWVfc2VjcmV0X2tleQ==";// JWT密码

    // JWT生成方法
    public static void addAuthentication(HttpServletResponse response, String username, String role) {

        // 生成JWT
        String JWT = Jwts.builder()
                .claim("role", role)
                .claim("email", username)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();

        // 将 JWT 写入 body
        try {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getOutputStream().println(JSONResult.fillResultString("", JWT));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // JWT验证方法
    public static Authentication getAuthentication(HttpServletRequest request) {
        // 从Header中拿到token
        String token = request.getHeader(HEADER_STRING);
        if (token != null) {
            // 解析 Token
            Claims claims = Jwts.parser()
                    // 验签
                    .setSigningKey(SECRET)
                    .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                    .getBody();

            String user = claims.get("email", String.class);

            // 得到 权限（角色）
            List<GrantedAuthority> authorities =  AuthorityUtils.createAuthorityList(claims.get("role", String.class));

            // 返回验证令牌
            return user != null ?
                    new UsernamePasswordAuthenticationToken(user, null, authorities) :
                    null;
        }
        return null;
    }
}