package com.pms.app.pms.backend.auth.payload;

public record LoginRequest(
        String email,
        String password
) {
}
