import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  imageFile: any = '';
  imageFileDownloadPath: any = '';

  constructor(
    private fb: FormBuilder,
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private anFireStorage: AngularFireStorage,
  ) { }

  submitted: boolean = false;

  roles: Array<string> = ['admin', 'customer'];

  addProductForm = this.fb.group({
    image: [
      '',
      [
        Validators.required
      ]
    ],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(1000)
      ]
    ],
    price: [
      '',
      [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]
    ],
    quantity: [
      '',
      [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]
    ]
  });

  ngOnInit(): void {
  }

  get addProductFormControl() {
    return this.addProductForm.controls;
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  uploadFile() {
    return new Promise(resolve => {
      let imageFileName = '/products/' + new Date().getTime();
      const ref = this.anFireStorage.ref(imageFileName);
      const task = this.anFireStorage.upload(imageFileName, this.imageFile);
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.imageFileDownloadPath = url;
            resolve('resolved');
          });
        })
      ).subscribe()
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.addProductForm.valid) {
      this.spinnerService.show();
      //Uploading image first.
      await this.uploadFile();
      let formData = this.addProductForm.value;
      formData.image = this.imageFile.name;
      formData.imagePath = this.imageFileDownloadPath;
      this.apiHttpService.post(`/products.json`, formData).subscribe((resp) => {
        this.spinnerService.hide();
        this.notify.showSuccess('Product created successfully');
        this.router.navigate(["/admin/products"]);
      });
    }
  }
}
