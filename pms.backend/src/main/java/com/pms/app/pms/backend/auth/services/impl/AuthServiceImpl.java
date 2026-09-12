package com.pms.app.pms.backend.auth.services.impl;

import com.pms.app.pms.backend.auth.payload.RegisterRequest;
import com.pms.app.pms.backend.auth.payload.UserDto;
import com.pms.app.pms.backend.auth.services.AuthService;
import com.pms.app.pms.backend.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;


    @Override
    public UserDto registerUser(RegisterRequest request) {

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        UserDto userDto = new UserDto();

        userDto.setName(request.getName());
        userDto.setEmail(request.getEmail());

        // Pass raw password to UserService so it can be encoded consistently in one place
        userDto.setPassword(request.getPassword());

        return userService.createUser(userDto);
    }
}
