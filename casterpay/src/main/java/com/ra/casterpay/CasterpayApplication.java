package com.ra.casterpay;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CasterpayApplication {
    private static final Logger log = LoggerFactory.getLogger(CasterpayApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CasterpayApplication.class, args);
    }
}
