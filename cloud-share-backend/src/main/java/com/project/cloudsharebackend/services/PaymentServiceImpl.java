package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.documents.PaymentTransaction;
import com.project.cloudsharebackend.documents.ProfileDocument;
import com.project.cloudsharebackend.dto.PaymentDto;
import com.project.cloudsharebackend.dto.PaymentVerificationDto;
import com.project.cloudsharebackend.repositories.PaymentTransactionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final IProfileService profileService;
    private final IUserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentDto createOrder(PaymentDto paymentDto) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentDto.getAmount());
            orderRequest.put("currency", paymentDto.getCurrency());
            orderRequest.put("receipt", "order_"+System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

            // create pending transaction record
            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDto.getPlanId())
                    .amount(paymentDto.getAmount())
                    .currency(paymentDto.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName() + " " + currentProfile.getLastName())
                    .build();
            paymentTransactionRepository.save(transaction);
            return PaymentDto.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order created successfully")
                    .build();
        } catch (Exception e) {
            return PaymentDto.builder()
                    .success(false)
                    .message("Error creating order: "  + e.getMessage())
                    .build();
        }
    }

    @Override
    public PaymentDto verifyPayment(PaymentVerificationDto verificationDto) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String data = verificationDto.getRazorpay_order_id() + "|" + verificationDto.getRazorpay_payment_id();
            String generateSignature = generateHmacSha256Signature(data, razorpayKeySecret);
            if (!generateSignature.equals(verificationDto.getRazorpay_signature())) {
                updateTransactionStatus(verificationDto.getRazorpay_order_id(), "FAILED",
                        verificationDto.getRazorpay_payment_id(), null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Payment signature verification failed")
                        .build();
            }

            // Add credits based on plan
            int creditsToAdd = 0;
            String plan = "BASIC";
            switch (verificationDto.getPlanId()) {
                case "premium":
                    creditsToAdd = 500;
                    plan = "PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd = 5000;
                    plan = "ULTIMATE";
                    break;
            }
            if (creditsToAdd > 0) {
                userCreditsService.addCredits(clerkId, creditsToAdd, plan);
                updateTransactionStatus(verificationDto.getRazorpay_order_id(), "SUCCESS",
                        verificationDto.getRazorpay_payment_id(), creditsToAdd);
                return PaymentDto.builder()
                        .success(true)
                        .message("Payment verified and credits added successfully")
                        .credits(userCreditsService.getUserCredits(clerkId).getCredits())
                        .build();
            } else {
                updateTransactionStatus(verificationDto.getRazorpay_order_id(), "FAILED",
                        verificationDto.getRazorpay_payment_id(), null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Invalid plan selected")
                        .build();
            }
        }catch (Exception e) {
            try {
                updateTransactionStatus(verificationDto.getRazorpay_order_id(), "ERROR",
                        verificationDto.getRazorpay_payment_id(), null);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            return PaymentDto.builder()
                    .success(false)
                    .message("Error verifying payment: " + e.getMessage())
                    .build();
        }
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findAll().stream().filter(t ->
                t.getOrderId() != null && t.getOrderId().equals(razorpayOrderId))
                .findFirst()
                .map(transaction -> {
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if (creditsToAdd != null) {
                        transaction.setCreditsAdded(creditsToAdd);
                    }
                    return paymentTransactionRepository.save(transaction);
                }).orElse(null);
    }

    private String generateHmacSha256Signature(String data, String secret)
            throws NoSuchAlgorithmException, InvalidKeyException {
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKey);

        byte[] hmacData = mac.doFinal(data.getBytes());
        return toHexString(hmacData);
    }

    private static String toHexString(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
