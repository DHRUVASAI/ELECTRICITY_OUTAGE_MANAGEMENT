package com.power.frontend.views;

import com.power.frontend.models.Outage;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

/**
 * Outages View - Pure Java UI
 * Display and manage outages using Java Grid component
 */
@Route("outages")
public class OutagesView extends VerticalLayout {
    
    public OutagesView() {
        setSizeFull();
        setPadding(true);
        
        H2 title = new H2("⚡ Power Outages");
        
        Button backBtn = new Button("← Back to Dashboard", e -> 
            getUI().ifPresent(ui -> ui.navigate(DashboardView.class)));
        
        // Create Java Grid (no HTML/JavaScript)
        Grid<Outage> grid = new Grid<>(Outage.class, false);
        grid.addColumn(Outage::getLocation).setHeader("Location");
        grid.addColumn(Outage::getStatus).setHeader("Status");
        grid.addColumn(Outage::getPriority).setHeader("Priority");
        grid.addColumn(Outage::getReportedAt).setHeader("Reported");
        
        // Mock data
        List<Outage> outages = getMockOutages();
        grid.setItems(outages);
        
        add(title, backBtn, grid);
    }
    
    private List<Outage> getMockOutages() {
        List<Outage> outages = new ArrayList<>();
        outages.add(new Outage(1L, "Downtown Area", "Power line down", "REPORTED", "HIGH", 1L, "Central", 1L, "John Doe", "2024-01-15 10:30", null, 150));
        outages.add(new Outage(2L, "North District", "Transformer issue", "INVESTIGATING", "CRITICAL", 2L, "North", 2L, "Jane Smith", "2024-01-15 09:15", null, 300));
        outages.add(new Outage(3L, "East Side", "Scheduled maintenance", "RESOLVED", "LOW", 3L, "East", 1L, "John Doe", "2024-01-14 14:00", "2024-01-14 16:00", 50));
        return outages;
    }
}
