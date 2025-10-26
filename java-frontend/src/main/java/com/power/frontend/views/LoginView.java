package com.power.frontend.views;

import com.power.frontend.services.ApiService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;
import lombok.RequiredArgsConstructor;

/**
 * Login View - Pure Java UI
 * No HTML, CSS, or JavaScript - everything in Java
 */
@Route("")
@RequiredArgsConstructor
public class LoginView extends VerticalLayout {
    
    private final ApiService apiService;
    
    public LoginView(ApiService apiService) {
        this.apiService = apiService;
        
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
        
        // Title
        H1 title = new H1("⚡ Power Outage System");
        title.getStyle().set("color", "#2563eb");
        
        Paragraph subtitle = new Paragraph("Login to manage electricity outages");
        subtitle.getStyle().set("color", "#64748b");
        
        // Email field
        EmailField email = new EmailField("Email");
        email.setPlaceholder("Enter your email");
        email.setWidth("300px");
        email.setValue("user@power.com");
        
        // Password field
        PasswordField password = new PasswordField("Password");
        password.setPlaceholder("Enter your password");
        password.setWidth("300px");
        password.setValue("user123");
        
        // Login button
        Button loginButton = new Button("Login", event -> {
            handleLogin(email.getValue(), password.getValue());
        });
        loginButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        loginButton.setWidth("300px");
        
        // Register button
        Button registerButton = new Button("Register", event -> {
            getUI().ifPresent(ui -> ui.navigate(RegisterView.class));
        });
        registerButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        registerButton.setWidth("300px");
        
        // Layout
        VerticalLayout formLayout = new VerticalLayout(
            title,
            subtitle,
            email,
            password,
            loginButton,
            registerButton
        );
        formLayout.setAlignItems(Alignment.CENTER);
        formLayout.setWidth("400px");
        formLayout.getStyle()
            .set("background", "white")
            .set("padding", "2rem")
            .set("border-radius", "8px")
            .set("box-shadow", "0 4px 6px rgba(0,0,0,0.1)");
        
        add(formLayout);
    }
    
    private void handleLogin(String email, String password) {
        try {
            // Mock login for demo - replace with actual API call
            if (email.equals("admin@power.com") && password.equals("admin123")) {
                VaadinSession.getCurrent().setAttribute("user", "admin");
                VaadinSession.getCurrent().setAttribute("role", "ADMIN");
                Notification.show("Login successful!").addThemeVariants(NotificationVariant.LUMO_SUCCESS);
                getUI().ifPresent(ui -> ui.navigate(DashboardView.class));
            } else if (email.equals("user@power.com") && password.equals("user123")) {
                VaadinSession.getCurrent().setAttribute("user", email);
                VaadinSession.getCurrent().setAttribute("role", "USER");
                Notification.show("Login successful!").addThemeVariants(NotificationVariant.LUMO_SUCCESS);
                getUI().ifPresent(ui -> ui.navigate(DashboardView.class));
            } else {
                Notification.show("Invalid credentials").addThemeVariants(NotificationVariant.LUMO_ERROR);
            }
        } catch (Exception e) {
            Notification.show("Login failed: " + e.getMessage())
                .addThemeVariants(NotificationVariant.LUMO_ERROR);
        }
    }
}
