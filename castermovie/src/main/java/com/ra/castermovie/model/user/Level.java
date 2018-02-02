package com.ra.castermovie.model.user;

public enum Level {
    LEVEL1(0), LEVEL2(1000), LEVEL3(5000), LEVEL4(10000), LEVEL5(50000), LEVEL_MAX(Integer.MAX_VALUE);

    public Integer minPaid;

    Level(Integer minPaid) {
        this.minPaid = minPaid;
    }
}
