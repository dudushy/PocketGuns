/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Platform, ActionSheetController } from '@ionic/angular';

import { AppComponent } from '../app.component';

import { StorageService } from 'src/app/.services/storage.service';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  title = 'TestPage';
  theme: any = 'dark';

  photo: any = undefined;

  constructor(
    public app: AppComponent,
    public platform: Platform,
    private cdr: ChangeDetectorRef,
    public storage: StorageService,
    private camera: Camera,
    public actionSheetController: ActionSheetController
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

  takePicture(sourceType) {
    try {
      const options: CameraOptions = {
        // quality: 100,
        targetWidth: 200,
        targetHeight: 200,
        destinationType: this.camera.DestinationType.FILE_URI,
        // encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        // sourceType: this.camera.PictureSourceType.CAMERA
        sourceType: sourceType
      };
      console.log(`[${this.title}#takePicture] options`, options);

      this.camera.getPicture(options).then(imagePath => {
        console.log(`[${this.title}#takePicture] imagePath`, imagePath);
        const win: any = window;
        const safeURL = win.Ionic.WebView.convertFileSrc(imagePath);

        this.photo = {
          src: safeURL,
          path: imagePath,
        };

        console.log(`[${this.title}#takePicture] photo`, this.photo);

        this.updateView();
      }, (err) => {
        console.log(`[${this.title}#takePicture] err`, err);
      });
    } catch (error) {
      console.log(`[${this.title}#takePicture] error`, error);
    }
  }

  async askSourceType() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Substituir imagem',
      cssClass: 'actionSheet-askSourceType',
      buttons: [{
        text: 'Usar camera',
        icon: 'camera',
        handler: () => {
          console.log(`[${this.title}#askSourceType] takePicture(camera)`);
          this.takePicture(1);
        }
      },
      {
        text: 'Selecionar da galeria',
        icon: 'image',
        handler: () => {
          console.log(`[${this.title}#askSourceType] takePicture(gallery)`);
          this.takePicture(0);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log(`[${this.title}#askSourceType] cancel`);
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log(`[${this.title}#askSourceType] onDidDismiss resolved with role and data`, role, data);
  }
}
