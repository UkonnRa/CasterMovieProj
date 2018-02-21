package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.order.UserOrder;

import java.util.List;
import java.util.Map;

public interface OrderLogic {
    String SUCCEED = "succeed";
    String FAILED = "failed";
    int MIN_FULL_RETRIEVE_DAY = 7;
    long TWO_WEEKS_MILLS = 2 * 7 * 24 * 3600 * 1000;

    Result<UserOrder> newOrder(String userId, String publicInfoId, String couponInfoId, List<Integer> seats);

    Result<UserOrder> checkIn(String theaterId, String orderId);

    Result<UserOrder> payOrder(String userId, String orderId);

    Result<Map<String, List<String>>> distributeTicket(String publicInfoId);

    Result<UserOrder> retrieveOrder(String orderId);

    Result<List<UserOrder>> findAllByUserId(String userId);
}
