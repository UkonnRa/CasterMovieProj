package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.order.CheckInVO;
import com.ra.castermovie.controller.vo.order.NewOrderVO;
import com.ra.castermovie.controller.vo.order.PayOrderVO;
import com.ra.castermovie.logic.OrderLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.PayInfo;
import com.ra.castermovie.model.RetrieveInfo;
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

    @PostMapping(value = "receivepayinfo", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> receivePayInfo(@RequestBody PayInfo payInfo) {
        return orderLogic.receivePayInfo(payInfo);
    }

//    @PostMapping(value = "distributeticket/{publicInfoId}", consumes = MediaType.APPLICATION_JSON_VALUE)
//    Result<Map<String, List<String>>> distributeTicket(@PathVariable String publicInfoId) {
//        return orderLogic.distributeTicket(publicInfoId);
//    }

    @PostMapping(value = "payorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> payOrder(@RequestBody PayOrderVO vo) {
        return orderLogic.payOrder(vo.getUserId(), vo.getOrderId());
    }

    @PostMapping(value = "retrieveorder/{orderId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> retrieveOrder(@PathVariable String orderId) {
        return orderLogic.retrieveOrder(orderId);
    }

    @PostMapping(value = "receiveretrieveinfo", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Order> receiveRetrieveInfo(@RequestBody RetrieveInfo info) {
        log.info("RetrieveInfo: {}", info);
        return orderLogic.receiveRetrieveInfo(info);
    }
}
