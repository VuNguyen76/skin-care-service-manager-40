
package com.skincare.application.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public enum ERole {
        ROLE_CUSTOMER,
        ROLE_STAFF,
        ROLE_SPECIALIST,
        ROLE_ADMIN
    }
}
