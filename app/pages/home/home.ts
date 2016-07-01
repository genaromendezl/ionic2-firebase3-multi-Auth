import 'es6-shim';
import {Component} from '@angular/core';
import {NavController,Modal} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {DataService, fb} from '../../lib/data.service';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [DataService]
})

export class HomePage {

  username:string;
  nav:NavController;
  isLoggedIn: boolean;
  _data: DataService;

  constructor(nav: NavController ) {
    this.nav = nav;
    this._data = fb;

    if(!((window.localStorage.getItem('isLoggedIn') === "undefined" ||
         window.localStorage.getItem('isLoggedIn') === null) ||
       !(window.localStorage.getItem('isLoggedIn') === 'true'))  ||
       ((window.localStorage.getItem('username') === "undefined" || window.localStorage.getItem('username') === null) &&
        (window.localStorage.getItem('password') === "undefined" || window.localStorage.getItem('password') === null))) {

        this.logout();
    }
  }

  logout(): void {
		  this.isLoggedIn = false;

      window.localStorage.removeItem('username');
      window.localStorage.removeItem('password');
      window.localStorage.removeItem('isLoggedIn');

      let loginPage = Modal.create(LoginPage);

      setTimeout( () => {
            this.nav.present(loginPage);
      });

  }
}
