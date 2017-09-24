import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

  }

  logout(){ 
    this.authProvider.logoutUser()
      .then( 
        response => {
          this.navCtrl.setRoot(LoginPage);
        },
        error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
          });
        }
      );

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      this.loading.present();

  }

}
