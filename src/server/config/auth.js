import request from 'request';

export function crawlByAccessTokenFacebook(accessToken, callback) {
  //Crawl user data from facebook by access token.
  request.get('https://graph.facebook.com/me?fields=name,email,locale,timezone,verified&access_token='
    + accessToken, function (error, response, userBody) {
    if (!error && response.statusCode == 200) {
      let result = JSON.parse(userBody);
      //Crawl user profile_picture from facebook by access token.
      request.get('https://graph.facebook.com/'
        + result.id
        + '/picture?type=large&redirect=0', function (error, response, pictureBody) {
        if (!error && response.statusCode == 200) {
          result.profile_picture = JSON.parse(pictureBody).data.url;
          console.log(result);
          callback(result);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  });
}

export function crawlByAccessTokenLinkedIn(accessToken) {
  ///TODO : Validiate accesstoken from linkedin API server.
  return false;
}
