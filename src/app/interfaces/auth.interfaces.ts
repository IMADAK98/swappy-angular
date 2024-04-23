export interface UserSignup {
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
