package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.PublicInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.service.PublicInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PublicInfoLogicImpl implements PublicInfoLogic {
    @Autowired
    private PublicInfoService publicInfoService;

    @Override
    public Result<List<PublicInfo>> findAllByShowId(String showId) {
        return Result.succeed(publicInfoService.findAllByShowId(showId).collectList().block());
    }

    @Override
    public Result<PublicInfo> findById(String id) {
        PublicInfo info = publicInfoService.findById(id).block();
        return info == null? Result.fail("该公示信息不存在"): Result.succeed(info);
    }

    @Override
    public Result<List<PublicInfo>> findAllByTheaterId(String theaterId) {
        return Result.succeed(publicInfoService.findAllByTheaterId(theaterId).collectList().block());
    }
}
