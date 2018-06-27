package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.order.*;
import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.order.UserOrder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/castermovie/order")
public class OrderController {
    @Autowired
    private OrderLogic orderLogic;

    @PostMapping(value = "newOrder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<UserOrder> newOrder(@RequestBody NewOrderVO vo) {
        return orderLogic.newOrder(vo.getUserId(), vo.getPublicInfoId(), vo.getSeats(), vo.getCouponInfoId());
    }

    @PostMapping(value = "checkIn", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<UserOrder> checkIn(@RequestBody CheckInVO vo) {
        return orderLogic.checkIn(vo.getTheaterId(), vo.getOrderId());
    }


    @PostMapping(value = "payOrder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<UserOrder> payOrder(@RequestBody PayOrderVO vo) {
        return orderLogic.payOrder(vo.getUserId(), vo.getCouponInfoId(), vo.getOrderId());
    }

    @PostMapping(value = "retrieveOrder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<UserOrder> retrieveOrder(@RequestBody RetrieveOrderVO vo) {
        return orderLogic.retrieveOrder(vo.getOrderId());
    }

    @GetMapping(value = "findAllByUserId", consumes = MediaType.ALL_VALUE)
    Result<List<UserOrder>> findAllByUserId(@RequestParam String userId) {
        return orderLogic.findAllByUserId(userId);
    }

    @GetMapping(value = "findById", consumes = MediaType.ALL_VALUE)
    Result<UserOrder> findById(@RequestParam String id) {
        return orderLogic.findById(id);
    }

    @PostMapping(value = "orderOffline", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<UserOrder> orderOffline(@RequestBody OrderOfflineVO vo) {
        return orderLogic.orderOffline(vo.getUserId(), vo.getPublicInfoId(), vo.getSeats());
    }

    @GetMapping(value = "findAllByTheaterId", consumes = MediaType.ALL_VALUE)
    public Result<List<UserOrder>> findAllByTheaterId(@RequestParam String theaterId) {
        return orderLogic.findAllByTheaterId(theaterId);
    }
}
