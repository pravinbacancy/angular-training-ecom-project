import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthAdminGuard } from "./shared/guards/auth-admin.guard";

import { AuthGuard } from './shared/guards/auth.guard';
import { SecureInnerPageGuard } from './shared/guards/secure-inner-page.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
      canActivate: [SecureInnerPageGuard]
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
      canActivate: [AuthGuard, AuthAdminGuard]
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
