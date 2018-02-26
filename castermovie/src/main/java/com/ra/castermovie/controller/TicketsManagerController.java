package com.ra.castermovie.controller;

import com.ra.castermovie.logic.TicketsManagerLogic;
import com.ra.castermovie.logic.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/castermovie/tickets")
public class TicketsManagerController {
    @Autowired
    private TicketsManagerLogic ticketsManagerLogic;

    @GetMapping(value = "userRegisterNumberMonthly", consumes = MediaType.ALL_VALUE)
    Result<Map<String, Integer>> userRegisterNumberMonthly(@RequestParam List<String> range) {
        return ticketsManagerLogic.userRegisterNumberMonthly(range);
    }

    @GetMapping(value = "userCancelNumberMonthly", consumes = MediaType.ALL_VALUE)
    Result<Map<String, Integer>> userCancelNumberMonthly(@RequestParam List<String> range) {
        return ticketsManagerLogic.userCancelNumberMonthly(range);
    }

    @GetMapping(value = "userExistingNumber", consumes = MediaType.ALL_VALUE)
    Result<Integer> userExistingNumber() {
        return ticketsManagerLogic.userExistingNumber();
    }

    @GetMapping(value = "ticketsGrossIncomeMonthly", consumes = MediaType.ALL_VALUE)
    Result<Map<String, Integer>> ticketsGrossIncomeMonthly(@RequestParam List<String> range) {
        return ticketsManagerLogic.ticketsGrossIncomeMonthly(range);
    }


}
