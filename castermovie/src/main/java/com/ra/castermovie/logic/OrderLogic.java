package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.order.UserOrder;

import java.util.List;

public interface OrderLogic {
    String SUCCEED = "succeed";
    String FAILED = "failed";
    int MIN_FULL_RETRIEVE_DAY = 7;

    Result<UserOrder> newOrder(String userId, String publicInfoId, List<Integer> seats);

    Result<UserOrder> checkIn(String theaterId, String orderId);

    Result<UserOrder> payOrder(String userId, String orderId);

    Result<UserOrder> retrieveOrder(String orderId);

    Result<List<UserOrder>> findAllByUserId(String userId);

    Result<UserOrder> findById(String id);

    Result<UserOrder> orderOffline(String userId, String publicInfoId, List<Integer> seats);

    Result<List<UserOrder>> findAllByTheaterId(String theaterId);
}
