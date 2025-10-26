package com.power.frontend.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

/**
 * Register View - Pure Java UI
 */
@Route("register")
public class RegisterView extends VerticalLayout {
    
    public RegisterView() {
        setSizeFull();
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
        
        H1 title = new H1("Create Account");
        
        TextField username = new TextField("Username");
        username.setWidth("300px");
        
        EmailField email = new EmailField("Email");
        email.setWidth("300px");
        
        TextField phone = new TextField("Phone");
        phone.setWidth("300px");
        
        PasswordField password = new PasswordField("Password");
        password.setWidth("300px");
        
        PasswordField confirmPassword = new PasswordField("Confirm Password");
        confirmPassword.setWidth("300px");
        
        Button registerButton = new Button("Register", event -> {
            if (password.getValue().equals(confirmPassword.getValue())) {
                Notification.show("Registration successful!").addThemeVariants(NotificationVariant.LUMO_SUCCESS);
                getUI().ifPresent(ui -> ui.navigate(LoginView.class));
            } else {
                Notification.show("Passwords do not match").addThemeVariants(NotificationVariant.LUMO_ERROR);
            }
        });
        registerButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        registerButton.setWidth("300px");
        
        Button backButton = new Button("Back to Login", event -> {
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
        });
        backButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        backButton.setWidth("300px");
        
        VerticalLayout formLayout = new VerticalLayout(
            title, username, email, phone, password, confirmPassword,
            registerButton, backButton
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
}
