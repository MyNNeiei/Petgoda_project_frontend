const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function fetchProfiles() {
  const response = await fetch(`${API_URL}/profiles/`)
  if (!response.ok) throw new Error('Failed to fetch profiles')
  return response.json()
}

export async function fetchProfile(id) {
  const response = await fetch(`${API_URL}/profiles/${id}/`)
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}

export async function fetchPets() {
  const response = await fetch(`${API_URL}/pets/`)
  if (!response.ok) throw new Error('Failed to fetch pets')
  return response.json()
}

export async function createPet(formData) {
  const response = await fetch(`${API_URL}/pets/`, {
    method: 'POST',
    body: formData, // FormData for handling file uploads
  })
  if (!response.ok) throw new Error('Failed to create pet')
  return response.json()
}

export async function updatePet(id, formData) {
  const response = await fetch(`${API_URL}/pets/${id}/`, {
    method: 'PATCH',
    body: formData,
  })
  if (!response.ok) throw new Error('Failed to update pet')
  return response.json()
}

export async function deletePet(id) {
  const response = await fetch(`${API_URL}/pets/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete pet')
  return response.ok
}
