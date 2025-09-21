package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.UserCredits;
import com.project.cloudsharebackend.repositories.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsServiceImpl implements IUserCreditsService {

    private final UserCreditsRepository userCreditsRepository;
    private final IProfileService profileService;

    @Override
    public UserCredits createInitialCredits(String clerkId) {
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();
        return userCreditsRepository.save(userCredits);
    }

    @Override
    public UserCredits getUserCredits(String clerkId) {
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));
    }

    @Override
    public UserCredits getUserCredits() {
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    @Override
    public Boolean hasEnoughCredits(int requiredCredits) {
        UserCredits userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }

    @Override
    public UserCredits consumeCredit() {
        UserCredits userCredits = getUserCredits();
        if (userCredits.getCredits() <= 0) {
            return null;
        }
        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepository.save(userCredits);
    }
}
