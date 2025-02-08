export interface UserInterface {
  email: string;
  username: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
}
