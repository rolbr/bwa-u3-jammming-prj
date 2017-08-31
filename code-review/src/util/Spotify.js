let accessToken = null;
let expirationTime = null;
let expirationTimeout = null;

const url = 'https://accounts.spotify.com/authorize'
const clientID = '382d05cc353f4652a5598530565d633c';
const redirectURI = 'http://localhost:3000/';

class Spotify {

  constructor(){
    this.getAccessToken();
  }

  // https://developer.spotify.com/my-applications/
  // https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
  getAccessToken(){

    console.log('getAccessToken() 1', accessToken)

    // if we already have one, return it, else continue...
    if( accessToken ) return accessToken; 


    // the token is returned as an url param. check for it.
    let tokenParam = window.location.href.match(/access_token=([^&]*)/);
    let expireParam = window.location.href.match(/expires_in=([^&]*)/);

    // tokenParam === [
    //   "access_token=BQBc8v3ar5VCq2aKF9sQjDDAwPpxPAl_3m8vv … B1kVcwdR_jRv808hwYcDn9xFEn0Ynyeo9JILaYQlzEoeuLrus", 
    //   "BQBc8v3ar5VCq2aKF9sQjDDAwPpxPAl_3m8vvgzLDQhI9RNQhG … B1kVcwdR_jRv808hwYcDn9xFEn0Ynyeo9JILaYQlzEoeuLrus", 
    //   index: 23, 
    //   input: "http://localhost:3000/#access_token=BQBc8v3ar5VCq2 … ILaYQlzEoeuLrus&token_type=Bearer&expires_in=3600"
    // ]

    console.log('getAccessToken() 2', tokenParam, expireParam)


    // yip, API returned data as url params
    if( tokenParam && expireParam ){
      console.log('getAccessToken() 3', tokenParam, expireParam)

      // extract data
      accessToken = tokenParam[1];
      expirationTime = Number(expireParam[1]);

      console.log('getAccessToken() 3a', accessToken, expirationTime)

      // set up expiration
      expirationTimeout = setTimeout( () => {
        accessToken = null;
        expirationTime = null;
        expirationTimeout = null;
      }, expirationTime*1000 )

      // wipe params, so app doesn't retrieve them again after expiration
      window.history.pushState('Access Token', null, '/');
    }


    // no token and no tokenParam ... go get one!
    if( !accessToken && !tokenParam ){

      console.log('getAccessToken() 4')

      window.location = url + `?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      
      // PARAMS
      //
      // client_id: '382d05cc353f4652a5598530565d633c',
      // response_type: 'token',
      // redirect_uri: '',
      // state: '', // optional, strongly recommended
      // scope: '', // optional: 'scope1 scope2 scope3'
      // show_dialog: false | true // optional: false | true

      // RESPONSE:
      //
      // OK: https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
      // access_token: ''
      // token_type: "Bearer",
      // expires_in: 999, // seconds
      // state: 123, // value of state supplied in request
      //
      // ERROR: https://example.com/callback?error=access_denied&state=123
      // error: reason, e.g. "access_denied"
      // state: 123, // value of state supplied in request
      
    } // end if( accessToken )
  } // end getAccessToken()


  search( term, callback ){

    console.log('search() 1', accessToken)
    
    // Because fetch() is a web API, not all browsers support it. For unsupported browsers use a polyfill: https://github.com/github/fetch

    fetch('https://api.spotify.com/v1/search?type=track&q='+term, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(
        response => {
          if( response.ok ) return response.json();    // convert to json
          else throw new Error('Request failed!');     // or fail
        },
        networkError => {
          console.log( networkError.message );
        }
      )
      // response.json() returns a Promise which will resolve here
      .then(
        jsonResponse => {
          console.log( jsonResponse )

          if ( !jsonResponse.tracks  ) return [];

          let tracks = jsonResponse.tracks.items.map( track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
            }
          });

          console.log( tracks )

          callback( tracks );
        }
      );

  } // end search()
 

  /** 
   * name : String
   * trackURIs : Array
   */
  savePlaylist( name, trackURIs, callback ){
    // let accToken = accessToken;
    // let headers = {
    //    'Authorization': 'Bearer ' + accToken
    // };
    let userID = '';
    let playlistID = '';

    
    // GET USER-ID
    //
    // https://developer.spotify.com/web-api/get-current-users-profile/
    fetch('https://api.spotify.com/v1/me', {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(
        response => {
          if( response.ok ) return response.json();    // convert to json
          else throw new Error('Request failed!');     // or fail
        },
        networkError => {
          console.log( networkError.message );
        }
      )
      // response.json() returns a Promise which will resolve here
      .then(
        jsonResponse => {
          console.log( jsonResponse )

          userID = jsonResponse.id;

          createPlaylist();
        }
      );


    // CREATE PLAYLIST
    //
    function createPlaylist(){
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          // public: false,
          // collaborative: false,
          // description: ','
        })
      }).then(
          response => {
            if( response.ok ) return response.json();    // convert to json
            else throw new Error('Request failed!');     // or fail
          },
          networkError => {
            console.log( networkError.message );
          }
        )
        // response.json() returns a Promise which will resolve here
        .then(
          jsonResponse => {
            console.log( jsonResponse )

            playlistID = jsonResponse.id;

            saveTracksToPlaylist();
          }
        );
    } // createPlaylist


    function saveTracksToPlaylist(){
      fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackURIs
        })
      }).then(
          response => {
            if( response.ok ) return response.json();    // convert to json
            else throw new Error('Request failed!');     // or fail
          },
          networkError => {
            console.log( networkError.message );
          }
        )
        // response.json() returns a Promise which will resolve here
        .then(
          jsonResponse => {
            console.log( jsonResponse )

            playlistID = jsonResponse.id;

            callback();
          }
        );
    } // saveTracksToPlaylist


  } // savePlaylist

}

export default Spotify;