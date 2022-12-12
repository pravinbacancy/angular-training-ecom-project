import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, } from '@angular/fire/compat/storage';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productId: string = '';
  productData: any = {};
  imageFile: any = '';
  imageFileDownloadPath: any = '';
  showFileUpload: boolean = false;
  changeImageButtonText: string = 'Change Image';

  constructor(
    private fb: FormBuilder,
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private anFireStorage: AngularFireStorage,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe(params => {
      this.productId = params['id'];
    });
  }

  submitted: boolean = false;

  roles: Array<string> = ['admin', 'customer'];

  editProductForm = this.fb.group({
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
    this.spinnerService.show();
    this.editProductForm.get('image')?.clearValidators();
    this.editProductForm.get('image')?.updateValueAndValidity();
    this.apiHttpService.get(`/products/${this.productId}.json`).subscribe((resp) => {
      this.spinnerService.hide();
      this.productData = resp;
      this.editProductForm.patchValue({
        name: this.productData.name,
        price: this.productData.price,
        description: this.productData.description,
        quantity: this.productData.quantity
      });
    });
  }

  get editProductFormControl() {
    return this.editProductForm.controls;
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  ChangeImage() {

    this.showFileUpload = !this.showFileUpload;
    if (this.showFileUpload) {
      this.changeImageButtonText = 'Keep old';
      this.editProductForm.get('image')?.setValidators([Validators.required]);
      this.editProductForm.get('image')?.updateValueAndValidity();
    } else {
      this.changeImageButtonText = 'Change Image';
      this.editProductForm.get('image')?.clearValidators();
      this.editProductForm.get('image')?.updateValueAndValidity();
    }
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

  deleteOldFile() {
    return new Promise(resolve => {
      this.anFireStorage.storage.refFromURL(this.productData.imagePath).delete();
      resolve('resolved');
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.editProductForm.valid) {
      this.spinnerService.show();
      let formData = this.editProductForm.value;
      if (formData.image && formData.image.length) {
        //Removing old image first and then uploading new image.
        await this.deleteOldFile();
        await this.uploadFile();
        formData.image = this.imageFile.name;
        formData.imagePath = this.imageFileDownloadPath;
      }else{
        delete formData.image; // deleting image from formData so it will take old image name from productData object.
        formData = {...this.productData, ...formData};
      }
      this.apiHttpService.put(`/products/${this.productId}.json`, formData).subscribe((resp) => {
        this.spinnerService.hide();
        this.notify.showSuccess('Product Information saved successfully');
        this.router.navigate(["/admin/products"]);
      });
    }
  }

}
