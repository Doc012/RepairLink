package com.backend.Features.Review.controller;

import com.backend.Features.Review.dto.ReviewRequest;
import com.backend.Features.Review.dto.ReviewResponse;
import com.backend.Features.Review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest reviewRequest) {
        ReviewResponse reviewResponse = reviewService.createReview(reviewRequest);
        return ResponseEntity.ok(reviewResponse);
    }

    @GetMapping("/service/{serviceID}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByService(@PathVariable int serviceID) {
        List<ReviewResponse> reviews = reviewService.getReviewsByService(serviceID);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/provider/{providerID}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProvider(@PathVariable int providerID) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProvider(providerID);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(@RequestParam int customerID) {
        List<ReviewResponse> reviews = reviewService.getMyReviews(customerID);
        return ResponseEntity.ok(reviews);
    }
}
