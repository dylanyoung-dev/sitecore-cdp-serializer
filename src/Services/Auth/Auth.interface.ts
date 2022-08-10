interface AuthToken {
  access_token?: string;
  x_access_token?: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

export { AuthToken };
