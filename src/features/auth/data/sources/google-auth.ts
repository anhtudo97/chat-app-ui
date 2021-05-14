export default class GoogleAuth {
  constructor() {
    gapi.load("auth2", () => {
      gapi.auth2.init({
        client_id: `${processEnv.VITE_GOOGLE_CLIENT}`,
        scope: "profile",
      });
    });
  }
}
