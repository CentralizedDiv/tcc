import api from "src/config/api";
import { LoginDto, SignupDto } from "./store/auth.actions";
import { IUser } from "./types/user.model";

interface LoginResponse {
  access_token: string;
}
async function login(loginDto: LoginDto): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("auth/login", loginDto);
  return response.data;
}
async function signup(signupDto: SignupDto): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("users", signupDto);
  return response.data;
}
async function me(): Promise<IUser> {
  const response = await api.get<IUser>("me");
  return response.data;
}
const endpoints = { login, signup, me };
const authApi = endpoints;

export { authApi };
