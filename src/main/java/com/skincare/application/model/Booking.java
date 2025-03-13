
package com.skincare.application.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "specialist_id")
    private Specialist specialist;

    @Column(name = "booking_date_time")
    private LocalDateTime bookingDateTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "checked_in_time")
    private LocalDateTime checkedInTime;

    @Column(name = "checked_out_time")
    private LocalDateTime checkedOutTime;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private Set<BookingDetail> bookingDetails = new HashSet<>();

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Review review;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CHECKED_IN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }

    public enum PaymentStatus {
        PENDING,
        PAID,
        REFUNDED,
        FAILED
    }
}
