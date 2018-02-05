package com.ra.castermovie.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrantedAuthorityImpl implements GrantedAuthority {
    private String authority;
}