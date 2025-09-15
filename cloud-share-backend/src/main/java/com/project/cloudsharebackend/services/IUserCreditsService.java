package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.UserCredits;

public interface IUserCreditsService {

    UserCredits createInitialCredits(String clerkId);

}