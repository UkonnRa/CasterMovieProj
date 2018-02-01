package com.ra.castermovie.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.user.Level;
import com.ra.castermovie.model.user.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
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
    @NotNull(message = "User::state must not be null")
    private State state;
    @NotNull(message = "User::paid must not be null")
    private Integer paid;
    @NotNull(message = "User::level must not be null")
    private Level level;
    @NotNull(message = "User::point must not be null")
    private Integer point;
    @NotNull(message = "User::payCode must not be null")
    private String payCode;

    public User(String name, String username, String password, String email) {
        this.id = UUID.randomUUID().toString();
        this.condition = Condition.EXISTING;
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.state = State.UNCHECKED;
        this.paid = 0;
        this.level = Level.LEVEL1;
        this.point = 0;
        Map<String, String> config = new HashMap<String, String>() {{
            put("id", id);
        }};
        this.payCode = Base64.getEncoder()
                .encodeToString(new Gson()
                        .toJson(config, new TypeToken<Map<String, String>>() {
                        }.getType())
                        .getBytes());
    }
}