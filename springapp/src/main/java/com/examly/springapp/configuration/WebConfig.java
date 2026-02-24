package com.examly.springapp.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://8081-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io") // list the exact origin
                .allowedMethods("*")
                .allowCredentials(true);
    }
}
