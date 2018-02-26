package com.ra.castermovie.controller.vo.user;

import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.user.Level;
import com.ra.castermovie.model.user.Role;
import com.ra.castermovie.model.user.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateVO {
    private String id;
    private Condition condition;
    private Long timestamp;
    private String name;
    private String username;
    private String password;
    private String email;
    private Role role;
    private State state;
    private Integer paid;
    private Level level;
    private Integer point;
}
