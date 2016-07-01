import {NavController, ViewController, Alert, Platform} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {TabsPage} from '../tabs/tabs';
import {DataService, fb} from '../../lib/data.service';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [DataService]
})

export class LoginPage {

  isLoggedIn: boolean;
  loginMethod: number = -1;   // 1  - Password, 2 - Facebook, 3 - Twitter, 4 - Google

  error: any
  username: string;
  password: string;

  tabs   = TabsPage;
  viewCtrl: ViewController;
  _user:DataService;

	constructor(public view: ViewController, public nav: NavController, public platform: Platform) {
      this.viewCtrl = view;
      this.isLoggedIn = false;

      this._user = fb;

      if (
          !(window.localStorage.getItem('isLoggedIn') === "undefined" ||
           window.localStorage.getItem('isLoggedIn') ===  null)      &&
           window.localStorage.getItem('isLoggedIn') === 'true'){

           this.isLoggedIn = true;
      }

      console.log("LoginPage.constructor | this.isLoggedIn="+this.isLoggedIn);

	}

  resetPassword(_credentials, _event) {
        _event.preventDefault();

        this._user.resetPassword(_credentials).then((user) => {
          let alert = Alert.create({
            title: 'Restablecimiento de Password',
            subTitle: `Se envió un correo a su cuenta.
                       Siga las instrucciones enviadas en el correo
                       para restablecer su Password`,
            buttons: ['Aceptar']
          });
          this.nav.present(alert);

        }).catch((error) => {
            this.error = error;
        });
  }

  registerUser(_credentials, _event) {
        _event.preventDefault();

        this._user.createUser(_credentials).then((user) => {
            _credentials.created = true;

            console.log("Usuario creado!! ");

            return this.login(_credentials, _event);

        }).catch((error) => {
            this.error = error;
        });
  }


  login(_credentials,_event) {
      _event.preventDefault();

      this._user.login(_credentials).then((user)=>{
                        console.log("Exitoso!");
                        if (user.emailVerified){
                          this.dismiss();
                        } else {
                          let alert = Alert.create({
                            title: 'Cuenta de correo pendiente de verificar',
                            subTitle: `Se envió un correo de verificación a su cuenta.
                                       Siga las instrucciones enviadas en el correo
                                       para habilitar su cuenta`,
                            buttons: ['Aceptar']
                          });
                          this.nav.present(alert);
                        }
      }).catch((error)=>{console.log("Con error!!!");this.error = error});
/*
      if (typeof(window.localStorage) !== "undefined") {
        window.localStorage.setItem('username',userData.email);
        window.localStorage.setItem('isLoggedIn',"true");
      }
*/
  }

  loginFacebook(_event){
    _event.preventDefault();

        this._user.facebookLogin().then((success) => {
            alert("success.access_token");
        }, (error) => {
            alert(error);
        });

  }

  loginSocial(_credentials, _event, medio) {
      _event.preventDefault();
      this.loginMethod = medio;

      if ( (typeof(window['cordova']) !== "undefined" && this.platform.is('ios')) || (typeof(window['cordova'])!=="undefined" && this.platform.is('android')) ){
            this._user.loginSocialDev(medio).then((result)=>{console.log("Exitoso!"); this.dismiss()}).catch((error)=>{console.log("Con error!!!");this.error = error});
      } else {
            this._user.loginSocialWeb(medio).then((result)=>{console.log("Exitoso!"); this.dismiss()}).catch((error)=>{console.log("Con error!!!");this.error = error});
      }
  }

	dismiss() {
    this.viewCtrl.dismiss();
	}

}
