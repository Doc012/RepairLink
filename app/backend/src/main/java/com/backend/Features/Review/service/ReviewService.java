package com.backend.Features.Review.service;


import com.backend.Features.Booking.entity.Booking;
import com.backend.Features.Booking.repository.BookingRepository;
import com.backend.Features.Customer.entity.Customer;
import com.backend.Features.Customer.repository.CustomerRepository;
import com.backend.Features.Review.dto.ReviewRequest;
import com.backend.Features.Review.dto.ReviewResponse;
import com.backend.Features.Review.entity.Review;
import com.backend.Features.Review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    public ReviewResponse createReview(ReviewRequest reviewRequest) {
        Customer customer = customerRepository.findById(reviewRequest.getCustomerID())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = bookingRepository.findById(reviewRequest.getBookingID())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getCustomer().getCustomerID() != reviewRequest.getCustomerID()) {
            throw new RuntimeException("Booking does not belong to the customer");
        }

        Review review = new Review();
        review.setCustomer(customer);
        review.setBooking(booking);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByService(int serviceID) {
        List<Review> reviews = reviewRepository.findByBookingServiceClassServiceID(serviceID);
        return reviews.stream().map(this::mapToReviewResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByProvider(int providerID) {
        List<Review> reviews = reviewRepository.findByBookingProviderProviderID(providerID);
        return reviews.stream().map(this::mapToReviewResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getMyReviews(int customerID) {
        List<Review> reviews = reviewRepository.findByCustomerCustomerID(customerID);
        return reviews.stream().map(this::mapToReviewResponse).collect(Collectors.toList());
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setReviewID(review.getReviewID());
        response.setCustomerID(review.getCustomer().getCustomerID());
        response.setBookingID(review.getBooking().getBookingID());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
