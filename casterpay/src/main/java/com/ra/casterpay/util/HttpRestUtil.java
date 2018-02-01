package com.ra.casterpay.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

public class HttpRestUtil {
    public static void httpPost(String url, String reqBody) {
        RestTemplate template = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept","application/json;charset=utf-8");
        HttpEntity<String> entity = new HttpEntity<>(reqBody, headers);
        URI uri = URI.create(url);
        template.exchange(uri,HttpMethod.POST, entity, String.class);
    }
}
