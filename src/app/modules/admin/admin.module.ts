import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SideNavBarComponent,
    UsersComponent,
    OrdersComponent,
    ProductsComponent,
    AdminHomeComponent,
    CreateUserComponent,
    EditUserComponent,
    AddProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AngularFireModule,
    AngularFireStorageModule
  ]
})
export class AdminModule { }
