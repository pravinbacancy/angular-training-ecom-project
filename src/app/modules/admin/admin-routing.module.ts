import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  { 
    path: '', 
    component: AdminHomeComponent,
    children: [
      { path: '', redirectTo: "/admin/dashboard", pathMatch: "full"},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'user/create', component: CreateUserComponent },
      { path: 'user/edit/:id', component: EditUserComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/add', component: AddProductComponent },
      { path: 'product/edit/:id', component: EditProductComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'order/view/:id', component: ViewOrderComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
