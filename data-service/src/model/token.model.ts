export class TokenModel {
  payload: {
    name: string;

    email: string;

    picture: string;
  };

  data: {
    refresh_token: string;

    access_token: string;

    expires_in: number;

    refresh_token_expires_in: number;

    token_type: string;

    scope: string;

    id_token: string;
  };
}
