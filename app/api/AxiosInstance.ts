﻿import axios from "axios";
import { getSession } from "@/lib/session";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/",
  withCredentials: true,
});

const useAxios = () => {
  // const router = useRouter();

  const axiosPublicInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // axiosPrivateInstace.interceptors.request.use(async (req) => {
  //   // verify the context, and then the localStorage to find the accessToken, if not found, redirect to login
  //   if (!accessToken) {
  //     const localAccessToken = localStorage.getItem('access');
  //     if (!localAccessToken) {
  //       router.push('/login');
  //       throw new Error('Unauthorized');
  //     } else {
  //       setAcessToken(localAccessToken);
  //     }
  //   }

  //   // add the accessToken to the headers
  //   req.headers.Authorization = `Bearer ${accessToken}`;

  //   // check if access is expired, if so, refresh the token
  //   const isExpired = dayjs.unix(jwtDecode(accessToken).exp).diff(dayjs()) < 1;
  //   if (!isExpired) {
  //     return req
  //   }

  //   const refreshToken = localStorage.getItem('refresh');

  //   try {
  //     const response axios.post(
  //       '/auth/refresh',
  //       {
  //         refresh: refreshToken,
  //       }
  //     )
  //   }

  //   localStorage.setItem("access", JSON.stringify(response.data.access));
  //   localStorage.setItem("refresh", JSON.stringify(response.data.refresh));
  //   setAccessToken(response.data.access);
  //   setRefreshToken(response.data.refresh);

  //   if (accessToken) {
  //     // get the use info and stuff
  //   }
  // });

  // if i want to protect the routes, use axiosPrivateInstance, if not, use axiosPublicInstance

  const getAllSubjects = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await instance.get(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/"
      }subjects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

  const getSubjectsByCodes = async (codes: string[]) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    try {
      const response = await instance.get(
        `/subjects/by-codes?codes=${codes.join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching subjects by codes:", error);
      if (axios.isAxiosError(error)) {
      }
      throw error;
    }
  };

  const getAllSubjectsWithRelations = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await instance.get("/subjects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const getFilteredSubjects = async (search: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await instance.get(`/subjects?search=${search}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const getSubject = async (id: number) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    console.log(
      "Debug - Token retrieved:",
      token ? "Token exists" : "No token"
    );
    console.log(
      "Debug - Token value:",
      token ? token.substring(0, 20) + "..." : "null"
    );

    if (!token) {
      // Redirect to login if no session
      if (typeof window !== "undefined") {
        console.log("Debug - No access token, redirecting to login");
        window.location.href = "/auth/signin";
      }
      throw new Error("No access token found - please log in");
    }

    try {
      console.log("Debug - Making request to:", `/subjects/${id}`);
      console.log(
        "Debug - Authorization header:",
        `Bearer ${token.substring(0, 20)}...`
      );

      const response = await instance.get(`/subjects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Debug - Request successful:", response.status);
      return response.data;
    } catch (error) {
      console.log("Debug - Request failed:", error);
      // If we get a 401, redirect to login
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
          console.log("Debug - 401 error, redirecting to login");
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
          throw new Error("Session expired - please log in again");
        }
      }
      throw error;
    }
  };

  const getCheckUserExtraInfo = async (email: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    try {
      const response = await axiosPublicInstace.get("/users/check_extra_info", {
        params: {
          email,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Authentication routes

  const register = async (formData: object) => {
    try {
      const response = await axiosPublicInstace.post("auth/register", formData);
      return response;
    } catch (error) {
      return error;
    }
  };

  const login = async (formData: object) => {
    try {
      const response = await axiosPublicInstace.post("auth/login", formData);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  // Feedback form

  const registerFeedback = async (formData: { message: string }) => {
    try {
      const response = await axiosPublicInstace.post(
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
