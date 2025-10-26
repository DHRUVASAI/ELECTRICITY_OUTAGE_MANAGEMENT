package com.power.frontend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

/**
 * Base API Service for communicating with Python Django backend
 * Pure Java - no JavaScript
 */
@Service
@RequiredArgsConstructor
public class ApiService {
    
    private final RestTemplate restTemplate;
    
    @Value("${backend.api.url}")
    private String backendUrl;
    
    private String authToken;
    
    public void setAuthToken(String token) {
        this.authToken = token;
    }
    
    public String getAuthToken() {
        return authToken;
    }
    
    protected HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (authToken != null && !authToken.isEmpty()) {
            headers.setBearerAuth(authToken);
        }
        return headers;
    }
    
    public <T> ResponseEntity<T> get(String endpoint, Class<T> responseType) {
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        return restTemplate.exchange(
            backendUrl + endpoint,
            HttpMethod.GET,
            entity,
            responseType
        );
    }
    
    public <T, R> ResponseEntity<R> post(String endpoint, T body, Class<R> responseType) {
        HttpEntity<T> entity = new HttpEntity<>(body, createHeaders());
        return restTemplate.exchange(
            backendUrl + endpoint,
            HttpMethod.POST,
            entity,
            responseType
        );
    }
    
    public <T, R> ResponseEntity<R> put(String endpoint, T body, Class<R> responseType) {
        HttpEntity<T> entity = new HttpEntity<>(body, createHeaders());
        return restTemplate.exchange(
            backendUrl + endpoint,
            HttpMethod.PUT,
            entity,
            responseType
        );
    }
    
    public void delete(String endpoint) {
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        restTemplate.exchange(
            backendUrl + endpoint,
            HttpMethod.DELETE,
            entity,
            Void.class
        );
    }
}
