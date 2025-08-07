package com.project.cloudsharebackend.services;

import com.mongodb.DuplicateKeyException;
import com.project.cloudsharebackend.documents.ProfileDocument;
import com.project.cloudsharebackend.dto.ProfileDto;
import com.project.cloudsharebackend.repositories.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements IProfileService {

    private  final ProfileRepository profileRepository;

    @Override
    public ProfileDto createProfile(ProfileDto profileDto) {

        if (profileRepository.existsByClerkId(profileDto.getClerkId())) {
            return updateProfile(profileDto);
        }
        
         ProfileDocument profile =  ProfileDocument.builder()
                .clerkId(profileDto.getClerkId())
                .email(profileDto.getEmail())
                .firstName(profileDto.getFirstName())
                .lastName(profileDto.getLastName())
                .photoUrl(profileDto.getPhotoUrl())
                .credits(5)
                .createdAt(Instant.now())
                .build();
         profile = profileRepository.save(profile);
         return convertToDto(profile);
    }

    @Override
    public ProfileDto updateProfile(ProfileDto profileDto) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(profileDto.getClerkId());

        if (existingProfile != null) {
            // update fields if provided
            if (profileDto.getEmail() != null && !profileDto.getEmail().isEmpty()) {
                existingProfile.setEmail(profileDto.getEmail());
            }

            if (profileDto.getFirstName() != null && !profileDto.getFirstName().isEmpty()) {
                existingProfile.setFirstName(profileDto.getFirstName());
            }

            if (profileDto.getLastName() != null && !profileDto.getLastName().isEmpty()) {
                existingProfile.setLastName(profileDto.getLastName());
            }

            if (profileDto.getPhotoUrl() != null && !profileDto.getPhotoUrl().isEmpty()) {
                existingProfile.setPhotoUrl(profileDto.getPhotoUrl());
            }

            profileRepository.save(existingProfile);
            return convertToDto(existingProfile);
        }
        return null;
    }

    @Override
    public boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }

    @Override
    public void deleteProfile(String clerkId) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(clerkId);
        if (existingProfile != null) {
            profileRepository.delete(existingProfile);
        }
    }

    private ProfileDto convertToDto(ProfileDocument profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .photoUrl(profile.getPhotoUrl())
                .credits(profile.getCredits())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}