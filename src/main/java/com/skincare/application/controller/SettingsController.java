
package com.skincare.application.controller;

import com.skincare.application.dto.SettingsDto;
import com.skincare.application.model.Settings;
import com.skincare.application.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private SettingsRepository settingsRepository;

    @GetMapping("/general")
    public ResponseEntity<?> getGeneralSettings() {
        List<Settings> settings = settingsRepository.findByCategory("general");
        Map<String, Object> result = new HashMap<>();
        
        for (Settings setting : settings) {
            result.put(setting.getKey(), setting.getValue());
        }
        
        // Add default values if settings are not found
        if (!result.containsKey("siteName")) result.put("siteName", "BeautySkin");
        if (!result.containsKey("siteDescription")) result.put("siteDescription", "Premium skincare services tailored to your unique needs and goals.");
        if (!result.containsKey("contactEmail")) result.put("contactEmail", "contact@beautyskin.com");
        if (!result.containsKey("contactPhone")) result.put("contactPhone", "+84 123 456 789");
        if (!result.containsKey("address")) result.put("address", "123 Đường Làm Đẹp, Quận 1, TP. HCM");
        
        return ResponseEntity.ok(result);
    }

    @PutMapping("/general")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGeneralSettings(@RequestBody Map<String, Object> settings) {
        for (Map.Entry<String, Object> entry : settings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().toString();
            
            Settings setting = settingsRepository.findByKeyAndCategory(key, "general")
                .orElse(new Settings());
            
            setting.setKey(key);
            setting.setValue(value);
            setting.setCategory("general");
            
            settingsRepository.save(setting);
        }
        
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/booking")
    public ResponseEntity<?> getBookingSettings() {
        List<Settings> settings = settingsRepository.findByCategory("booking");
        Map<String, Object> result = new HashMap<>();
        
        for (Settings setting : settings) {
            result.put(setting.getKey(), setting.getValue());
        }
        
        // Add default values if settings are not found
        if (!result.containsKey("allowFutureBookingsDays")) result.put("allowFutureBookingsDays", "30");
        if (!result.containsKey("minAdvanceBookingHours")) result.put("minAdvanceBookingHours", "24");
        if (!result.containsKey("maxServicesPerBooking")) result.put("maxServicesPerBooking", "3");
        if (!result.containsKey("requiresPayment")) result.put("requiresPayment", "true");
        if (!result.containsKey("requiresConfirmation")) result.put("requiresConfirmation", "true");
        if (!result.containsKey("allowCancellationHours")) result.put("allowCancellationHours", "48");
        if (!result.containsKey("workingHoursStart")) result.put("workingHoursStart", "09:00");
        if (!result.containsKey("workingHoursEnd")) result.put("workingHoursEnd", "18:00");
        
        return ResponseEntity.ok(result);
    }

    @PutMapping("/booking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBookingSettings(@RequestBody Map<String, Object> settings) {
        for (Map.Entry<String, Object> entry : settings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().toString();
            
            Settings setting = settingsRepository.findByKeyAndCategory(key, "booking")
                .orElse(new Settings());
            
            setting.setKey(key);
            setting.setValue(value);
            setting.setCategory("booking");
            
            settingsRepository.save(setting);
        }
        
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotificationSettings() {
        List<Settings> settings = settingsRepository.findByCategory("notification");
        Map<String, Object> result = new HashMap<>();
        
        for (Settings setting : settings) {
            result.put(setting.getKey(), setting.getValue());
        }
        
        // Add default values if settings are not found
        if (!result.containsKey("sendBookingConfirmations")) result.put("sendBookingConfirmations", "true");
        if (!result.containsKey("sendBookingReminders")) result.put("sendBookingReminders", "true");
        if (!result.containsKey("reminderHoursBefore")) result.put("reminderHoursBefore", "24");
        if (!result.containsKey("sendCancellationNotifications")) result.put("sendCancellationNotifications", "true");
        if (!result.containsKey("sendAdminNotifications")) result.put("sendAdminNotifications", "true");
        if (!result.containsKey("adminNotificationEmail")) result.put("adminNotificationEmail", "admin@beautyskin.com");
        
        return ResponseEntity.ok(result);
    }

    @PutMapping("/notifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateNotificationSettings(@RequestBody Map<String, Object> settings) {
        for (Map.Entry<String, Object> entry : settings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().toString();
            
            Settings setting = settingsRepository.findByKeyAndCategory(key, "notification")
                .orElse(new Settings());
            
            setting.setKey(key);
            setting.setValue(value);
            setting.setCategory("notification");
            
            settingsRepository.save(setting);
        }
        
        return ResponseEntity.ok(settings);
    }
}
