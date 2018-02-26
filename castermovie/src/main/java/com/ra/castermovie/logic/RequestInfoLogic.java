package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.RequestInfo;

import java.util.List;

public interface RequestInfoLogic {

    Result<RequestInfo> handle(String requestInfoId, boolean isPositive);

    Result<List<RequestInfo>> findAllRequestInfo();
}
