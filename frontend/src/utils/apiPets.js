import axiosInstance from "@/utils/axios";

/** ✅ Fetch Profile */
export async function fetchProfile(id) {
  try {
    const response = await axiosInstance.get(`/profiles/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile. Please try again.");
  }
}

/** ✅ Fetch All Pets */
export async function fetchPets() {
  try {
    const response = await axiosInstance.get("/pets/");
    return response.data;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw new Error("Failed to fetch pets. Please try again.");
  }
}

/** ✅ Create a New Pet */
export async function createPet(formData) {
  try {
    const response = await axiosInstance.post("/pets/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw new Error(error.response?.data?.message || "Failed to create pet");
  }
}

/** ✅ Update Existing Pet */
export async function updatePet(id, formData) {
  try {
    const response = await axiosInstance.put(`/pets/${id}/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating pet:", error);
    throw new Error(error.response?.data?.message || "Failed to update pet");
  }
}

/** ✅ Delete a Pet */
export async function deletePet(id) {
  try {
    await axiosInstance.delete(`/pets/${id}/`);
    return true; // Successfully deleted
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw new Error("Failed to delete pet");
  }
}

/** ✅ Update Profile */
export async function updateProfile(id, formData) {
  try {
    const response = await axiosInstance.put(`/profiles/${id}/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
}

/** ✅ Fetch Pets by Profile ID */
export async function fetchPetsByProfile(profileId) {
  try {
    const response = await axiosInstance.get(`/pets/`, { params: { profile_id: profileId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile pets:", error);
    throw new Error("Failed to fetch profile pets");
  }
}

/** ✅ Upload Image */
export async function uploadImage(file, type = "pet") {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    const response = await axiosInstance.post("/upload-image/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
