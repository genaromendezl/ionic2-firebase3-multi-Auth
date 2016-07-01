import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {OnInit, OnDestroy, Inject} from '@angular/core';
import {FormBuilder, Validators, Control } from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs';
import {DataService, fb} from '../../lib/data.service';

@Component({
  templateUrl: 'build/pages/news/news.html'
  ,providers: [DataService]
})
export class NewsPage implements OnInit, OnDestroy {
      public noticias : Observable<{}>;
      public mensaje = "";
      public _data: DataService;

      constructor( ) {
            this._data = fb;
      }

      publicarmsg(){
        var ref = this._data.db.ref('noticias');
        var that = this;

        ref.push({
              "fecha":  (new Date()).getTime(),//this._data.db.ServerValue.TIMESTAMP,
              "contenido": this.mensaje
          });
      }

      getNoticias() {
          var ref = this._data.db.ref('noticias');
          var that = this;

          return new Observable(observer => {
            ref.on('value', snapshot => {
              var tempArr = [];
              snapshot.forEach(function(data) {
                var tfecha = data.val().fecha;
                var dfecha = new Date(tfecha);
                var sfecha = dfecha.getDate()+"/"+(dfecha.getMonth()+1)+"/"+dfecha.getFullYear()+","+dfecha.getHours()+":"+dfecha.getMinutes();
                var noticia = {
                  _key: data.key,
                  contenido: data.val().contenido,
                  fecha: sfecha
                };

                tempArr.push(noticia);
              });
              observer.next(tempArr);
            },
              (error) => {
                  console.log("ERROR:", error);
                  observer.error(error);
              });
          });
        };

      populateNoticiasArr() {
           this.noticias = this.getNoticias();
      }

      ngOnInit() {
             this.populateNoticiasArr();
      }

      ngOnDestroy() {

      }
}
