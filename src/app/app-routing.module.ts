import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FarmersListComponent } from './farmer/farmers-list/farmers-list.component';
import { CreateFarmerComponent } from './farmer/create-farmer/create-farmer.component';
import { UserGuard } from './auth/user.guard';
import { FarmerComponent } from './farmer/farmer/farmer.component';
import { UserRoutingModule } from './auth/user-routing.module';

const routes: Routes = [
  { path: 'farmers', component: FarmersListComponent },
  { path: 'farmer/:farmerId', component: FarmerComponent },
  { path: 'farmers/new', component: CreateFarmerComponent, canActivate: [UserGuard] },
  { path: 'farmers/edit/:farmerId', component: CreateFarmerComponent, canActivate: [UserGuard] },
  { path: 'user', loadChildren: "./auth/user.module#UserModule" }
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    UserGuard
  ]
})
export class AppRoutingModule { }
