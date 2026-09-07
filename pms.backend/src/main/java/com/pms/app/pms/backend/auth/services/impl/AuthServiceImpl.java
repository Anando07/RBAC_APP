package com.pms.app.pms.backend.auth.services.impl;

import com.pms.app.pms.backend.auth.payload.RegisterRequest;
import com.pms.app.pms.backend.auth.payload.UserDto;
import com.pms.app.pms.backend.auth.services.AuthService;
import com.pms.app.pms.backend.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private  final PasswordEncoder passwordEncoder;


    @Override
    public UserDto registerUser(RegisterRequest request) {

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        UserDto userDto = new UserDto();

        userDto.setName(request.getName());
        userDto.setEmail(request.getEmail());

        userDto.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        return userService.createUser(userDto);
    }
}
