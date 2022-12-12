import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  constructor(
    private apiHttpService: ApiHttpService,
    private notify: NotificationService,
    private spinnerService: NgxSpinnerService,
    private anFireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    this.spinnerService.show();
    this.apiHttpService.get('/orders.json').subscribe(async resp => {
      if (resp) {
        for (const [key, value] of Object.entries(resp)) {
          let order: any = value;
          order.id = key;
          await this.apiHttpService.get(`/products/${order.product_id}.json`).subscribe((resp) => {
            order.product = {
              name: resp.name,
              imagePath: resp.imagePath
            }
            this.orders.push(order);
          });
        }
      }
      this.spinnerService.hide();
    });
  }

  deleteOrder(id: string) {
    if (confirm("Are you sure you want to delete this order?")) {
      this.spinnerService.show();
      this.apiHttpService.delete(`/orders/${id}.json`).subscribe(() => {
        this.notify.showSuccess('Order deleted successfully');
        this.spinnerService.hide();
        this.orders = [];
        this.getOrderList();
      });
    }
  }

}
