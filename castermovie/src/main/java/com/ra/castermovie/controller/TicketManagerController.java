package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.ticketmanager.RechargeVO;
import com.ra.castermovie.logic.TicketsManagerLogic;
import com.ra.castermovie.logic.UserLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;
import com.ra.castermovie.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/ticket")
public class TicketManagerController {
    @Autowired
    private TicketsManagerLogic ticketsManagerLogic;
    @Autowired
    private UserLogic userLogic;

    @GetMapping(value = "findAllRequestInfo", consumes = MediaType.ALL_VALUE)
    Result<List<RequestInfo>> findAllRequestInfo(@RequestParam String theaterId) {
        return ticketsManagerLogic.findAllRequestInfo(theaterId);
    }

    @PostMapping(value = "recharge", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<User> recharge(@RequestBody RechargeVO vo) {
        return userLogic.recharge(vo.getUserId(), vo.getMoney());
    }

}
