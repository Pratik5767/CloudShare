package com.project.cloudsharebackend.controllers;

import com.project.cloudsharebackend.documents.PaymentTransaction;
import com.project.cloudsharebackend.documents.ProfileDocument;
import com.project.cloudsharebackend.repositories.PaymentTransactionRepository;
import com.project.cloudsharebackend.services.IProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final IProfileService profileService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @GetMapping("/get")
    public ResponseEntity<List<PaymentTransaction>> getUserTransactions() {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        String clerkId = currentProfile.getClerkId();

        List<PaymentTransaction> transactions = paymentTransactionRepository.findByClerkIdAndStatusOrderByTransactionDateDesc(clerkId, "SUCCESS");
        return ResponseEntity.ok(transactions);
    }
}
