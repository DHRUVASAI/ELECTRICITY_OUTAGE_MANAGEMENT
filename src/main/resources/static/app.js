const API_BASE_URL = "http://localhost:8080/api"
let currentUser = null

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showPage("dashboard")
    loadDashboard()
    loadAreas()
  } else {
    showPage("login")
  }
})

// Page Navigation
function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })

  const page = document.getElementById(pageName + "Page")
  if (page) {
    page.classList.add("active")
  }

  // Show/hide admin link
  const adminLink = document.getElementById("adminLink")
  if (currentUser && currentUser.userType === "ADMIN") {
    adminLink.style.display = "inline"
  } else {
    adminLink.style.display = "none"
  }

  // Load page-specific data
  if (pageName === "dashboard") {
    loadDashboard()
  } else if (pageName === "admin") {
    loadAdminPanel()
  }
}

// Authentication
async function handleLogin(event) {
  event.preventDefault()
  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value
  const errorDiv = document.getElementById("loginError")

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    if (response.ok) {
      currentUser = data
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      errorDiv.classList.remove("show")
      showPage("dashboard")
      loadDashboard()
      loadAreas()
    } else {
      errorDiv.textContent = data.error || "Login failed"
      errorDiv.classList.add("show")
    }
  } catch (error) {
    errorDiv.textContent = "Error: " + error.message
    errorDiv.classList.add("show")
  }
}

async function handleRegister(event) {
  event.preventDefault()
  const username = document.getElementById("regUsername").value
  const email = document.getElementById("regEmail").value
  const password = document.getElementById("regPassword").value
  const phone = document.getElementById("regPhone").value
  const address = document.getElementById("regAddress").value
  const errorDiv = document.getElementById("registerError")

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phone, address }),
    })

    const data = await response.json()
    if (response.ok) {
      errorDiv.classList.remove("show")
      alert("Registration successful! Please login.")
      showPage("login")
    } else {
      errorDiv.textContent = data.error || "Registration failed"
      errorDiv.classList.add("show")
    }
  } catch (error) {
    errorDiv.textContent = "Error: " + error.message
    errorDiv.classList.add("show")
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  showPage("login")
}

// Dashboard
async function loadDashboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/outages/all`)
    const outages = await response.json()

    const activeCount = outages.filter((o) => o.status === "REPORTED").length
    const inProgressCount = outages.filter((o) => o.status === "IN_PROGRESS").length
    const resolvedCount = outages.filter((o) => o.status === "RESOLVED").length

    document.getElementById("activeOutages").textContent = activeCount
    document.getElementById("inProgressOutages").textContent = inProgressCount
    document.getElementById("resolvedOutages").textContent = resolvedCount

    const outagesList = document.getElementById("outagesList")
    outagesList.innerHTML = ""

    outages.slice(0, 10).forEach((outage) => {
      const statusClass = `status-${outage.status.toLowerCase()}`
      outagesList.innerHTML += `
                <div class="outage-item">
                    <h4>${outage.location}</h4>
                    <p>${outage.description}</p>
                    <p><strong>Area:</strong> ${outage.area.areaName}</p>
                    <p><strong>Reported:</strong> ${new Date(outage.reportedTime).toLocaleString()}</p>
                    <span class="outage-status ${statusClass}">${outage.status}</span>
                </div>
            `
    })
  } catch (error) {
    console.error("Error loading dashboard:", error)
  }
}

// Report Outage
async function loadAreas() {
  try {
    const response = await fetch(`${API_BASE_URL}/areas/all`)
    const areas = await response.json()
    const select = document.getElementById("areaSelect")
    select.innerHTML = '<option value="">Choose an area...</option>'
    areas.forEach((area) => {
      select.innerHTML += `<option value="${area.areaId}">${area.areaName} (${area.region})</option>`
    })
  } catch (error) {
    console.error("Error loading areas:", error)
  }
}

async function handleReportOutage(event) {
  event.preventDefault()
  const areaId = Number.parseInt(document.getElementById("areaSelect").value)
  const location = document.getElementById("outageLocation").value
  const description = document.getElementById("outageDescription").value
  const errorDiv = document.getElementById("reportError")
  const successDiv = document.getElementById("reportSuccess")

  try {
    const response = await fetch(`${API_BASE_URL}/outages/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.userId,
        areaId,
        location,
        description,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      errorDiv.classList.remove("show")
      successDiv.textContent = "Outage reported successfully!"
      successDiv.classList.add("show")
      event.target.reset()
      setTimeout(() => {
        successDiv.classList.remove("show")
        showPage("dashboard")
        loadDashboard()
      }, 2000)
    } else {
      errorDiv.textContent = data.error || "Failed to report outage"
      errorDiv.classList.add("show")
    }
  } catch (error) {
    errorDiv.textContent = "Error: " + error.message
    errorDiv.classList.add("show")
  }
}

// Admin Panel
async function loadAdminPanel() {
  try {
    const response = await fetch(`${API_BASE_URL}/outages/all`)
    const outages = await response.json()

    const adminList = document.getElementById("adminOutagesList")
    adminList.innerHTML = ""

    outages.forEach((outage) => {
      adminList.innerHTML += `
                <div class="admin-item">
                    <div>
                        <h4>${outage.location}</h4>
                        <p>${outage.description}</p>
                        <p><strong>Status:</strong> ${outage.status}</p>
                    </div>
                    <div class="admin-actions">
                        <select onchange="updateOutageStatus(${outage.outageId}, this.value)">
                            <option value="">Update Status</option>
                            <option value="REPORTED">Reported</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                        <button class="btn-danger" onclick="deleteOutage(${outage.outageId})">Delete</button>
                    </div>
                </div>
            `
    })
  } catch (error) {
    console.error("Error loading admin panel:", error)
  }
}

async function updateOutageStatus(outageId, status) {
  if (!status) return
  try {
    const response = await fetch(`${API_BASE_URL}/outages/${outageId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (response.ok) {
      loadAdminPanel()
    }
  } catch (error) {
    console.error("Error updating status:", error)
  }
}

async function deleteOutage(outageId) {
  if (confirm("Are you sure you want to delete this outage?")) {
    try {
      const response = await fetch(`${API_BASE_URL}/outages/${outageId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        loadAdminPanel()
      }
    } catch (error) {
      console.error("Error deleting outage:", error)
    }
  }
}

async function handleCreateArea(event) {
  event.preventDefault()
  const areaName = document.getElementById("areaName").value
  const region = document.getElementById("areaRegion").value
  const totalUsers = Number.parseInt(document.getElementById("areaTotalUsers").value)

  try {
    const response = await fetch(`${API_BASE_URL}/areas/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areaName, region, totalUsers }),
    })

    if (response.ok) {
      alert("Area created successfully!")
      event.target.reset()
      loadAreas()
      loadAdminPanel()
    }
  } catch (error) {
    console.error("Error creating area:", error)
  }
}
