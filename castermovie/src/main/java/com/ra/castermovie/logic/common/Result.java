package com.ra.castermovie.logic.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private T value;
    private String message;

    public static <T> Result<T> succeed(T t) {
        return new Result<>(t, null);
    }

    public static <T> Result<T> fail(String message) {
        return new Result<>(null, message);
    }

    public boolean ifSuccessful() {
        return value != null && message == null;
    }

    public boolean ifFailed() {
        return value == null && message != null;
    }
}
