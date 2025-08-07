package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.dto.ProfileDto;
import org.springframework.http.HttpStatus;

public interface IProfileService {
    ProfileDto createProfile(ProfileDto profileDto);

    ProfileDto updateProfile(ProfileDto profileDto);

    boolean existsByClerkId(String clerkId);

    void deleteProfile(String clerkId);
}
