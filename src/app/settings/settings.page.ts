/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';

import { AppComponent } from '../app.component';

import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/.services/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  title = 'SettingsPage';
  theme: any = 'dark';

  isDark: any = true;

  constructor(
    public app: AppComponent,
    public platform: Platform,
    private cdr: ChangeDetectorRef,
    public alertController: AlertController,
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
      console.log(`[${this.title}#ionViewDidEnter] theme`, this.theme);

      if (this.theme == 'light') {
        this.isDark = false;
      } else {
        this.isDark = true;
      }
      console.log(`[${this.title}#ionViewDidEnter] isDark`, this.isDark);

      this.updateView();
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

  async eraseStorage(topic: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'alerts',
      header: topic,
      message: msg,
      buttons: [
        {
          cssClass: 'alerts-cancel',
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log(`[${this.title}#eraseStorage] CANCEL`);
          }
        },
        {
          cssClass: 'alerts-accept',
          text: 'Accept',
          handler: () => {
            console.log(`[${this.title}#eraseStorage] ACCEPT`);

            localStorage.clear();
            this.theme = 'dark';
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`[${this.title}#eraseStorage] role`, role);

    this.theme = this.storage.get('theme', this.title) == null ? 'dark' : this.storage.get('theme', this.title);
    console.log(`[${this.title}#eraseStorage] theme`, this.theme);

    if (this.theme == 'light') {
      this.isDark = false;
    } else {
      this.isDark = true;
    }
    console.log(`[${this.title}#eraseStorage] isDark`, this.isDark);

    this.updateView();
  }

  toggleTheme() {
    console.log(`[${this.title}#toggleTheme] (BEFORE) isDark`, this.isDark);
    console.log(`[${this.title}#toggleTheme] (BEFORE) theme`, this.theme);

    if (this.theme == 'light') {
      this.theme = 'dark';
      this.isDark = true;
    } else {
      this.theme = 'light';
      this.isDark = false;
    }
    this.storage.set('theme', this.theme, this.title);

    console.log(`[${this.title}#toggleTheme] (AFTER) isDark`, this.isDark);
    console.log(`[${this.title}#toggleTheme] (AFTER) theme`, this.theme);

    this.updateView();
  }
}
