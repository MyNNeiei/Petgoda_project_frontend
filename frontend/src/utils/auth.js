import axiosInstance from "./axios";

export const login = async (formData) => {
  try {
    const response = await axiosInstance.post("auth/login/", formData);
    const authData = response.data;

    localStorage.setItem("token", authData.token);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Token ${authData.token}`;
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: authData.user_id,
        username: authData.username,
        is_staff: authData.is_staff,
      })
    );

    return authData;
  } catch (error) {
    if (error.response?.data) {
      const errorData = error.response.data;

      const formattedErrors = {};
      Object.keys(errorData).forEach((key) => {
        if (Array.isArray(errorData[key])) {
          formattedErrors[key] = errorData[key].map((err) =>
            err.string ? err.string : err
          );
        } else {
          formattedErrors[key] = errorData[key];
        }
      });

      throw formattedErrors;
    }

    throw {
      non_field_errors: ["Unable to connect to the server. Please try again."],
    };
  }
};

export const register = async (formData) => {
  try {
    const response = await axiosInstance.post("auth/register/", formData);
    const authData = response.data;

    localStorage.setItem("token", authData.token);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Token ${authData.token}`;
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: authData.user_id,
        username: authData.username,
      })
    );
    console.log(authData.user_id);

    return authData;
  } catch (error) {
    if (error.response?.data) {
      if (error.response.data.errors) {
        throw error.response.data.errors;
      }
      if (error.response.data.message) {
        throw {
          non_field_errors: [error.response.data.message],
        };
      }
    }
    throw {
      non_field_errors: ["Unable to connect to the server. Please try again."],
    };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("auth/logout/");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axiosInstance.defaults.headers.common["Authorization"];
    return true;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosInstance.defaults.headers.common["Authorization"];
      return true;
    }
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const isStaffUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.is_staff === true;
};
