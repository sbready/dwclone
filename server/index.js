require('dotenv').config()
const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')

const app = express()

app.use( cors() )
app.use( bodyParser.json() )

massive( process.env.DB_CONNECTION ).then( db => {
    app.set( 'db', db )
}).catch( ( err ) => {
    console.log( err )
})

app.use( session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use( passport.initialize() )
app.use( passport.session() )

passport.use( new Auth0Strategy({

    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, function (accessToken, refreshToken, extraParams, profile, done) {

    const db = app.get( 'db' )

    //Google Auth Start
    let userData = profile.json,
        auth_id = userData.user_id.split('|')[1]

    db.find_user( [auth_id] ).then( user => {
        if ( user[0] ) {
            return done( null, user[0].id )
        } else {
            db.create_user( [userData.given_name, userData.family_name, userDAta.email, userData.gender, auth_id] )
                .then( user => {
                    return done( null, user[0].id ) 
                })
        }
    })
    //Google Auth End   
    }
))
// passport End

//authentication endpoints
app.get( '/auth', passport.authenticate( 'auth0' ))
app.get( '/auth/callback', passport.authenticate( 'auth0', {
    successRedirect: 'http://localhost:3005/api/check_new_user',
    faulureRedirect: 'http://localhost:3000/#/auth'
}))
app.get( '/auth/verify', function ( req, res ) {
    let response = req.user,
        status = 200
    !response && ( response = 'LOGIN REQUIRED', status = 403 )
    res.status( status ).send( response )
})
app.get( '/auth/logout', function( req, res) {
    req.logout()
    res.redirect( 'http://localhost:3000/#/' )
})

//endpoints


passport.serializeUser( function ( ID, done ) {
    done( null, ID )
})

passport.deserializeUser( function ( ID, done ) {
    const db = app.get( 'db' )
    db.find_user_by_session( [ID] ).then( user => {
        done( null, user[0] )
    })
})

app.listen(process.env.SERVER_PORT, () => {
    console.log( `╭∩╮（︶︿︶）╭∩╮: ${process.env.SERVER_PORT}` )
})