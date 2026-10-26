// Login: მხოლოდ სახელი და შესულია თუ არა
export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
}

// Login ფორმის ველები
export interface LoginFormValues {
  username: string;
  password: string;
}
