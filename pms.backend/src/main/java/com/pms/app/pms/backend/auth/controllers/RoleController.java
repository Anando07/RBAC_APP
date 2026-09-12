package com.pms.app.pms.backend.auth.controllers;

import com.pms.app.pms.backend.auth.config.AppConstants;
import com.pms.app.pms.backend.auth.payload.RoleDto;
import com.pms.app.pms.backend.auth.repositories.RoleRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@AllArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final ModelMapper mapper;

    @PreAuthorize("hasAnyRole('" + AppConstants.ADMIN_ROLE + "','" + AppConstants.ADMINISTRATOR_ROLE + "')")
    @GetMapping
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleRepository.findAll()
                .stream()
                .map(role -> mapper.map(role, RoleDto.class))
                .toList();
        return ResponseEntity.ok(roles);
    }
}