package com.ra.castermovie.controller;

import com.ra.castermovie.logic.PublicInfoLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/publicInfo")
public class PublicInfoController {
    @Autowired
    private PublicInfoLogic publicInfoLogic;

    @GetMapping(value = "findAllByShowId", consumes = MediaType.ALL_VALUE)
    Result<List<PublicInfo>> findAllByShowId(@RequestParam String showId) {
        return publicInfoLogic.findAllByShowId(showId);
    }

    @GetMapping(value = "findById", consumes = MediaType.ALL_VALUE)
    Result<PublicInfo> findById(@RequestParam String id) {
        return publicInfoLogic.findById(id);
    }

}
