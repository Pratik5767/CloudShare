package com.project.cloudsharebackend.repositories;

import com.project.cloudsharebackend.documents.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCreditsRepository extends MongoRepository<UserCredits, String> {

}