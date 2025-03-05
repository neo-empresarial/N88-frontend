import axios from 'axios';

const useAxios = () => {
  // const router = useRouter();

  const axiosPublicInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DATABASE_URL, // "http://localhost:8000"
    headers: {
      'Content-Type': 'application/json',
    },
  })

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

  const getCheckUserExtraInfo = async (email: string) => {
    try {
      const response = await axiosPublicInstace.get('/users/check_extra_info', {
        params: {
          email,
        }
      });
      return response.data;
    } catch (error) {
      throw error
    }
  }

  // Authentication routes

  const register = async (formData: object) => {
    try {
      const response = await axiosPublicInstace.post('auth/register', formData);
      return response;
    } catch (error) {
      return error;
    }
  }

  const login = async (formData: object) => {
    try {
      const response = await axiosPublicInstace.post('auth/login', formData);
      return response;
    } catch (error) {
      return error;
    }
  }

  // Feedback form

  const registerFeedback = async (formData: { message: string }) => {
    try {
      const response = await axiosPublicInstace.post(`feedback?message=${formData.message}`);
      return response;
    } catch (error) {
      return error
    }
  }

  return {
    getAllSubjects,
    getFilteredSubjects,
    getSubject,
    getCheckUserExtraInfo,
    register,
    login,
    registerFeedback,
  }
}

export default useAxios;