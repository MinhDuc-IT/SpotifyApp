export const spotifyAuthConfig = {
    clientId: '35c41b3d485c4193b4951f7636ae7906',
    redirectUrl: 'com.anonymous.spotifyapp://oauthredirect',  // nhớ đổi theo package app của bạn
    scopes: [
      'user-read-email',
      'user-library-read',
      'user-read-recently-played',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
    ],
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
  };
  