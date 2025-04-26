package com.backend.Features.Review.controller;

import com.backend.Features.Review.dto.ReviewRequest;
import com.backend.Features.Review.dto.ReviewResponse;
import com.backend.Features.Review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("customer")
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

    @GetMapping("/customer/{customerID}")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(@PathVariable int customerID) {
        List<ReviewResponse> reviews = reviewService.getMyReviews(customerID);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/customer/{customerID}/{reviewID}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable int customerID,
            @PathVariable int reviewID,
            @RequestBody ReviewRequest reviewRequest) {
        ReviewResponse updatedReview = reviewService.updateReview(reviewID, reviewRequest, customerID);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/customer/{customerID}/{reviewID}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable int customerID,
            @PathVariable int reviewID) {
        reviewService.deleteReview(reviewID, customerID);
        return ResponseEntity.noContent().build();
    }
}
