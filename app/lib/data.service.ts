import 'es6-shim';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import { InAppBrowser } from 'ionic-native';
// if you've gone with the local installation approach, you'd use the following:
declare var firebase: any;
export  var fb:any;

@Injectable()
export class DataService {
    public db: any;
    public auth: any;

    constructor() {

      firebase = require('firebase');
      var config = {
        apiKey: "YOUR-API-KEY",
        authDomain: "yourdomain.firebaseapp.com",
        databaseURL: "https://yourdomain.firebaseio.com",
        storageBucket: "yourdomain.appspot.com"
      };

      console.log("Inicializando la comunicacion con firebase");
      firebase.initializeApp(config);
      this.auth = firebase.auth();
      this.db = firebase.database();
      fb = this;

      console.log("Inicializacion terminada");
    }

    onAuthStateChanged(_function) {
        return firebase.auth().onAuthStateChanged((_currentUser) => {
            if (_currentUser) {
                console.log("Usuario " + _currentUser.uid + " esta registrado con " + _currentUser.provider);
                _function(_currentUser);
            } else {
                console.log("El usuario ha salido");
                _function(null)
            }
        })
    }

    loginCred(credentials) {
          var that = this

          return new Observable(observer => {
              return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                  .then(function (authData) {
                      console.log("Authenticated successfully with payload-", authData);
                      observer.next(authData)
                  }).catch(function (_error) {
                      console.log("Login Failed!", _error);
                      observer.error(_error)
                  })
          });
    }

    public loginUP(userEmail: string, userPassword: string) {

        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
                .then(userData => resolve(userData),
                    err => reject(err));
        });

    }

    public createUser(credentials) {
        console.log("usuario="+credentials.email+", password="+credentials.password);
        return new Promise((resolve, reject) => {
                 firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
                         .then(userData => {
                                             var user = this.auth.currentUser;
                                             var ref = this.db.ref('users');
                                             ref.child(user.uid)
                                                       .set({
                                                         "signInMethod": "password",
                                                         "uid":user.uid,
                                                         "provider": user.providerId,
                                                         "email": user.email,
                                                         "displayName": user.email,
                                                         "photoURL":"http://tinygraphs.com/labs/isogrids/hexa/"+user.email+"?theme=seascape&numcolors=4&size=220&fmt=svg",
                                                         "emailVerified":user.emailVerified,
                                                         "userInfo" : user.providerData,
                                                         "status" : "online",
                                                         "loggedIn" : "true"
                                                       });

                                            user.sendEmailVerification().then(function() {
                                                               // Update successful.
                                                               console.log("Se envio correo de verificacion");
                                                             }, function(error) {
                                                               // An error happened.
                                                               console.log("Error en el envío del correo de verificacion");
                                                             });

                                             resolve(userData)
                                           }, err => reject(err));
        });
    }


    public login(credentials): any {

        let addUser = credentials.created
        credentials.created = null;

        var signInMethod = 'password';
        var provider;

        return this.auth.signInWithEmailAndPassword(credentials.email,credentials.password).then((result) => {

            var credential = result.credential;
            var user = this.auth.currentUser;

            return Promise.resolve(user);

        }).catch((error) => {
            console.log("Error en login ("+signInMethod+"): "+error);
            return Promise.reject(error);
        });

    }


    public loginSocialWeb(medio): any {

        var signInMethod = 'none';
        var provider;
        var token;
        var credential;
        var user;
        var ref;
        var that;


        if (medio == 1){
            signInMethod = 'facebook';
            provider = new firebase.auth.FacebookAuthProvider();

            provider.addScope('email');
            provider.addScope('user_location');

        } else if (medio == 2){
           signInMethod = 'twitter';
           provider = new firebase.auth.TwitterAuthProvider();

        } else if (medio == 3){
           signInMethod = 'google';
           provider = new firebase.auth.GoogleAuthProvider();
           provider.addScope('https://www.googleapis.com/auth/plus.login');
        }

        return this.auth.signInWithPopup(provider).then((result) => {

            if (result.credential) {

               token = result.credential.accessToken;
               credential = result.credential;

               user = this.auth.currentUser;

               ref = this.db.ref('users');
               that = this;

               console.log("Se creo el usuario a partir de la informacion de "+signInMethod);

               ref.child(user.uid)
                          .set({
                            "signInMethod": signInMethod,
                            "provider": user.providerId,
                            "uid": user.uid,
                            "email": user.email,
                            "displayName": user.displayName,
                            "photoURL": user.photoURL,
                            "status" : "online",
                            "loggedIn" : "true"
                          });
            }

            return Promise.resolve(user);

        }).catch((error) => {
            console.log("Error en loginSocial ("+signInMethod+"): "+error);
            return Promise.reject(error);
        });

    }

    public loginSocialDev(medio): any {

        var signInMethod = 'none';
        var provider;
        var token;
        var credential;
        var user;
        var ref;
        var that;


        if (medio == 1){

          signInMethod = 'facebook';
          provider = new firebase.auth.FacebookAuthProvider();

          provider.addScope('email');
          provider.addScope('user_location');

        } else if (medio == 2){
           signInMethod = 'twitter';
           provider = new firebase.auth.TwitterAuthProvider();

        } else if (medio == 3){
           signInMethod = 'google';
           provider = new firebase.auth.GoogleAuthProvider();
           provider.addScope('https://www.googleapis.com/auth/plus.login');
        }

        this.auth.suscribe( (data)=> { return this.auth.signInWithPopup(provider).then((result) => {

                if (result.credential) {

                   token = result.credential.accessToken;
                   credential = result.credential;

                   user = this.auth.currentUser;

                   ref = this.db.ref('users');
                   that = this;

                   console.log("User created based on "+signInMethod);

                   ref.child(user.uid)
                              .set({
                                "signInMethod": signInMethod,
                                "provider": user.providerId,
                                "uid": user.uid,
                                "email": user.email,
                                "displayName": user.displayName,
                                "photoURL": user.photoURL,
                                "status" : "online",
                                "loggedIn" : "true"
                              });
                }

                return Promise.resolve(user);

            }).catch((error) => {
                console.log("Error en loginSocial ("+signInMethod+"): "+error);
                return Promise.reject(error);
            });

        })

    }

    public resetPassword(credentials){

        return this.auth.sendPasswordResetEmail(credentials.email);

    }


    public logout() {
        return firebase.auth.signOut();
    }


    facebookLogin() {
        return new Promise(function(resolve, reject) {
            var browserRef = window["cordova"].InAppBrowser.open("https://www.facebook.com/v2.0/dialog/oauth?client_id=" + "YOUR_APP_ID" + "&redirect_uri=http://localhost/callback&response_type=token&scope=email", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
            browserRef.addEventListener("loadstart", (event) => {
                if ((event.url).indexOf("http://localhost/callback") === 0) {
                    browserRef.removeEventListener("exit", (event) => {});
                    browserRef.close();
                    var responseParameters = ((event.url).split("#")[1]).split("&");
                    var parsedResponse = {};
                    for (var i = 0; i < responseParameters.length; i++) {
                        parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                    }
                    if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
                        resolve(parsedResponse);
                    } else {
                        reject("Problem authenticating with Facebook");
                    }
                }
            });
            browserRef.addEventListener("exit", function(event) {
                reject("The Facebook sign in flow was canceled");
            });
        });
    }


}
