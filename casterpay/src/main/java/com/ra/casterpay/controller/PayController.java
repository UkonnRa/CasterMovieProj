package com.ra.casterpay.controller;

import com.ra.casterpay.controller.vo.PayOrderVO;
import com.ra.casterpay.controller.vo.RechargeVO;
import com.ra.casterpay.controller.vo.RetrieveVO;
import com.ra.casterpay.logic.PayLogic;
import com.ra.casterpay.logic.UserLogic;
import com.ra.casterpay.logic.common.Result;
import com.ra.casterpay.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/casterpay/pay")
public class PayController {
    @Autowired
    private PayLogic payLogic;

    @PostMapping(value = "payorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> payOrder(@RequestBody PayOrderVO payOrderVO) {
        return payLogic.payOrder(payOrderVO.getUserId(), payOrderVO.getTheaterId(), payOrderVO.getOrderId(), payOrderVO.getMoney());
    }

    @PostMapping(value = "retrieveorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> retrieveOrder(@RequestBody RetrieveVO retrieveVO) {
        return payLogic.retrieveOrder(retrieveVO.getOrderId(), retrieveVO.getDiscount());
    }

    @PostMapping(value = "recharge", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> recharge(@RequestBody RechargeVO rechargeVO) {
        return payLogic.recharge(rechargeVO.getUserId(), rechargeVO.getMoney());
    }


}
