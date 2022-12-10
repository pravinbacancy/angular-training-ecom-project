import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  
  appName: string = environment.appName;
  
  constructor(
    private notify: NotificationService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.SignOut();
    this.notify.showSuccess('You have successfully logged out!');
  }

}
