
import 'es6-shim';
import {Component, Inject} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {DataService, fb} from './lib/data.service';

@Component({
  template: `
      <ion-menu [content]="content">
        <ion-toolbar>
          <ion-title>Paginas</ion-title>
        </ion-toolbar>
        <ion-content>
          <ion-list>
            <button ion-item (click)="openPage(loginPage)">
              Login
            </button>
            <button ion-item (click)="openPage(signupPage)">
              Signup
            </button>
          </ion-list>
        </ion-content>
      </ion-menu>
  <ion-nav [root]="rootPage"></ion-nav>`,
  providers:[DataService]
})
export class MyApp {

  private rootPage:any;

  constructor(public _data:DataService, private platform:Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp)
