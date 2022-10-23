/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';

import { AppComponent } from '../app.component';

import { StorageService } from 'src/app/.services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  title = 'LoginPage';
  theme: any = 'dark';

  rememberLogin: any = false;
  checkboxRememberLogin: any = false;

  login_email: any = null;
  login_password: any = null;

  constructor(
    public app: AppComponent,
    public platform: Platform,
    private cdr: ChangeDetectorRef,
    public storage: StorageService
  ) {
    console.log(`[${this.title}#constructor]`);
  }

  ngOnInit() {
    console.log(`[${this.title}#ngOnInit]`);
  }

  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {
      console.log(`[${this.title}#ionViewDidEnter] platform.ready`, readySource);

      this.theme = this.storage.get('theme', this.title) == null ? 'dark' : this.storage.get('theme', this.title);

      this.rememberLogin = this.storage.get('rememberLogin', this.title) == null ? false : this.storage.get('rememberLogin', this.title);
      this.checkboxRememberLogin = this.storage.get('rememberLogin', this.title) == null ? false : this.storage.get('rememberLogin', this.title);

      this.login_email = null;
      this.login_password = null;

      if (this.rememberLogin) {
        console.log(`[${this.title}#ionViewDidEnter] rememberLogin`, this.rememberLogin);

        this.login_email = this.storage.get('login_email', this.title);
        console.log(`[${this.title}#ionViewDidEnter] login_email`, this.login_email);

        this.login_password = this.storage.get('login_password', this.title);
        console.log(`[${this.title}#ionViewDidEnter] login_password`, this.login_password);

        this.login();
      }
    });
  }

  defaultOrder() {
    return 0;
  }

  updateView() {
    console.log(`[${this.title}#updateView]`);
    this.cdr.detectChanges();
    this.app.updateView(this.title);
  }

  redirectTo(url: string) {
    this.app.redirectTo(url, this.title);
  }

  login() {
    console.log(`[${this.title}#login] checkboxRememberLogin`, this.checkboxRememberLogin);
    console.log(`[${this.title}#login] login_email`, this.login_email);
    console.log(`[${this.title}#login] login_password`, this.login_password);

    if (this.login_email == null || this.login_email == '') {
      this.app.showAlert('Login', 'E-mail not provided!');
      return;
    }
    if (this.login_password == null || this.login_password == '') {
      this.app.showAlert('Login', 'Password not provided!');
      return;
    }

    this.storage.set('rememberLogin', this.checkboxRememberLogin, this.title);
    console.log(`[${this.title}#login] (STORAGE) rememberLogin`, this.storage.get('rememberLogin', this.title));

    this.storage.set('login_email', this.login_email, this.title);
    this.storage.set('login_password', this.login_password, this.title);

    this.storage.set('username', this.login_email, this.title);
    console.log(`[${this.title}#login] (STORAGE) username`, this.storage.get('username', this.title));

    this.app.showAlert('Login', 'Successfully logged in!');
    this.redirectTo('menu');
  }

  togglePasswordPeek(event: any) {
    console.log(`[${this.title}#togglePasswordPeek] event.target.attributes[2].nodeValue`, event.target.attributes[2].nodeValue);

    const oldIcon = event.target.attributes[2].nodeValue;
    const passwordInput = document.getElementById('login_password');

    if (oldIcon == 'eye') {
      event.target.attributes[2].nodeValue = 'eye-off';
      passwordInput['type'] = 'text';
    }
    if (oldIcon == 'eye-off') {
      event.target.attributes[2].nodeValue = 'eye';
      passwordInput['type'] = 'password';
    }

    console.log(oldIcon + ' -> ' + event.target.attributes[2].nodeValue);

    this.updateView();
  }
}
