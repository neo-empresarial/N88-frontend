import axios from 'axios';
import { useRouter } from 'next/navigation';

import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { get } from 'http';

const useAxios = () => {
  // const router = useRouter();

  const baseURL = process.env.DATABASE_URL;

  const axiosPublicInstace = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // const axiosPrivateInstace = axios.create({
  //   baseURL: baseURL,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
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
    try {
      const response = await axiosPublicInstace.get('/subjects');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getFilteredSubjects = async (query: string) => {
    try {
      const response = await axiosPublicInstace.get(`/subjects?search=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const getSubject = async (id: number) => {
    try {
      const response = await axiosPublicInstace.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      throw error
    }
  }

  const getCheckUserExtraInfo = async (id: number) => {
    try {
      const response = await axiosPublicInstace.get(`/${id}/check_extra_info`);
      return response.data;
    } catch (error) {
      throw error
    }
  }

  return {
    getAllSubjects,
    getFilteredSubjects,
    getSubject,
    getCheckUserExtraInfo
  }
}

export default useAxios;