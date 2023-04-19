import {Component} from '@angular/core';
import {Order, OrderPaymentTransaction, OrderStatus} from '../../../models/order.model';
import {CourierAgent, DeliveryAgentType, DeliveryPerson} from '../../../models/delivery-agent.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {OrderService} from '../../../services/order.service';
import {Tax} from '../../../models/tax.model';
import {Discount} from '../../../models/discount.model';
import {AppPages} from '../../../config/app.pages';
import {ResponseData} from '../../../models/paginator.model';
import {Toast} from '../../../utils/toast';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DeliveryAgentAssignDialogComponent
} from '../delivery-agent-assign-dialog/delivery-agent-assign-dialog.component';
import {AppConfig} from '../../../config/app.config';
import Swal from 'sweetalert2';
import {EditOrderItemsDialogComponent} from '../edit-order-items-dialog/edit-order-items-dialog.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {

  orderId: string;

  order: Order;
  courierAgents: CourierAgent[];
  deliveryPersons: DeliveryPerson[];
  availableTaxes: Tax[];
  availableDiscounts: Discount[];


  deliveryAgentTypes = DeliveryAgentType;
  orderStatuses = OrderStatus;

  constructor(private route: ActivatedRoute, private router: Router, private dialogBox: MatDialog,
              private orderService: OrderService, private spinner: NgxSpinnerService) {

    this.orderId = this.route.snapshot.params['orderId'];
    this.order = this.route.snapshot.data['order'];
    this.courierAgents = this.route.snapshot.data['courierAgents'];
    this.deliveryPersons = this.route.snapshot.data['deliveryPersons'];
    this.availableTaxes = this.route.snapshot.data['availableTaxes'];
    this.availableDiscounts = this.route.snapshot.data['availableDiscounts'];

    console.log('this.route.snapshot', this.route.snapshot);
  }

  ngOnInit() {
  }

  async onViewCustomer() {
    await this.router.navigate([AppPages.customers, this.order.customer.id], {
      relativeTo: this.route
    })
  }

  onMarkOrderDelivered() {
    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return;
    }

    const order = {
      id: this.order.id,
      status: this.orderStatuses.DELIVERED
    } as Order;

    if (!this.order.is_paid) {
      order.is_paid = true;
    }

    this.updateOrder(
      order,
      `Confirm mark Order #${this.order.order_number} as paid and delivered?`
    );
  }

  onDenyOrder() {
    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return;
    }

    this.updateOrder(
      {
        id: this.order.id,
        status: this.orderStatuses.DENIED,
        staff_remark: "Order denied by administrator"
      } as Order,
      `Confirm deny Order #${this.order.order_number}?`,
      AppConfig.COLORS.DANGER
    )
  }

  onAcceptOrder() {
    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return;
    }

    this.updateOrder({
      id: this.order.id,
      status: this.orderStatuses.CONFIRMED
    } as Order,
    `Confirm accept Order #${this.order.order_number}?`)
  }

  onAssignDeliveryAgent(agentType$: DeliveryAgentType) {
    console.log("agentTypeStr", agentType$);

    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return;
    }

    this.dialogBox.open(DeliveryAgentAssignDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: false,
        agentType: agentType$,
        order: this.order,
        deliveryPersons: this.deliveryPersons,
        courierAgents: this.courierAgents
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchOrder();
      }
    })
  }

  onReAssignDeliveryAgent(agentType$: DeliveryAgentType) {
    console.log("agentTypeStr", agentType$);

    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return
    }

    this.dialogBox.open(DeliveryAgentAssignDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: true,
        agentType: agentType$,
        order: this.order,
        deliveryPersons: this.deliveryPersons,
        courierAgents: this.courierAgents
      }
    }).afterClosed().subscribe(t => {
      t && location.reload()
    })
  }

  onModifyOrder() {
    if (this.dialogBox.openDialogs?.length > 0) {
      console.log("Some Dialog is already open", this.dialogBox.openDialogs);
      return
    }

    this.dialogBox.open(EditOrderItemsDialogComponent, {
      width: "80%",
      disableClose: true,
      data: {
        order: this.order,
        discounts: this.availableDiscounts,
        taxes: this.availableTaxes
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchOrder();
      }
    })
  }

  updateOrder(order: Order, dialogTitle: string, dialogConfirmButtonColor: string = AppConfig.COLORS.PRIMARY) {
    Swal.fire({
      icon: "question",
      title: dialogTitle,
      showCancelButton: !0,
      cancelButtonText: "No, Go Back",
      confirmButtonText: "Yes, Proceed",
      confirmButtonColor: dialogConfirmButtonColor
    }).then(value => {
      if (value.isConfirmed) {
        this.orderService.updateOrder(order).subscribe(t => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: "Order updated successfully",
            timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
            showConfirmButton: false,
            showCloseButton: true
          }).then(() => {
            this.fetchOrder();
          });
        }, t => {
          Toast.fire({
            icon: "error",
            html: '<div class="text-danger">Error while updating object</div>',
          })
        })
      }
    })
  }

  get latestPaymentDetail() {
    return this.order.order_payment_transactions[this.order.order_payment_transactions.length-1] as OrderPaymentTransaction;
  }

  fetchOrder() {
    this.spinner.show('loadingSpinner');
    this.orderService.getOrder(this.order.id).subscribe(res=> {
      this.spinner.hide('loadingSpinner');
      this.order = (res as ResponseData).data;
    },
    error => {
      this.spinner.hide('loadingSpinner');
      Toast.fire({
        icon: 'error',
        text: 'Error while fetching order'
      });
    })
  }

  onOpenAdviceSlip(adviceSlipURL: string) {
    window.open(adviceSlipURL);
  }

  onPrintBill() {
    const addressLabelEl = document.getElementById('printableAddressLabel')?.innerHTML;
    const billDetailEl = document.getElementById("printableBillDetails")?.innerHTML;
    const tab = window.open("", "_blank");
    (tab as Window).document.open();
    (tab as Window).document.write(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title></title>
        <style>
          @media print {
            h2, .badge, button {
              display: none;
            }
          }
        </style>
      </head>
      <body onload="window.print();setTimeout(() => {window.close()}, 2000)">
        <div [innerHTML]="${addressLabelEl}"></div>
        <hr>
        <div [innerHTML]="${billDetailEl}"></div>
        </body>
      </html>
    `);
    (tab as Window).document.close()
  }

  onPrintAddressLabel() {
    const addressLabelEl = document.getElementById('printableAddressLabel')?.innerHTML;

    const tab = window.open("", "_blank");
    (tab as Window).document.open();
    (tab as Window).document.write(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title></title>
        <style>
          @media print {
            h2, .badge, button {
              display: none;
            }
          }
        }
        </style>
      </head>
      <body onload="window.print();setTimeout(() => {window.close()}, 2000)">
        <div [innerHTML]="${addressLabelEl}"></div>
        </body>
      </html>
    `);
    (tab as Window).document.close()
  }
}
