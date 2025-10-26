import { INDIAN_STATES } from "./indian-states-data"

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  hours?: string
  type: "emergency" | "customer_service" | "regional_office"
  state: string
  priority: number
}

export interface StateEmergencyContacts {
  state: string
  stateName: string
  contacts: EmergencyContact[]
  lastUpdated: string
}

// Dynamic emergency contacts database - can be fetched from API
const emergencyContactsDatabase: Record<string, EmergencyContact[]> = {
  TS: [
    {
      id: "ts-911",
      name: "Emergency Services",
      phone: "911",
      type: "emergency",
      state: "TS",
      priority: 1,
    },
    {
      id: "ts-power-emergency",
      name: "Power Emergency Hotline",
      phone: "1-800-POWER-911",
      type: "emergency",
      state: "TS",
      priority: 2,
    },
    {
      id: "ts-customer-service",
      name: "Customer Service - Telangana",
      phone: "1-800-555-POWER",
      email: "support@powerco.com",
      hours: "24/7",
      type: "customer_service",
      state: "TS",
      priority: 3,
    },
    {
      id: "ts-hyderabad-office",
      name: "Hyderabad Regional Office",
      phone: "(555) 123-4567",
      address: "123 Power Street, Hyderabad, TS 500001",
      hours: "Mon-Fri: 8AM-6PM",
      type: "regional_office",
      state: "TS",
      priority: 4,
    },
  ],
  AP: [
    {
      id: "ap-911",
      name: "Emergency Services",
      phone: "911",
      type: "emergency",
      state: "AP",
      priority: 1,
    },
    {
      id: "ap-power-emergency",
      name: "Power Emergency Hotline",
      phone: "1-800-POWER-911",
      type: "emergency",
      state: "AP",
      priority: 2,
    },
    {
      id: "ap-customer-service",
      name: "Customer Service - Andhra Pradesh",
      phone: "1-800-555-POWER",
      email: "support@powerco.com",
      hours: "24/7",
      type: "customer_service",
      state: "AP",
      priority: 3,
    },
    {
      id: "ap-vijayawada-office",
      name: "Vijayawada Regional Office",
      phone: "(555) 234-5678",
      address: "456 Electric Ave, Vijayawada, AP 520001",
      hours: "Mon-Fri: 8AM-6PM",
      type: "regional_office",
      state: "AP",
      priority: 4,
    },
  ],
  KA: [
    {
      id: "ka-911",
      name: "Emergency Services",
      phone: "911",
      type: "emergency",
      state: "KA",
      priority: 1,
    },
    {
      id: "ka-power-emergency",
      name: "Power Emergency Hotline",
      phone: "1-800-POWER-911",
      type: "emergency",
      state: "KA",
      priority: 2,
    },
    {
      id: "ka-customer-service",
      name: "Customer Service - Karnataka",
      phone: "1-800-555-POWER",
      email: "support@powerco.com",
      hours: "24/7",
      type: "customer_service",
      state: "KA",
      priority: 3,
    },
    {
      id: "ka-bangalore-office",
      name: "Bangalore Regional Office",
      phone: "(555) 345-6789",
      address: "789 Voltage Blvd, Bangalore, KA 560001",
      hours: "Mon-Fri: 8AM-6PM",
      type: "regional_office",
      state: "KA",
      priority: 4,
    },
  ],
  MH: [
    {
      id: "mh-911",
      name: "Emergency Services",
      phone: "911",
      type: "emergency",
      state: "MH",
      priority: 1,
    },
    {
      id: "mh-power-emergency",
      name: "Power Emergency Hotline",
      phone: "1-800-POWER-911",
      type: "emergency",
      state: "MH",
      priority: 2,
    },
    {
      id: "mh-customer-service",
      name: "Customer Service - Maharashtra",
      phone: "1-800-555-POWER",
      email: "support@powerco.com",
      hours: "24/7",
      type: "customer_service",
      state: "MH",
      priority: 3,
    },
    {
      id: "mh-mumbai-office",
      name: "Mumbai Regional Office",
      phone: "(555) 456-7890",
      address: "321 Current Lane, Mumbai, MH 400001",
      hours: "Mon-Fri: 8AM-6PM",
      type: "regional_office",
      state: "MH",
      priority: 4,
    },
  ],
}

export class EmergencyContactsService {
  // Fetch emergency contacts for a specific state
  static async getContactsByState(stateCode: string): Promise<StateEmergencyContacts | null> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const contacts = emergencyContactsDatabase[stateCode] || []
      const state = INDIAN_STATES.find((s) => s.stateCode === stateCode)

      if (!state) return null

      return {
        state: stateCode,
        stateName: state.stateName,
        contacts: contacts.sort((a, b) => a.priority - b.priority),
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("[v0] Error fetching emergency contacts:", error)
      return null
    }
  }

  // Get all emergency contacts across states
  static async getAllContacts(): Promise<StateEmergencyContacts[]> {
    try {
      const allContacts: StateEmergencyContacts[] = []

      for (const state of INDIAN_STATES) {
        const stateContacts = await this.getContactsByState(state.stateCode)
        if (stateContacts) {
          allContacts.push(stateContacts)
        }
      }

      return allContacts
    } catch (error) {
      console.error("[v0] Error fetching all contacts:", error)
      return []
    }
  }

  // Get emergency contacts by type
  static async getContactsByType(
    stateCode: string,
    type: "emergency" | "customer_service" | "regional_office",
  ): Promise<EmergencyContact[]> {
    try {
      const contacts = emergencyContactsDatabase[stateCode] || []
      return contacts.filter((c) => c.type === type).sort((a, b) => a.priority - b.priority)
    } catch (error) {
      console.error("[v0] Error filtering contacts:", error)
      return []
    }
  }

  // Add or update emergency contact (for admin)
  static async updateContact(stateCode: string, contact: EmergencyContact): Promise<boolean> {
    try {
      if (!emergencyContactsDatabase[stateCode]) {
        emergencyContactsDatabase[stateCode] = []
      }

      const index = emergencyContactsDatabase[stateCode].findIndex((c) => c.id === contact.id)

      if (index >= 0) {
        emergencyContactsDatabase[stateCode][index] = contact
      } else {
        emergencyContactsDatabase[stateCode].push(contact)
      }

      return true
    } catch (error) {
      console.error("[v0] Error updating contact:", error)
      return false
    }
  }
}
