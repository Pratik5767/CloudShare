package com.project.cloudsharebackend.controllers;

import com.project.cloudsharebackend.dto.ProfileDto;
import com.project.cloudsharebackend.services.IProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final IProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDto profileDto) {
        HttpStatus status = profileService.existsByClerkId(profileDto.getClerkId())
                ? HttpStatus.OK : HttpStatus.CREATED;
        ProfileDto savedProfile = profileService.createProfile(profileDto);
        return ResponseEntity.status(status).body(savedProfile);
    }
}