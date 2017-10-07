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
  instanceURL: string;
  command: string;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public http: Http) {}

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
    self.connectToWs();
    this.afAuth.auth.currentUser.getToken(true).then(function(idToken) {
      console.log('ID TOKEN');
      console.log(idToken);
      let uid = self.afAuth.auth.currentUser.uid;
      self.get( self.instanceURL + '/api/v1/shell-exec?command=' + self.command + '&token=' + idToken + '&uid=' + uid ).subscribe(
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

  connectToWs() {//
    var self = this;
    var uid = this.afAuth.auth.currentUser.uid;
    var instanceNameWs = self.getWsInstanceName( self.instanceURL );
    if( instanceNameWs ) {
      var ws = new WebSocket('ws:' + instanceNameWs +'?uid=' + uid);
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
  }

  getWsInstanceName( instanceURL ) {
    let spl = instanceURL.split( "://" );
    if( spl && spl.length > 0 ) {
      let instanceName = spl[1];  
      return instanceName;
    }
    return "";
    
  }

  get( url) {
    return this.http.get( url )
      .map( res => res.json() );
  }

}
