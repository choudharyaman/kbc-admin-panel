import {Component, Inject} from '@angular/core';
import {Discount, DiscountType} from '../../../models/discount.model';
import {Order, OrderItem} from '../../../models/order.model';
import {Tax} from '../../../models/tax.model';
import {Product} from '../../../models/product.model';
import {FormBuilder, FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OrderService} from '../../../services/order.service';
import {ProductService} from '../../../services/product.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {AppConfig} from '../../../config/app.config';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-order-items-dialog',
  templateUrl: './edit-order-items-dialog.component.html',
  styleUrls: ['./edit-order-items-dialog.component.scss']
})
export class EditOrderItemsDialogComponent {
  isOrderModified: boolean = false;
  discountTypes = DiscountType;

  order: Order;
  orderItems: OrderItem[];

  availableTaxes: Tax[];
  availableDiscounts: Discount[];

  orderMetrics = {
    grossAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
    netAmount: 0
  }

  filteredProducts: Product[] | undefined;

  searchProductInputField = new FormControl('');

  constructor(public dialogRef: MatDialogRef<EditOrderItemsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private spinner: NgxSpinnerService,
              private snackBar: MatSnackBar, private fb: FormBuilder,
              private orderService: OrderService, private productService: ProductService,) {

    this.order = this.dialogData.order;
    this.availableTaxes = this.dialogData.taxes;
    this.availableDiscounts = this.dialogData.discounts

    this.orderItems = JSON.parse(JSON.stringify(this.order.order_items));

    this.orderMetrics.grossAmount = this.order.gross_amount;
    this.orderMetrics.discountAmount = this.order.discount_amount;
    this.orderMetrics.taxAmount = this.order.tax_amount;
    this.orderMetrics.netAmount = this.order.net_amount;
  }

  ngOnInit(): void {
    this.searchProductInputField.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe((changedValue) => {
        this.filteredProducts = [];
        const searchTerm: string = (changedValue || '').trim().toLowerCase();
        if (searchTerm) {
          const queryParams: QueryParamsMeta = {
            page_size: 50,
            search: searchTerm
          };
          this.productService.searchActiveProducts(queryParams).subscribe(
            res => {
              this.filteredProducts = (res as ResponseData).data.results;
              const selectedProductIds = this.orderItems.map(t => t.product.id);
              this.filteredProducts = this.filteredProducts?.filter(fp => !selectedProductIds.includes(fp.id));
            }
          );
        }
      });
  }

  onAddNewProduct(product: Product) {
    console.log("select-product", product);
    this.orderItems.push({
      product: product,
      quantity: 1,
      rate: product.mrp,
      gross_amount: product.mrp,
      tax: product.tax,
      discount: product.discount,
      discount_amount: 0,
      tax_amount: 0,
      net_amount: 0
    } as OrderItem);
    this.recalculateOrderValue();
    this.searchProductInputField.setValue('');
  }

  onProductQuantityChange(orderItemIndex: number, quantity: any) {
    console.log("product-change", orderItemIndex, "qty", quantity);
    this.orderItems[orderItemIndex].quantity = quantity > 0 ? quantity : 1;
    this.recalculateOrderValue();
  }

  onRemoveProduct(orderItemIndex: number) {
    this.orderItems.splice(orderItemIndex, 1);
    this.recalculateOrderValue();
  }

  onProductDiscountChange(orderItemIndex: number, discountId: string) {
    if (discountId) {
      const discount: Discount = JSON.parse(JSON.stringify(this.availableDiscounts.find(d => d.id === discountId)));
      console.log("product-change", orderItemIndex, "discount-id", discountId, "discount", discount);
      this.orderItems[orderItemIndex].discount = discount;
    } else {
      this.orderItems[orderItemIndex].discount = null;
    }
    this.recalculateOrderValue();
  }

  onProductTaxChange(orderItemIndex: number, taxId: string) {
    console.log("product-change", orderItemIndex, "tax-id", taxId);
    if (taxId) {
      const tax = JSON.parse(JSON.stringify(this.availableTaxes.find(t => t.id === taxId)));
      console.log("product-change", orderItemIndex, "tax-id", taxId, "tax", tax);
      this.orderItems[orderItemIndex].tax = tax;
    } else {
      this.orderItems[orderItemIndex].tax = null;
    }
    this.recalculateOrderValue();
  }

  recalculateOrderValue() {
    this.isOrderModified = true;

    let
      grossAmount = 0,
      discountAmount = 0,
      taxAmount = 0,
      netAmount = 0;

    this.orderItems.forEach(item => {
      item.gross_amount = item.rate * item.quantity;
      item.gross_amount = parseFloat(item.gross_amount.toFixed(2));

      if (item?.discount) {
        if (item.discount.discount_type === this.discountTypes.ABSOLUTE) {
          item.discount_amount = item.discount.discount_amount;
        } else {
          item.discount_amount = item.gross_amount * (item.discount.discount_amount / 100);
          item.discount_amount = parseFloat(item.discount_amount.toFixed(2));
        }
      } else {
        item.discount_amount = 0;
      }

      if (item?.tax) {
        const taxableAmount = item.gross_amount - item.discount_amount;
        item.tax_amount = taxableAmount * (item.tax.tax / 100);
        item.tax_amount = parseFloat(item.tax_amount.toFixed(2));
      } else {
        item.tax_amount = 0;
      }

      item.net_amount = item.gross_amount - item.discount_amount + item.tax_amount;
      item.net_amount = parseFloat(item.net_amount.toFixed(2));

      grossAmount += item.gross_amount;
      discountAmount += item.discount_amount;
      taxAmount += item.tax_amount;
      netAmount += item.net_amount
    });

    this.orderMetrics.grossAmount = grossAmount;
    this.orderMetrics.discountAmount = discountAmount;
    this.orderMetrics.taxAmount = taxAmount;
    this.orderMetrics.netAmount = netAmount;

  }

  onSaveOrder() {
    if (this.isOrderModified) {
      if (this.orderItems.length > 0) {
        Swal.fire({
          icon: "question",
          title: "Confirm save the Order # " + this.order.order_number,
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Yes, Proceed",
          confirmButtonColor: AppConfig.COLORS.PRIMARY
        }).then(result => {
          if (result.isConfirmed) {
            this.onSaveOrderConfirm();
          }
        })
      } else {
        Swal.fire({
          icon: "warning",
          text: "Order should contains at-least one item"
        })
      }
    } else {
      Swal.fire({
        icon: "info",
        text: "Nothing to save!"
      });
    }
  }

  onSaveOrderConfirm() {
    const orderItems$: any[] = [];
    this.orderItems.forEach(item => {
      orderItems$.push({
        product: item.product.id,
        quantity: item.quantity,
        discount: item.discount ? item.discount.id : null,
        tax: item.tax ? item.tax.id : null
      });
    });
    this.spinner.show("saveDialogSpinner");
    this.orderService.updateOrderItems(this.order, orderItems$).subscribe(res => {
      this.spinner.hide("saveDialogSpinner");
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "Order saved successfully",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS,
        showConfirmButton: false,
        showCloseButton: true
      });
      this.dialogRef.close({
        success: true
      });
    })
  }

  onDiscardChanges() {
    this.isOrderModified = false;

    this.orderItems = JSON.parse(JSON.stringify(this.order.order_items));

    this.orderMetrics.grossAmount = this.order.gross_amount;
    this.orderMetrics.discountAmount = this.order.discount_amount;
    this.orderMetrics.taxAmount = this.order.tax_amount;
    this.orderMetrics.netAmount = this.order.net_amount;
  }

  onCloseDialog() {
    if (this.isOrderModified) {
      Swal.fire({
        icon: "question",
        title: "Discard order item(s) changes?",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Proceed",
        confirmButtonColor: AppConfig.COLORS.DANGER
      }).then(result => {
        if (result.isConfirmed) {
          this.dialogRef.close(null);
        }
      })
    } else {
      this.dialogRef.close(null);
    }
  }

  onBringFocusOnProductSearch() {
    // this.searchProductInputFieldRef.nativeElement.focus()
  }

  voidShortcut() {}
}
