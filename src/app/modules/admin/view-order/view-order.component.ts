import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHttpService } from 'src/app/shared/services/api-http.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  order: any = [];
  orderId: string = '';

  constructor(
    private apiHttpService: ApiHttpService,
    private spinnerService: NgxSpinnerService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe(params => {
      this.orderId = params['id'];
    });
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.apiHttpService.get(`/orders/${this.orderId}.json`).subscribe(async resp => {
      this.order = resp;
      this.order.id = this.orderId;
      await this.apiHttpService.get(`/products/${resp.product_id}.json`).subscribe((productResp) => {
        this.order.product = productResp;
      });
      this.spinnerService.hide();
    });
  }

}
