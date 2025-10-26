package com.power.frontend.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

/**
 * Service Areas View - Pure Java UI
 */
@Route("areas")
public class AreasView extends VerticalLayout {
    
    public AreasView() {
        setSizeFull();
        setPadding(true);
        
        H2 title = new H2("🗺️ Service Areas");
        
        Button backBtn = new Button("← Back to Dashboard", e -> 
            getUI().ifPresent(ui -> ui.navigate(DashboardView.class)));
        
        add(title, backBtn);
    }
}
