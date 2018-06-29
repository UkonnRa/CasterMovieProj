package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.requestinfo.HandleVO;
import com.ra.castermovie.logic.RequestInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/castermovie/requestInfo")
public class RequestInfoController {
    @Autowired
    private RequestInfoLogic requestInfoLogic;

    @PostMapping(value = "handle", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<RequestInfo> handle(@RequestBody HandleVO vo) {
        return requestInfoLogic.handle(vo.getRequestInfoId(), Boolean.parseBoolean(vo.getIsPositive()));
    }

    @GetMapping(value = "findAllRequestInfo", consumes = MediaType.ALL_VALUE)
    Result<List<RequestInfo>> findAllRequestInfo() {
        return requestInfoLogic.findAllRequestInfo();
    }

}
