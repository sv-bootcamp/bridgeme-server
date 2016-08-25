export const superToken = 'yodaROX';

export function validiateFB(accessToken) {
  if (accessToken == superToken) {
    return true;
  }
  ///TODO : Validiate accesstoken from facebook API server.

  return false;
}

export function validiateLI(accessToken) {
  if (accessToken == superToken) {
    return true;
  }
  ///TODO : Validiate accesstoken from linkedin API server.

  return false;
}

export function validiateSession(accessToken) {
  if (accessToken == superToken) {
    return true;
  }
  ///TODO : Validiate accesstoken from linkedin API server.

  return false;
}
