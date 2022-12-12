import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  constructor(
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private anFireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList() {
    this.apiHttpService.get('/products.json').subscribe(resp => {
      if (resp) {
        for (const [key, value] of Object.entries(resp)) {
          let product: any = value;
          product.id = key;
          this.products.push(product);
        }
      }
    });
  }

  deleteImageFile(fileUrl: string) {
    return new Promise(resolve => {
      this.anFireStorage.storage.refFromURL(fileUrl).delete();
      resolve('resolved');
    });
  }

  async deleteProduct(id: string, fileUrl: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.spinnerService.show();
      await this.deleteImageFile(fileUrl);
      this.apiHttpService.delete(`/products/${id}.json`).subscribe(resp => {
        this.notify.showSuccess('Product deleted successfully');
        this.spinnerService.hide();
        this.products = [];
        this.getProductList();
      });
    }
  }

}
