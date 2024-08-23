import { FormControl } from '@angular/forms';

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

export interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
