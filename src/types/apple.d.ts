interface AppleIDAuthConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  usePopup: boolean;
}

interface AppleIDAuthSignInResponse {
  authorization: {
    id_token: string;
    code: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: { firstName?: string; lastName?: string };
  };
}

interface Window {
  AppleID?: {
    auth: {
      init(config: AppleIDAuthConfig): void;
      signIn(): Promise<AppleIDAuthSignInResponse>;
    };
  };
}
