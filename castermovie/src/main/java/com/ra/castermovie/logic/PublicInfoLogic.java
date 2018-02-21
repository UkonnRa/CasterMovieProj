package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;

import java.util.List;

public interface PublicInfoLogic {
    Result<List<PublicInfo>> findAllByShowId(String showId);
}
