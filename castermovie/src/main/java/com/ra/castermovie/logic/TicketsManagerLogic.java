package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;

import java.util.List;
import java.util.Map;

public interface TicketsManagerLogic {
    double theaterAbandonRate = 0.10;

    Result<Map<String, Integer>> userRegisterNumberMonthly(List<String> range);

    Result<Map<String, Integer>> userCancelNumberMonthly(List<String> range);

    Result<Integer> userExistingNumber();

    Result<Map<String, Integer>> ticketsGrossIncomeMonthly(List<String> range);

    Result<Integer> giveMoneyToTheater(String theaterId);
}
