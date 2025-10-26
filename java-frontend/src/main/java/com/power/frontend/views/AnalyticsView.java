package com.power.frontend.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

/**
 * Analytics View - Pure Java UI
 */
@Route("analytics")
public class AnalyticsView extends VerticalLayout {
    
    public AnalyticsView() {
        setSizeFull();
        setPadding(true);
        
        H2 title = new H2("📊 Analytics");
        
        Button backBtn = new Button("← Back to Dashboard", e -> 
            getUI().ifPresent(ui -> ui.navigate(DashboardView.class)));
        
        add(title, backBtn);
    }
}
