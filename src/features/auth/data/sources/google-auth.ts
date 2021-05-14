export default class GoogleAuth {
  constructor() {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: `${processEnv.VITE_GOOGLE_CLIENT}`,
        scope: "profile",
      });
    });
  }

  async signIn() {
    return new Promise<string>((resolve, reject) => {
      gapi.load("auth2", () => {
        gapi.auth2
          .init({
            client_id: `${processEnv.VITE_GOOGLE_CLIENT}`,
            scope: "profile",
          })
          .then(async (ga) => {
            const x = await ga.signIn();
            resolve(x.getAuthResponse().id_token);
          })
          .catch(reject);
      });
    });
  }
}
