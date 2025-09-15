package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.UserCredits;
import com.project.cloudsharebackend.repositories.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsServiceImpl implements IUserCreditsService {

    private final UserCreditsRepository userCreditsRepository;

    @Override
    public UserCredits createInitialCredits(String clerkId) {
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();
        return userCreditsRepository.save(userCredits);
    }
}
