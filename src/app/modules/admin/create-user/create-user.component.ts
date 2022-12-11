import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private apiHttpService: ApiHttpService,
    private afAuth: AngularFireAuth,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  submitted: boolean = false;

  roles: Array<string> = ['admin', 'customer'];

  createUserForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    dob: [
      '',
      [
        Validators.required
      ]
    ],
    role: [
      '',
      [
        Validators.required
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ]
    ]
  });

  ngOnInit(): void {
  }

  get createUserFormControl() {
    return this.createUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.createUserForm.valid) {
      this.spinnerService.show();
      let formData = this.createUserForm.value;
      this.afAuth.createUserWithEmailAndPassword(formData.email, formData.password!).then((response) => {
        if (response && response.user) {
          const userData: any = {
            uid: response?.user?.uid,
            email: response?.user?.email,
            name: formData.name,
            dob: formData.dob,
            role: formData.role
          };
          this.apiHttpService.put(`/users/${response.user.uid}.json`, userData).subscribe((resp) => {
            this.spinnerService.hide();
            this.notify.showSuccess('User created successfully');
            this.router.navigate(["/admin/users"]);
          });
        }
      });
    }
  }

}
