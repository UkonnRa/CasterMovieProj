package com.ra.castermovie.controller;

import com.ra.castermovie.logic.TicketsManagerLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/ticket")
public class TicketManagerController {
    @Autowired
    private TicketsManagerLogic ticketsManagerLogic;

    @GetMapping(value = "findallrequestinfo", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<RequestInfo>> findAllRequestInfo(@RequestParam String theaterId) {
        return ticketsManagerLogic.findAllRequestInfo(theaterId);
    }

}
