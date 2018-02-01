package com.ra.castermovie.util;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Map;

public class HttpRestUtil {
    public static void httpPost(String url, Map<String, Object> bodyMap) {
        String reqBody = new Gson().toJson(bodyMap, new TypeToken<Map<String, Object>>() {
        }.getType());
        RestTemplate template = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept", "application/json;charset=utf-8");
        HttpEntity<String> entity = new HttpEntity<>(reqBody, headers);
        URI uri = URI.create(url);
        template.exchange(uri, HttpMethod.POST, entity, String.class);
    }
}
