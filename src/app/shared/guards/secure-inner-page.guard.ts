import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPageGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isLoggedIn) {
        this.notify.showError('Access Denied, You are already logged in!');
        this.router.navigate(['home']);
      }
      return true;
  }
  
}
