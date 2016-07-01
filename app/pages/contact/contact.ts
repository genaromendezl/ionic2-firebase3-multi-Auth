import {NavController} from 'ionic-angular';
import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs';
import {DataService, fb } from '../../lib/data.service';

@Component({
  templateUrl: 'build/pages/contact/contact.html'
})
export class ContactPage {
  public users: Observable<any>;
  public usuarios : Observable<{}>;
  public _data: DataService;

  constructor() {
         this._data = fb;
  }

  getUsuarios() {
      var ref = this._data.db.ref('users');
      var that = this;

      return new Observable(observer => {
        ref.on("value", snapshot => {
          var tempArr = [];
          snapshot.forEach(function(data) {
            var usuario = {
              _key: data.key,
              displayName: data.val().displayName,
              photoURL: data.val().photoURL
            };
            tempArr.push(usuario);
          });
          observer.next(tempArr);
        },
          (error) => {
              console.log("ERROR:", error)
              observer.error(error)
          });
      });
  };

  populateUsuariosArr() {
     this.usuarios = this.getUsuarios();
  }

  ngOnInit() {
       this.populateUsuariosArr();
  }

  ngOnDestroy() {

  }
}
