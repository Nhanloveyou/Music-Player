const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport=require('passport');
const bodyParser = require('body-parser');
const authRoutes=require('./routes/authRoutes');
const searchRoutes=require('./routes/searchRoutes');
const profileRoutes=require('./routes/profileRoutes');
const followingRoutes=require('./routes/followingRoutes');
const playlistRoutes=require('./routes/playlistRoutes');
const favouritesRoutes=require('./routes/favouritesRoutes');
const lyricsRoutes=require('./routes/lyricsRoutes');
const recommendationRoutes=require('./routes/recommendationRoutes');

const keys=require('./config/keys');
require('./services/passport');
const app=express();
const SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
const spotifyApi = new SpotifyWebApi({
    clientId: '4fa029658d574dd0b1b5026ceb54fb66',
    clientSecret: '632fdc4d3d534e7b930a8f8043e40944'
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Music-Player',{ useNewUrlParser: true });

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge:30*24*60*60*1000,
    keys:[keys.cookieKeys]
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
authRoutes(app);
searchRoutes(app,spotifyApi);
profileRoutes(app,spotifyApi);
followingRoutes(app,spotifyApi);
playlistRoutes(app,spotifyApi);
favouritesRoutes(app,spotifyApi);
lyricsRoutes(app);
recommendationRoutes(app,spotifyApi);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
 console.log("hello world")
})
