package com.shopp.shop.configuration;

import com.shopp.shop.interceptor.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .excludePathPatterns(
                        "/auth/login",
                        "/auth/whoAmI",
                        "/shop/register",
                        "/shop/change-password",
                        "/shop/all-products",
                        "/shop/check-email",
                        "/shop/check-email-exist",
                        "/shop/contactUs/send"
                );
    }
}
