package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.TicketsManagerLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.User;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.model.user.State;
import com.ra.castermovie.service.OrderService;
import com.ra.castermovie.service.UserService;
import com.ra.castermovie.util.HttpRestUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Component
public class TicketsManagerLogicImpl implements TicketsManagerLogic {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;

    @Value("${casterpay.give-money-to-theater}")
    private String giveMonetToTheaterUrl;

    private Predicate<User> _pred(YearMonth ym) {
        return u -> ym.equals(YearMonth.from(Instant.ofEpochMilli(u.getTimestamp()).atZone(ZoneId.systemDefault()).toLocalDate()));
    }

    private Result<Integer> _typeNumberMonthly(State state, Predicate<User> pred) {
        try {
            return Result.succeed(userService
                    .findAllByState(state)
                    .filter(pred)
                    .count().blockOptional().orElse(0L).intValue());
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(e.getMessage());
        }
    }

    private Result<Map<String, Integer>> _wrapper(List<String> range, State state) {
        if (range.size() != 2) return Result.fail("范围设定失败");
        YearMonth startDate = YearMonth.parse(range.get(0));
        YearMonth endDate = YearMonth.parse(range.get(1));
        if (!startDate.isBefore(endDate)) {
            YearMonth temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        List<YearMonth> list = new LinkedList<>();
        while (startDate.isBefore(endDate)) {
            list.add(startDate);
            startDate = startDate.plusMonths(1);
        }
        Map<String, Integer> map = new HashMap<>();

        for (YearMonth ym : list) {
            Result<Integer> result = _typeNumberMonthly(state, _pred(ym));
            if (result.ifSuccessful()) {
                map.put(ym.format(DateTimeFormatter.ofPattern("yyyy-MM")), result.getValue());
            } else {
                return Result.fail(result.getMessage());
            }
        }

        return Result.succeed(map);
    }

    @Override
    public Result<Map<String, Integer>> userRegisterNumberMonthly(List<String> range) {
        return _wrapper(range, State.REGISTERED);
    }

    @Override
    public Result<Map<String, Integer>> userCancelNumberMonthly(List<String> range) {
        return _wrapper(range, State.REMOVED);
    }

    @Override
    public Result<Integer> userExistingNumber() {
        return _typeNumberMonthly(State.REGISTERED, u -> true);
    }

    @Override
    public Result<Map<String, Integer>> ticketsGrossIncomeMonthly(List<String> range) {
        if (range.size() != 2) return Result.fail("范围设定失败");
        YearMonth startDate = YearMonth.parse(range.get(0));
        YearMonth endDate = YearMonth.parse(range.get(1));
        if (!startDate.isBefore(endDate)) {
            YearMonth temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        List<String> list = new LinkedList<>();
        while (startDate.isBefore(endDate)) {
            list.add(startDate.format(DateTimeFormatter.ofPattern("yyyy-MM")));
            startDate = startDate.plusMonths(1);
        }

        Map<String, Integer> rx = orderService.findAll()
                .filter(o -> list.contains(milliToYearMonthString(o.getCreateTime())) && (o.getOrderState() == OrderState.READY || o.getOrderState() == OrderState.FINISHED))
                .groupBy(o -> milliToYearMonthString(o.getCreateTime()))
                .flatMap(g -> g.reduce(0, (acc, o) -> acc + o.getActualCost()).map(in -> Pair.of(g.key(), in == null ? 0 : in)))
                .collectMap(Pair::getFirst, Pair::getSecond).block();

        return Result.succeed(list.stream().collect(Collectors.toMap(date -> date, date -> rx.getOrDefault(date, 0))));
    }

    private YearMonth milliToYearMonth(long milli) {
        return YearMonth.from(Instant.ofEpochMilli(milli).atZone(ZoneId.systemDefault()).toLocalDate());
    }

    private String milliToYearMonthString(long milli) {
        return milliToYearMonth(milli).format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }
}
