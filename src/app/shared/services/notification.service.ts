import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';

const appName = environment.appName;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  
  showSuccess(message: string, title: string=appName){
    this.toastr.success(message, title);
  }

  showError(message: string, title: string=appName){
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string=appName){
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string=appName){
    this.toastr.warning(message, title);
  }

}
