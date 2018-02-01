package com.ra.casterpay;

import com.ra.casterpay.logic.PayLogic;
import com.ra.casterpay.logic.UserLogic;
import com.ra.casterpay.model.User;
import com.ra.casterpay.model.user.Role;
import com.ra.casterpay.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class CasterpayApplication {
    private static final Logger log = LoggerFactory.getLogger(CasterpayApplication.class);
    public static void main(String[] args) {
        SpringApplication.run(CasterpayApplication.class, args);
    }
}
