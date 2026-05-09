import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // e.g. http://localhost:8000

export const loginUser = (email: string, password: string) =>
  axios.post(`${BASE_URL}/auth/login`, { email, password });

export const registerUser = (data: RegisterPayload) =>
  axios.post(`${BASE_URL}/auth/register`, data);

export const googleAuth = (token: string) =>
  axios.post(`${BASE_URL}/auth/google`, { token });