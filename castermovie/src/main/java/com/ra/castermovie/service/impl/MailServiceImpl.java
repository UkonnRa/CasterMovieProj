package com.ra.castermovie.service.impl;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ra.castermovie.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class MailServiceImpl implements MailService {
    @Value("${spring.mail.username}")
    String from;
    @Value("${validate.header}")
    String header;
    @Autowired
    private JavaMailSender sender;

    private void send(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        sender.send(message);
    }

    @Override
    public void send(String to, String userId) {
        Map<String, String> map = new HashMap<String, String>() {{
            put("id", userId);
            put("timestamp", String.valueOf(System.currentTimeMillis()));
        }};
        String ref = Base64.getEncoder().encodeToString(new Gson().toJson(map, new TypeToken<Map<String, String>>() {
        }.getType()).getBytes());
        System.out.println(ref);
        send(to, "VALIDATION", header + ref);
    }
}
