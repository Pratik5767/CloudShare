package com.project.cloudsharebackend.services;

import com.project.cloudsharebackend.dto.PaymentDto;
import com.project.cloudsharebackend.dto.PaymentVerificationDto;

public interface IPaymentService {

    PaymentDto createOrder(PaymentDto paymentDto);

    PaymentDto verifyPayment(PaymentVerificationDto verificationDto);
}
