package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.TicketsManagerLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;
import com.ra.castermovie.service.RequestInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TicketsManagerLogicImpl implements TicketsManagerLogic {
    private final RequestInfoService requestInfoService;

    @Autowired
    public TicketsManagerLogicImpl(RequestInfoService requestInfoService) {
        this.requestInfoService = requestInfoService;
    }

    @Override
    public Result<List<RequestInfo>> findAllRequestInfo(String theaterId) {
        List<RequestInfo> list = requestInfoService.findAllByTheaterId(theaterId).collectList().block();
        return Result.succeed(list);
    }
}
