package com.ra.castermovie.logic;

import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.common.Genre;
import org.springframework.data.util.Pair;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public interface TheaterLogic {
    Result<Theater> register(String password, String name, int regionId, String location, int seatNumber);

    Result<Theater> validate(String theaterId, int initMoney);

    Result<Theater> update(String id, Theater theater);

    Result<Theater> newPublicInfo(String theaterId, String showId, List<Instant> schedules, Integer basePrice, Map<Integer, Double> priceTable);

    Result<List<PublicInfo>> findAllShowPlaying(String theaterId, Pair<Instant, Instant> timePair, List<Genre> genreList);

    Result<List<Theater>> findAllTheater(int regionId);

    Result<Theater> findById(String id);
}
