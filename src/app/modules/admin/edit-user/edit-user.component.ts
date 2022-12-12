import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  submitted: boolean = false;

  roles: Array<string> = ['admin', 'customer'];

  editUserForm = this.fb.group({
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
    ]
  });

  ngOnInit(): void {
    this.spinnerService.show();
    this.apiHttpService.get(`/users/${this.userId}.json`).subscribe((resp) => {
      this.spinnerService.hide();

      this.editUserForm.patchValue({
        name: resp.name,
        email: resp.email,
        dob: resp.dob,
        role: resp.role
      });
    });
  }

  get editUserFormControl() {
    return this.editUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.editUserForm.valid) {
        this.spinnerService.show();
        let formData = this.editUserForm.value;
        formData.uid = this.userId;
        this.apiHttpService.put(`/users/${this.userId}.json`, formData).subscribe((resp) => {
          this.spinnerService.hide();
          this.notify.showSuccess('User information saved successfully');
          this.router.navigate(["/admin/users"]);
        });
    }
  }
}
