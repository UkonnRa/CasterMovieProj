package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.order.CheckInVO;
import com.ra.castermovie.controller.vo.order.NewOrderVO;
import com.ra.castermovie.controller.vo.order.PayOrderVO;
import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/castermovie/order")
public class OrderController {
    @Autowired
    private OrderLogic orderLogic;

    @PostMapping(value = "neworder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> newOrder(@RequestBody NewOrderVO vo) {
        return orderLogic.newOrder(vo.getUserId(), vo.getPublicInfoId(), vo.getCouponInfoId(), vo.getSeats());
    }

    @PostMapping(value = "checkin", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> checkIn(@RequestBody CheckInVO vo) {
        return orderLogic.checkIn(vo.getTheaterId(), vo.getOrderId());
    }


    @PostMapping(value = "payorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> payOrder(@RequestBody PayOrderVO vo) {
        return orderLogic.payOrder(vo.getUserId(), vo.getOrderId());
    }

    @PostMapping(value = "retrieveorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> retrieveOrder(@RequestParam String orderId) {
        Result<Order> result = orderLogic.retrieveOrder(orderId);
        log.info("retrieveOrder ===> {}", result);
        return result;
    }

}
