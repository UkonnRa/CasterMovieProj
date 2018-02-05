package com.ra.castermovie.model;

import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.user.Level;
import com.ra.castermovie.model.user.Role;
import com.ra.castermovie.model.user.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "user")
public class User {
    @Id
    private String id;
    @NotNull(message = "User::condition must not be null")
    private Condition condition;
    @NotNull(message = "User::name must not be null")
    private String name;
    @NotNull(message = "User::username must not be null")
    @Indexed(unique = true)
    private String username;
    @NotNull(message = "User::password must not be null")
    private String password;
    @NotNull(message = "User::email must not be null")
    private String email;
    @NotNull(message = "User::role must not be null")
    private Role role;
    @NotNull(message = "User::state must not be null")
    private State state;
    @NotNull(message = "User::paid must not be null")
    private Integer paid;
    @NotNull(message = "User::level must not be null")
    private Level level;
    // 一分钱一个点，以实际支付为准
    @NotNull(message = "User::point must not be null")
    private Integer point;

    public User(String name, String username, String password, String email, Role role) {
        this.id = UUID.randomUUID().toString();
        this.condition = Condition.EXISTING;
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.state = State.UNCHECKED;
        this.paid = 0;
        this.level = Level.LEVEL1;
        this.point = 0;
    }
}