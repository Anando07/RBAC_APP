package com.pms.app.pms.backend.auth.config;

public class AppConstants {

    public static final String[] AUTH_PUBLIC_URLS = {
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };

    public static final String[] AUTH_USER_MANAGEMENT_URLS = {
            "/api/v1/users/**"
    };

    public static final String[] AUTH_GUEST_URLS = {

    };

    public static final String ADMINISTRATOR_ROLE = "ADMINISTRATOR";
    public static final String ADMIN_ROLE = "ADMIN";
    public static final String GUEST_ROLE = "GUEST";
}