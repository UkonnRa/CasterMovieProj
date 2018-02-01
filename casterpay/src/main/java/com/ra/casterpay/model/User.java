package com.ra.casterpay.model;

import com.ra.casterpay.model.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String id;
    @NotNull(message = "User::role must not be null")
    private Role role;
    @NotNull(message = "User::money must not be null")
    private Integer money;
}
