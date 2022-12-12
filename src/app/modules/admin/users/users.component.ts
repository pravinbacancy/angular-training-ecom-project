import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = [];

  constructor(
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.apiHttpService.get('/users.json').subscribe(resp => {
      if (resp) {
        this.users = Object.values(resp);
      }
    });
  }
  async deleteUser(uid: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.spinnerService.show();
      this.apiHttpService.delete(`/users/${uid}.json`).subscribe(resp => {
        this.notify.showSuccess('User deleted successfully');
        this.spinnerService.hide();
        this.getUserList();
      });
    }
  }

}
