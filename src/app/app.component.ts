/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';

import { MenuController, Platform, AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/.services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'AppComponent';
  theme: any = 'dark';

  allPages: any = [];
  currentPage: any;
  username: any = 'Guest';

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef,
    private menu: MenuController,
    public platform: Platform,
    public alertController: AlertController,
    public storage: StorageService
  ) {
    console.log(`[${this.title}#constructor]`);

    this.platform.ready().then((readySource) => {
      console.log(`[${this.title}#constructor] readySource`, readySource);

      this.theme = this.storage.get('theme', this.title) == null ? 'dark' : this.storage.get('theme', this.title);

      this.allPages = [];
      const allRoutes = this.router.config;
      for (const route of allRoutes) {
        if (route.path !== '') {
          if (route.path !== 'dev-menu') {
            this.allPages.push(route.path);
          }
        }
      }
      console.log(`[${this.title}#ionViewDidEnter] allPages`, this.allPages);

      this.currentPage = this.storage.get('last_page', this.title);
      console.log(`[${this.title}#constructor] currentPage`, this.currentPage);

      this.username = this.storage.get('username', this.title) == null ? 'Guest' : this.storage.get('username', this.title);
      console.log(`[${this.title}#constructor] username`, this.username);

      this.redirectTo(this.currentPage, this.title);
    });
  }

  ngOnInit() {
    console.log(`[${this.title}#ngOnInit]`);
  }

  defaultOrder() {
    return 0;
  }

  async showAlert(topic: string, msg: string) {
    console.log(`[${this.title}#showAlert] topic`, topic);
    console.log(`[${this.title}#showAlert] msg`, msg);

    const alert = await this.alertController.create({
      cssClass: 'alerts',
      header: topic,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`[${this.title}#showAlert] role`, role);
    return role;
  }

  updateView(from: string) {
    console.log(`[${this.title}#updateView] from`, from);

    this.theme = this.storage.get('theme', this.title) == null ? 'dark' : this.storage.get('theme', this.title);

    this.cdr.detectChanges;
  }

  redirectTo(url: any, from: any) {
    console.log(`[${this.title}#redirectTo] ${from} | url`, url);
    console.log(`[${this.title}#redirectTo] router.config`, this.router.config);

    if (from === 'LoginPage') { this.username = this.storage.get('username', this.title) == null ? 'Guest' : this.storage.get('username', this.title); }

    if (url == null) { url = 'login'; }
    this.router.navigateByUrl(`/${url}`);

    this.currentPage = url;
    this.storage.set('last_page', url, this.title);
    console.log(`[${this.title}#redirectTo] current_url`, this.currentPage);

    // this.toggleMenu();
    this.updateView('app');
  }

  toggleMenu() {
    console.log(`[${this.title}#toggleMenu]`);

    this.menu.enable(true, 'mainMenu');
    this.menu.toggle('mainMenu');
  }

  redirectAndCloseMenu(url: any) {
    this.redirectTo(url, this.title);
    this.toggleMenu();
  }

  logout() {
    console.log(`[${this.title}#logout]`);

    this.storage.set('username', null, this.title);
    this.username = 'Guest';
    this.storage.set('login_email', null, this.title);
    this.storage.set('login_password', null, this.title);
    this.storage.set('rememberLogin', null, this.title);

    this.updateView(this.title);
  }
}
