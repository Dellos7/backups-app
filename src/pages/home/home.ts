import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { Http, Headers, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  logs: any[] = [];

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public http: Http) {
    var self = this;
    var uid = this.afAuth.auth.currentUser.uid;
    var ws = new WebSocket('ws://localhost:3000/' + uid);
    ws.onopen = function(event) {
      console.log('CONNECTED TO WSOCKET');
      ws.onmessage = function (event) {
        console.log(event.data);
        self.logs.push(
          {
            'log': event.data
          }
        );
      };
    };
  }

  checkToken() {
    var self = this;
    this.afAuth.auth.currentUser.getToken(true).then(function(idToken) {
      console.log('ID TOKEN');
      console.log(idToken);

      self.get( 'http://localhost:3000/identify-token?token=' + idToken ).subscribe(
        data => {
          console.log('IDENTIFY TOKEN DATA');
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );

    }).catch(function(error) {
      console.log(error);
    });
  }

  backup() {
    var self = this;
    this.afAuth.auth.currentUser.getToken(true).then(function(idToken) {
      console.log('ID TOKEN');
      console.log(idToken);
      let uid = self.afAuth.auth.currentUser.uid;
      self.get( 'http://localhost:3000/backup?token=' + idToken + '&uid=' + uid ).subscribe(
        data => {
          console.log('BACKUP');
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );

    }).catch(function(error) {
      console.log(error);
    });
  }

  get( url) {
    return this.http.get( url )
      .map( res => res.json() );
  }

}
