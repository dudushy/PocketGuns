/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';

import { AppComponent } from '../app.component';

import { StorageService } from 'src/app/.services/storage.service';

@Component({
  selector: 'app-dev-menu',
  templateUrl: './dev-menu.page.html',
  styleUrls: ['./dev-menu.page.scss'],
})
export class DevMenuPage implements OnInit {
  title = 'DevMenuPage';
  theme: any = 'dark';

  allPages: any = [];

  constructor(
    public app: AppComponent,
    public platform: Platform,
    private cdr: ChangeDetectorRef,
    private router: Router,
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
}
