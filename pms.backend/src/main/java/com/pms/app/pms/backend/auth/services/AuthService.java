package com.pms.app.pms.backend.auth.services;


import com.pms.app.pms.backend.auth.payload.RegisterRequest;
import com.pms.app.pms.backend.auth.payload.UserDto;

public interface AuthService {
    UserDto registerUser(RegisterRequest request);


    //login user

}
