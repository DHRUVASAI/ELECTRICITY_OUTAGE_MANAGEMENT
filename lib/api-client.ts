const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

const mockUsers = [
  {
    userId: 1,
    username: "admin",
    email: "admin@electricity.com",
    phone: "555-0001",
    address: "123 Main St",
    userType: "ADMIN",
    state: "TS", // Telangana
    password: "password",
  },
  {
    userId: 2,
    username: "user1",
    email: "user1@electricity.com",
    phone: "555-0002",
    address: "456 Oak Ave",
    userType: "USER",
    state: "TS", // Telangana
    password: "password",
  },
]

import { INDIAN_STATES } from "./indian-states-data"

const mockAreas = INDIAN_STATES.flatMap((state, stateIndex) =>
  state.districts.map((district, districtIndex) => ({
    areaId: stateIndex * 100 + districtIndex + 1,
    areaName: district.districtName,
    region: `${district.districtName}, ${state.stateName}`,
    state: state.stateCode,
    stateName: state.stateName,
    totalUsers: Math.floor(Math.random() * 10000) + 3000,
    cities: district.cities,
  })),
)

const mockOutages = [
  {
    outageId: 1,
    userId: 2,
    areaId: 1,
    location: "Banjara Hills, Hyderabad",
    description: "Power outage affecting central Hyderabad",
    reportedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    restorationTime: null,
    status: "IN_PROGRESS",
    user: { userId: 2, username: "user1" },
    area: { areaId: 1, areaName: "Hyderabad Central", region: "Hyderabad" },
  },
  {
    outageId: 2,
    userId: 2,
    areaId: 2,
    location: "Secunderabad Railway Station Area",
    description: "Transformer failure in Secunderabad North",
    reportedTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    restorationTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: "RESOLVED",
    user: { userId: 2, username: "user1" },
    area: { areaId: 2, areaName: "Secunderabad North", region: "Secunderabad" },
  },
  {
    outageId: 3,
    userId: 2,
    areaId: 3,
    location: "Kukatpally Main Road",
    description: "Downed power lines in Kukatpally East",
    reportedTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    restorationTime: null,
    status: "REPORTED",
    user: { userId: 2, username: "user1" },
    area: { areaId: 3, areaName: "Kukatpally East", region: "Hyderabad" },
  },
]

const mockNotifications = [
  {
    notificationId: 1,
    userId: 2,
    outageId: 1,
    message: "Power outage reported in Banjara Hills, Hyderabad",
    type: "OUTAGE_REPORTED",
    sentTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    notificationId: 2,
    userId: 2,
    outageId: 2,
    message: "Outage in Secunderabad North has been resolved",
    type: "OUTAGE_RESOLVED",
    sentTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    notificationId: 3,
    userId: 2,
    outageId: 1,
    message: "Status update: Restoration in progress for Hyderabad Central",
    type: "STATUS_UPDATE",
    sentTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    notificationId: 4,
    userId: 2,
    outageId: 3,
    message: "New outage reported in Kukatpally East",
    type: "OUTAGE_REPORTED",
    sentTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
  },
]

async function mockLogin(username: string, password: string): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase())

  if (!user) {
    return { error: "Invalid username or password" }
  }

  if (user.password !== password) {
    return { error: "Invalid username or password" }
  }

  return {
    data: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      userType: user.userType,
      state: user.state,
      token: `mock-token-${user.userId}`,
    },
  }
}

async function mockRegister(userData: any): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const existingUser = mockUsers.find((u) => u.username.toLowerCase() === userData.username.toLowerCase())
  if (existingUser) {
    return { error: "Username already exists" }
  }

  const newUser = {
    userId: mockUsers.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || "",
    address: userData.address || "",
    userType: "USER",
    state: userData.state || "TS",
  }

  mockUsers.push(newUser)

  return {
    data: {
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      userType: newUser.userType,
      state: newUser.state,
      token: `mock-token-${newUser.userId}`,
    },
  }
}

async function mockGetAllOutages(): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return { data: mockOutages }
}

async function mockGetOutagesByUser(userId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const userOutages = mockOutages.filter((o) => o.userId === userId)
  return { data: userOutages }
}

async function mockGetOutagesByStatus(status: string): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const statusOutages = mockOutages.filter((o) => o.status === status)
  return { data: statusOutages }
}

async function mockGetOutagesByArea(areaId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const areaOutages = mockOutages.filter((o) => o.areaId === areaId)
  return { data: areaOutages }
}

async function mockGetOutageById(outageId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const outage = mockOutages.find((o) => o.outageId === outageId)
  if (!outage) {
    return { error: "Outage not found" }
  }
  return { data: outage }
}

async function mockUpdateOutageStatus(outageId: number, status: string): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const outage = mockOutages.find((o) => o.outageId === outageId)
  if (!outage) {
    return { error: "Outage not found" }
  }
  outage.status = status as any
  if (status === "RESOLVED") {
    outage.restorationTime = new Date().toISOString()
  }
  return { data: outage }
}

async function mockDeleteOutage(outageId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockOutages.findIndex((o) => o.outageId === outageId)
  if (index === -1) {
    return { error: "Outage not found" }
  }
  mockOutages.splice(index, 1)
  return { data: { success: true } }
}

async function mockGetAllAreas(stateCode?: string): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  if (stateCode) {
    const filteredAreas = mockAreas.filter((area) => area.state === stateCode)
    return { data: filteredAreas }
  }

  return { data: mockAreas }
}

async function mockGetAreaById(areaId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const area = mockAreas.find((a) => a.areaId === areaId)
  if (!area) {
    return { error: "Area not found" }
  }
  return { data: area }
}

async function mockCreateArea(areaData: any): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newArea = {
    areaId: Math.max(...mockAreas.map((a) => a.areaId)) + 1,
    ...areaData,
  }
  mockAreas.push(newArea)
  return { data: newArea }
}

async function mockUpdateArea(areaId: number, areaData: any): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const areaIndex = mockAreas.findIndex((a) => a.areaId === areaId)
  if (areaIndex === -1) {
    return { error: "Area not found" }
  }
  mockAreas[areaIndex] = { ...mockAreas[areaIndex], ...areaData }
  return { data: mockAreas[areaIndex] }
}

async function mockDeleteArea(areaId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockAreas.findIndex((a) => a.areaId === areaId)
  if (index === -1) {
    return { error: "Area not found" }
  }
  mockAreas.splice(index, 1)
  return { data: { success: true } }
}

async function mockGetNotifications(userId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const userNotifications = mockNotifications.filter((n) => n.userId === userId)
  return { data: userNotifications }
}

async function mockMarkNotificationAsRead(notificationId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const notification = mockNotifications.find((n) => n.notificationId === notificationId)
  if (!notification) {
    return { error: "Notification not found" }
  }
  notification.isRead = true
  return { data: notification }
}

async function mockMarkAllNotificationsAsRead(userId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  mockNotifications.forEach((n) => {
    if (n.userId === userId) {
      n.isRead = true
    }
  })
  return { data: { success: true } }
}

async function mockDeleteNotification(notificationId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const index = mockNotifications.findIndex((n) => n.notificationId === notificationId)
  if (index === -1) {
    return { error: "Notification not found" }
  }
  mockNotifications.splice(index, 1)
  return { data: { success: true } }
}

async function mockReportOutage(outageData: any): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  try {
    const user = mockUsers.find((u) => u.userId === outageData.userId)
    const area = mockAreas.find((a) => a.areaId === outageData.areaId)

    const newOutage = {
      outageId: Math.max(...mockOutages.map((o) => o.outageId), 0) + 1,
      userId: outageData.userId,
      areaId: outageData.areaId,
      location: outageData.location,
      description: outageData.description,
      reportedTime: new Date().toISOString(),
      restorationTime: null,
      status: "REPORTED" as const,
      user: user
        ? { userId: user.userId, username: user.username }
        : { userId: outageData.userId, username: "Unknown" },
      area: area
        ? { areaId: area.areaId, areaName: area.areaName, region: area.region }
        : { areaId: outageData.areaId, areaName: "Unknown", region: "Unknown" },
    }

    mockOutages.push(newOutage)
    return { data: newOutage }
  } catch (error) {
    console.error("[v0] Error reporting outage:", error)
    return { error: "Failed to report outage" }
  }
}

async function mockGetUser(userId: number): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const user = mockUsers.find((u) => u.userId === userId)
  if (!user) {
    return { error: "User not found" }
  }
  const { password, ...userWithoutPassword } = user
  return { data: userWithoutPassword }
}

async function mockUpdateUser(userId: number, userData: any): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const userIndex = mockUsers.findIndex((u) => u.userId === userId)
  if (userIndex === -1) {
    return { error: "User not found" }
  }
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData }
  const { password, ...userWithoutPassword } = mockUsers[userIndex]
  return { data: userWithoutPassword }
}

// Helper function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    
    if (token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || data.message || 'An error occurred' }
    }

    return { data }
  } catch (error) {
    console.error('API call error:', error)
    return { error: 'Network error. Please check your connection.' }
  }
}

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await apiCall<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
    })

    if (response.data?.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }

    return response
  },

  register: async (userData: {
    username: string
    email: string
    password: string
    phone: string
    address: string
    state?: string
  }) => {
    const response = await apiCall<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (response.data?.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }

    return response
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
}

export const userApi = {
  getUser: async (userId: number) => {
    return apiCall<any>('/auth/me', { method: 'GET' })
  },
  updateUser: async (userId: number, userData: any) => {
    return apiCall<any>('/auth/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },
}

export const outageApi = {
  reportOutage: async (outageData: {
    userId: number
    areaId: number
    location: string
    description: string
    title?: string
  }) => {
    return apiCall<any>('/outages', {
      method: 'POST',
      body: JSON.stringify({
        title: outageData.title || 'Power Outage',
        description: outageData.description,
        location: outageData.location,
        area_id: outageData.areaId,
      }),
    })
  },

  getAllOutages: async () => {
    return apiCall<any[]>('/outages', { method: 'GET' })
  },
  
  getOutageById: async (outageId: number) => {
    return apiCall<any>(`/outages/${outageId}`, { method: 'GET' })
  },
  
  getOutagesByArea: async (areaId: number) => {
    return apiCall<any[]>(`/outages?area_id=${areaId}`, { method: 'GET' })
  },
  
  getOutagesByStatus: async (status: string) => {
    return apiCall<any[]>(`/outages?status=${status}`, { method: 'GET' })
  },
  
  getOutagesByUser: async (userId: number) => {
    return apiCall<any[]>(`/outages?user_id=${userId}`, { method: 'GET' })
  },
  
  updateOutageStatus: async (outageId: number, status: string) => {
    return apiCall<any>(`/outages/${outageId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },
  
  deleteOutage: async (outageId: number) => {
    return apiCall<any>(`/outages/${outageId}`, { method: 'DELETE' })
  },
}

export const areaApi = {
  getAllAreas: async (stateCode?: string) => {
    const query = stateCode ? `?search=${stateCode}` : ''
    return apiCall<any[]>(`/areas${query}`, { method: 'GET' })
  },
  
  getAreaById: async (areaId: number) => {
    return apiCall<any>(`/areas/${areaId}`, { method: 'GET' })
  },
  
  createArea: async (areaData: { areaName: string; region: string; totalUsers: number; code?: string }) => {
    return apiCall<any>('/areas', {
      method: 'POST',
      body: JSON.stringify({
        name: areaData.areaName,
        code: areaData.code || areaData.areaName.toUpperCase().replace(/\s+/g, '_'),
        description: areaData.region,
        total_users: areaData.totalUsers,
      }),
    })
  },
  
  updateArea: async (areaId: number, areaData: any) => {
    return apiCall<any>(`/areas/${areaId}`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    })
  },
  
  deleteArea: async (areaId: number) => {
    return apiCall<any>(`/areas/${areaId}`, { method: 'DELETE' })
  },
}

export const notificationApi = {
  getNotifications: async (userId: number) => {
    return apiCall<any[]>('/notifications', { method: 'GET' })
  },
  
  markAsRead: async (notificationId: number) => {
    return apiCall<any>(`/notifications/${notificationId}`, { method: 'PUT' })
  },
  
  markAllAsRead: async (userId: number) => {
    return apiCall<any>('/notifications/mark-all-read', { method: 'PUT' })
  },
  
  deleteNotification: async (notificationId: number) => {
    return apiCall<any>(`/notifications/${notificationId}`, { method: 'DELETE' })
  },
}

export const realtimeNotificationApi = {
  // Fetch notifications from external government alerts API
  getGovernmentAlerts: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch("https://api.example.com/power-alerts", {
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return { data: await response.json() }
    } catch (error) {
      return { error: `Failed to fetch government alerts: ${error}` }
    }
  },

  // Fetch weather-related power alerts
  getWeatherAlerts: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch("https://api.example.com/weather-alerts", {
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return { data: await response.json() }
    } catch (error) {
      return { error: `Failed to fetch weather alerts: ${error}` }
    }
  },

  // Fetch scheduled maintenance information
  getMaintenanceSchedule: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch("https://api.example.com/maintenance-schedule", {
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return { data: await response.json() }
    } catch (error) {
      return { error: `Failed to fetch maintenance schedule: ${error}` }
    }
  },

  // Fetch real-time outage status from external source
  getRealtimeOutageStatus: async (areaId?: number): Promise<ApiResponse<any>> => {
    try {
      const url = areaId
        ? `https://api.example.com/outage-status?areaId=${areaId}`
        : "https://api.example.com/outage-status"
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return { data: await response.json() }
    } catch (error) {
      return { error: `Failed to fetch outage status: ${error}` }
    }
  },
}
