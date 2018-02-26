package com.ra.castermovie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CastermovieApplication {

    public static void main(String[] args) {
        SpringApplication.run(CastermovieApplication.class, args);
    }

}
