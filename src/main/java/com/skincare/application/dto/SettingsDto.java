
package com.skincare.application.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SettingsDto {
    private Map<String, Object> settings;
    private String category;
}
