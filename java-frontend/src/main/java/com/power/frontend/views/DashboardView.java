package com.power.frontend.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;

/**
 * Dashboard View - Pure Java UI
 * Main dashboard with statistics and navigation
 */
@Route("dashboard")
public class DashboardView extends VerticalLayout {
    
    public DashboardView() {
        setSizeFull();
        setPadding(true);
        
        // Check authentication
        String user = (String) VaadinSession.getCurrent().getAttribute("user");
        if (user == null) {
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
            return;
        }
        
        // Header
        H2 title = new H2("⚡ Dashboard");
        
        // Stats cards
        HorizontalLayout statsLayout = new HorizontalLayout();
        statsLayout.setWidthFull();
        statsLayout.add(
            createStatCard("Total Outages", "156", "#3b82f6"),
            createStatCard("Active", "23", "#ef4444"),
            createStatCard("Resolved", "133", "#10b981"),
            createStatCard("Affected Users", "1,234", "#f59e0b")
        );
        
        // Navigation buttons
        HorizontalLayout navLayout = new HorizontalLayout();
        navLayout.setWidthFull();
        
        Button outagesBtn = new Button("View Outages", e -> 
            getUI().ifPresent(ui -> ui.navigate(OutagesView.class)));
        
        Button areasBtn = new Button("Service Areas", e -> 
            getUI().ifPresent(ui -> ui.navigate(AreasView.class)));
        
        Button analyticsBtn = new Button("Analytics", e -> 
            getUI().ifPresent(ui -> ui.navigate(AnalyticsView.class)));
        
        Button logoutBtn = new Button("Logout", e -> {
            VaadinSession.getCurrent().close();
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
        });
        
        navLayout.add(outagesBtn, areasBtn, analyticsBtn, logoutBtn);
        
        add(title, statsLayout, navLayout);
    }
    
    private VerticalLayout createStatCard(String label, String value, String color) {
        VerticalLayout card = new VerticalLayout();
        card.setWidth("100%");
        card.getStyle()
            .set("background", "white")
            .set("padding", "1.5rem")
            .set("border-radius", "8px")
            .set("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
            .set("border-left", "4px solid " + color);
        
        Paragraph labelText = new Paragraph(label);
        labelText.getStyle().set("color", "#64748b").set("margin", "0");
        
        Span valueText = new Span(value);
        valueText.getStyle()
            .set("font-size", "2rem")
            .set("font-weight", "bold")
            .set("color", color);
        
        card.add(labelText, valueText);
        return card;
    }
}
