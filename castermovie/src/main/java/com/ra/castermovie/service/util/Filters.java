package com.ra.castermovie.service.util;

import com.ra.castermovie.model.common.Condition;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.lang.reflect.InvocationTargetException;

@Slf4j
public class Filters {
    public static <T> Flux<T> filterDeleted(Flux<T> list, Class<T> tClass) {
        return list.filter(item -> {
            try {
                return !tClass.getDeclaredMethod("getCondition").invoke(item).equals(Condition.DELETED);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
                return false;
            }
        }).doOnError((err) -> log.info("err in Filters: {}", err));
    }

    public static <T> Mono<T> filterDeleted(Mono<T> list, Class<T> tClass) {
        return list.filter(item -> {
            try {
                return !tClass.getDeclaredMethod("getCondition").invoke(item).equals(Condition.DELETED);
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
                return false;
            }
        });
    }
}
