
package com.skincare.application.repository;

import com.skincare.application.model.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, String> {
    List<Settings> findByCategory(String category);
    Optional<Settings> findByKeyAndCategory(String key, String category);
}
