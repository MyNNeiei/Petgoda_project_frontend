const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Fetch profile data
export async function fetchProfile(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}/`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw new Error("Failed to fetch profile")
  }
}

// Fetch all pets
export async function fetchPets() {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching pets:", error)
    throw new Error("Failed to fetch pets")
  }
}

// Create a new pet
export async function createPet(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create pet")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating pet:", error)
    throw error
  }
}

// Update an existing pet
export async function updatePet(id, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update pet")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating pet:", error)
    throw error
  }
}

// Delete a pet
export async function deletePet(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete pet")
    }

    return true
  } catch (error) {
    console.error("Error deleting pet:", error)
    throw error
  }
}

// Update profile
export async function updateProfile(id, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}/`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update profile")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Fetch pets by profile ID
export async function fetchPetsByProfile(profileId) {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/?profile_id=${profileId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching profile pets:", error)
    throw new Error("Failed to fetch profile pets")
  }
}

// Upload image
export async function uploadImage(file, type = "pet") {
  try {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("type", type)

    const response = await fetch(`${API_BASE_URL}/upload-image/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Helper function to handle API errors
export function handleApiError(error) {
  console.error("API Error:", error)
  let errorMessage = "An unexpected error occurred"

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage = error.response.data.message || error.response.data.detail || errorMessage
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = "No response received from server"
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || errorMessage
  }

  return errorMessage
}

// Format date helper
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format file size helper
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}