import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourierAgent, DeliveryAgentType, DeliveryPerson} from '../../../models/delivery-agent.model';
import {Order, OrderDeliveryAgent} from '../../../models/order.model';
import Swal from 'sweetalert2';
import {AppConfig} from '../../../config/app.config';
import {OrderService} from '../../../services/order.service';
import {Toast} from '../../../utils/toast';

@Component({
  selector: 'app-delivery-agent-assign-dialog',
  templateUrl: './delivery-agent-assign-dialog.component.html',
  styleUrls: ['./delivery-agent-assign-dialog.component.scss']
})
export class DeliveryAgentAssignDialogComponent {

  isEdit: boolean = false;
  dialogTitle: string = 'Delivery Agent';
  agentType: DeliveryAgentType;
  order: Order;

  agentTypes = DeliveryAgentType;

  deliveryPersons: DeliveryPerson[];
  courierAgents: CourierAgent[];

  deliveryPersonForm: FormGroup;
  courierAgentForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DeliveryAgentAssignDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private spinner: NgxSpinnerService,
              private snackBar: MatSnackBar, private fb: FormBuilder, private orderService: OrderService) {

    this.isEdit = this.dialogData.edit;
    this.agentType = this.dialogData.agentType;
    this.order = this.dialogData.order;

    this.deliveryPersons = this.dialogData.deliveryPersons;
    this.courierAgents = this.dialogData.courierAgents;

    /* Form Builder */
    this.deliveryPersonForm = this.fb.group({
      by_self_agent: [null, [Validators.required]]
    });
    this.courierAgentForm = this.fb.group({
      courier_agent: [null, [Validators.required]],
      courier_agent_tracking_code: [null, [Validators.minLength(3)]]
    });

    console.log("this.deliveryPersons", this.deliveryPersons);
    console.log("this.courierAgents", this.courierAgents);

    if (this.agentType === this.agentTypes.BY_SELF) {
      if (this.isEdit) {
        this.dialogTitle = 'Re-assign Delivery Person';
      } else {
        this.dialogTitle = 'Assign Delivery Person';
      }
    } else {
      if (this.isEdit) {
        this.dialogTitle = 'Re-assign Courier Agent';
      } else {
        this.dialogTitle = 'Assign Courier Agent';
      }
    }
  }

  ngOnInit() {}

  onSetDeliveryAgent() {
    let deliveryAgent: OrderDeliveryAgent;

    if (this.agentType === this.agentTypes.BY_SELF) {
      deliveryAgent = this.deliveryPersonForm.value as OrderDeliveryAgent;
    } else {
      deliveryAgent = this.courierAgentForm.value as OrderDeliveryAgent;
    }
    deliveryAgent.assigned_agent_type = this.agentType;

    Swal.fire({
      icon: "question",
      title: `Confirm assign delivery agent for order #${this.order.order_number} ?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Proceed",
      confirmButtonColor: AppConfig.COLORS.PRIMARY
    }).then(result => {
      if (result.isConfirmed) {
        let api;

        if(this.isEdit) {
          deliveryAgent.id = this.order.order_delivery.id;
          api = this.orderService.updateOrderDelivery(this.order, deliveryAgent);
        } else {
          api = this.orderService.createOrderDelivery(this.order, deliveryAgent);
        }

        this.spinner.show("saveDialogSpinner");
        api.subscribe(res => {
          this.spinner.hide("saveDialogSpinner");
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: "Delivery Agent updated successfully",
            timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
            showConfirmButton: false,
            showCloseButton: true
          });
          this.dialogRef.close({ success: true });
        },
        error => {
          this.spinner.hide("saveDialogSpinner");
          Toast.fire({
            icon: "error",
            html: '<div class="text-danger">Error while updating data</div>'
          })
        })
      }
    })
  }

  onCloseDialog() {
    this.dialogRef.close(null);
  }
}
