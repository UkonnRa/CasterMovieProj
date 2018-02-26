package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.RequestInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;
import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.requestinfo.State;
import com.ra.castermovie.service.RequestInfoService;
import com.ra.castermovie.service.TheaterService;
import com.ra.castermovie.util.HttpRestUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class RequestInfoLogicImpl implements RequestInfoLogic {
    @Autowired
    private RequestInfoService requestInfoService;
    @Autowired
    private TheaterService theaterService;
    @Value("${casterpay.new-user}")
    private String newUserUrl;

    @Override
    public Result<RequestInfo> handle(String requestInfoId, boolean isPositive) {
        RequestInfo info = requestInfoService.findById(requestInfoId).block();
        if (info == null) return Result.fail("该请求信息不存在");
        switch (info.getState()) {
            case CREATING:
                if (isPositive) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", info.getTheaterId());
                    map.put("role", "THEATER");
                    map.put("initMoney", 0);
                    Result http = HttpRestUtil.httpPost(newUserUrl, map, Result.class);
                    if (http.ifFailed()) return Result.fail(http.getMessage());
                    if (theaterService.save(new Theater(info.getTheaterId(), info.getTheaterInfo())).block() == null)
                        return Result.fail("剧院信息无法保存");
                    info.setState(State.FINISHED);
                } else {
                    info.setState(State.CANCELLED);
                }
                RequestInfo result1 = requestInfoService.update(requestInfoId, info).block();
                return result1 == null ? Result.fail("请求信息无法更新") : Result.succeed(result1);
            case UPDATING:
                if (isPositive) {
                    Theater ori = theaterService.findById(info.getTheaterId()).block();
                    if (ori == null) return Result.fail("剧院信息不存在");
                    Theater readyToUpdate = info.getTheaterInfo().toTheater(ori);
                    if (theaterService.update(info.getTheaterId(), readyToUpdate).block() == null)
                        return Result.fail("无法更新剧院信息");
                    info.setState(State.FINISHED);
                } else {
                    info.setState(State.CANCELLED);
                }
                RequestInfo result2 = requestInfoService.update(requestInfoId, info).block();
                return result2 == null ? Result.fail("请求信息无法更新") : Result.succeed(result2);
            default:
                return Result.fail("该请求信息已被处理");
        }
    }

    @Override
    public Result<List<RequestInfo>> findAllRequestInfo() {
        List<RequestInfo> list = requestInfoService.findAll().collectList().block();
        return Result.succeed(list);
    }
}
