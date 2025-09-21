package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.UserCredits;

public interface IUserCreditsService {

    UserCredits createInitialCredits(String clerkId);

    UserCredits getUserCredits(String clerkId);

    UserCredits getUserCredits();

    Boolean hasEnoughCredits(int requiredCredits);

    UserCredits consumeCredit();
}