import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevMenuPage } from './dev-menu.page';

const routes: Routes = [
  {
    path: '',
    component: DevMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevMenuPageRoutingModule {}
