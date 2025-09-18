import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/",
  withCredentials: true, // garante que cookies sejam enviados
});

const useAxios = () => {
  const axiosPublicInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllSubjects = async () => {
    const response = await instance.get("subjects");
    return response.data;
  };

  const getSubjectsByCodes = async (codes: string[]) => {
    if (!codes || codes.length === 0) {
      throw new Error("No subject codes provided");
    }

    try {
      const response = await instance.get(
        `/subjects/by-codes?codes=${codes.join(",")}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects by codes:", error);
      throw error;
    }
  };

  const getAllSubjectsWithRelations = async () => {
    try {
      const response = await instance.get("/subjects");
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects with relations:", error);
      throw error;
    }
  };

  const getFilteredSubjects = async (search: string) => {
    try {
      const response = await instance.get(`/subjects?search=${encodeURIComponent(search)}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered subjects:", error);
      throw error;
    }
  };

  const getSubject = async (id: number) => {
    try {
      console.log("Debug - Making request to:", `/subjects/${id}`);

      const response = await instance.get(`/subjects/${id}`);
      console.log("Debug - Request successful:", response.status);
      return response.data;
    } catch (error: any) {
      console.log("Debug - Request failed:", error);

      if (error.response?.status === 401) {
        console.log("Debug - 401 error, redirecting to login");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/signin";
        }
        throw new Error("Session expired - please log in again");
      }

      throw error;
    }
  };


  const getCheckUserExtraInfo = async (email: string) => {
    try {
      const response = await axiosPublicInstance.get("/users/check_extra_info", {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Authentication routes

  const register = async (formData: object) => {
    try {
      const response = await axiosPublicInstance.post("auth/register", formData);
      return response;
    } catch (error) {
      return error;
    }
  };

  const login = async (formData: object) => {
    try {
      const response = await axiosPublicInstance.post("auth/login", formData);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  // Feedback form

  const registerFeedback = async (formData: { message: string }) => {
    try {
      const response = await axiosPublicInstance.post(
        `feedback?message=${formData.message}`
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  return {
    getAllSubjects,
    getSubjectsByCodes,
    getAllSubjectsWithRelations,
    getFilteredSubjects,
    getSubject,
    getCheckUserExtraInfo,
    register,
    login,
    registerFeedback,
  };
};

export default useAxios;
