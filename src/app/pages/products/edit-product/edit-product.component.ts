import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Product, ProductCategory, ProductType} from '../../../models/product.model';
import {Discount, DiscountType} from '../../../models/discount.model';
import {Tax} from '../../../models/tax.model';
import Swal from 'sweetalert2';
import {AppConfig} from '../../../config/app.config';
import {Toast} from '../../../utils/toast';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AngularEditorConfig} from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

  isEdit = true;
  pageTitle: string = 'New Product';

  productTypes = ProductType;
  discountTypes = DiscountType;

  product: Product | undefined;

  allActiveProductCategories: ProductCategory[];
  allActiveDiscounts: Discount[];
  allActiveTaxes: Tax[];

  linkedCategories: ProductCategory[];
  relatedProducts: Product[];

  selectableCategories: ProductCategory[];
  selectableDiscounts: Discount[];
  selectableTaxes: Tax[];

  filteredProducts: Product[] | undefined;

  searchProductInputField = new FormControl(null);

  htmlEditorConfig: AngularEditorConfig  = {
    minHeight: "150px",
    editable: true,
    translate: "yes",
    toolbarHiddenButtons: [
      ["fontName"],
      ["fontSize", "textColor", "backgroundColor", "customClasses", "link", "unlink", "insertImage", "insertVideo",
        "insertHorizontalRule"]
    ]
  }

  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private dialogBox: MatDialog,
              private productService: ProductService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService, private fb: FormBuilder) {

    /* Form Builder */
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      manufacturer: [null, [Validators.required, Validators.minLength(3)]],
      mrp: [null, [Validators.required, Validators.min(1)]],
      product_type: [null, [Validators.required]],
      prescription_required: [false, [Validators.required]],
      package_size: [null, [Validators.required, Validators.maxLength(40)]],

      tax: [null],
      discount: [null],

      description: [null, [Validators.minLength(30)]],
      ingredients: [null],
      uses: [null],
      side_effects: [null],

      is_active: [true, [Validators.required]],
      categories: this.fb.array([]),
      related_products: this.fb.array([])
    });

    this.isEdit = this.route.snapshot.data['isEdit'];
    this.allActiveProductCategories = this.route.snapshot.data['allActiveProductCategories'];
    this.allActiveDiscounts = this.route.snapshot.data['allActiveDiscounts'];
    this.allActiveTaxes = this.route.snapshot.data['allActiveTaxes'];

    this.selectableDiscounts = JSON.parse(JSON.stringify(this.allActiveDiscounts)) as Discount[];
    this.selectableTaxes = JSON.parse(JSON.stringify(this.allActiveTaxes)) as Tax[];
    this.selectableCategories = [];

    if(this.isEdit) {
      this.product = this.route.snapshot.data['product'];
      this.linkedCategories = JSON.parse(JSON.stringify(this.product?.categories));
      this.relatedProducts = JSON.parse(JSON.stringify(this.product?.related_products));
    } else {
      this.linkedCategories = [];
      this.relatedProducts = [];
    }

    this.filterSelectableProductCategory();

    if (this.isEdit) {
      const product$: Product = JSON.parse(JSON.stringify(this.product));
      product$.tax = this.product?.tax ? (this.product.tax as Tax).id : null;
      product$.discount = this.product?.discount ? (this.product.discount as Discount).id : null;
      this.form.patchValue(product$);
      this.pageTitle = `Product: <span class="mat-text-primary">${product$.name}</span>`;
      console.log("this.product", this.product)
    } else {
      this.pageTitle = 'New Product';
      this.form.reset();
      this.form.patchValue({
        prescription_required: false,
        is_active: true
      });
    }
  }

  ngOnInit() {
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
              const relatedProductIds = this.relatedProducts.map(rp => rp.id);
              this.filteredProducts = this.filteredProducts?.filter(fp => !relatedProductIds.includes(fp.id));

              console.log("relatedProductIds", relatedProductIds);
              console.log("this.filteredProducts", this.filteredProducts);
            }
          );
        }
      });
  }

  onSaveProduct() {
    console.log('this.form.invalid', this.form.invalid);
    console.log('this.form', this.form);
    if (this.form.invalid) {
      Swal.fire({
        icon: "error",
        html: "Please <b>fill details</b> correctly"
      });
      this.form.markAllAsTouched();
      return;
    }

    if (!this.form.dirty) {
      this.snackBar.open("Nothing to Save!", "Okay", {
        duration: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS
      });
      return;
    }

    const formData: Product = this.form.value;
    formData.categories = JSON.parse(JSON.stringify(this.linkedCategories.map(c => c.id)));
    formData.related_products = JSON.parse(JSON.stringify(this.relatedProducts.map(p => p.id)));

    let api;
    if (this.isEdit) {
      formData.id = this.product?.id as string;
      api = this.productService.updateProduct(formData);
    } else {
      api = this.productService.createProduct(formData);
    }

    this.spinner.show("savingSpinner");
    api.subscribe(res => {
      this.spinner.hide("savingSpinner");

      if (this.isEdit) {
        Swal.fire({
          icon: "success",
          text: "Product saved successfully",
          showConfirmButton: !0,
          showCancelButton: !0,
          confirmButtonText: "Okay, go back!",
          cancelButtonText: "Stay Here!"
        }).then(result => {
          if(result.isConfirmed) {
            history.back();
          } else {
            location.reload();
          }
        })
      } else {
        Swal.fire({
          icon: "success",
          text: "Product saved successfully",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Add More Product(s)",
          cancelButtonText: "Okay!"
        }).then(result => {
          if(result.isConfirmed) {
            location.reload();
          } else {
            this.router.navigate(['../', 'all'], {relativeTo: this.route});
          }
        })
      }
    },
    error => {
      this.spinner.hide("savingSpinner");
      if (error.status == 400) {
        Object.keys(error.error).forEach(f => {
          this.form.controls[f].setErrors({
            serverError: error.error[f]
          })
        });
      } else {
        Toast.fire({
          icon: 'error',
          text: 'Error while saving object.'
        })
      }
    })
  }

  onDeleteProduct() {
    Swal.fire({
      title: `Delete tax record: ${this.product?.name}?`,
      icon: "question",
      html: `To confirm this action, please type <b><code>${this.product?.name}</code></b>`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: inputValue => {
        if (inputValue !== '' && inputValue === this.product?.name) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct product name");
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");

        this.productService.deleteProduct(this.product as Product).subscribe(t => {
          this.spinner.hide("deletingSpinner");

          Swal.fire({
            position: "top-end",
            icon: "success",
            text: "Product deleted: " + this.product?.name,
            timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS
          });

          setTimeout(() => {
            history.back()
          }, 500);

        },
        error => {
          this.spinner.hide("deletingSpinner");
          console.log('err', error);
          if (error.status === 400) {
            Toast.fire({
              icon: "warning",
              text: "Cannot delete this record because it is referenced by other records",
              position: "center"
            });
          } else {
            Toast.fire({
              icon: "error",
              text: "Error while deleting record: Code - " + error.message,
            })
          }
        });
      }
    });
  }

  onAddProductCategory(selectedCategory: ProductCategory) {
    if (selectedCategory.parent_category) {
      const parentCategoryId = selectedCategory.parent_category.toString();
      selectedCategory.parent_category = this.allActiveProductCategories.filter(cat => cat.id === parentCategoryId)[0]
    }
    this.linkedCategories.push(selectedCategory);

    console.log('this.linkedCategories', this.linkedCategories);

    this.form.controls['categories'].markAsDirty();
    this.form.controls['categories'].markAsTouched();
    this.filterSelectableProductCategory();
  }

  onRemoveProductCategory(categoryIndex: number) {
    this.linkedCategories.splice(categoryIndex, 1);
    this.form.controls['categories'].markAsDirty();
    this.form.controls['categories'].markAsTouched();
    this.filterSelectableProductCategory();
  }

  filterSelectableProductCategory() {
    const selectedCategoryIds = this.linkedCategories.map(cat => cat.id);

    this.selectableCategories = JSON.parse(JSON.stringify(this.allActiveProductCategories)) as ProductCategory[];
    this.selectableCategories = this.selectableCategories.filter(cat => selectedCategoryIds.indexOf(cat.id) === -1);

    (this.selectableCategories as ProductCategory[]).forEach(cat => {
      console.log(cat.child_categories)
      cat.child_categories = cat.child_categories.filter(cat => selectedCategoryIds.indexOf(cat.id) === -1)
    });
  }

  onAddRelatedProduct(relatedProduct: Product) {
    this.relatedProducts.push(relatedProduct);
    this.searchProductInputField.patchValue(null);

    this.form.controls['related_products'].markAsDirty();
    this.form.controls['related_products'].markAsTouched()
  }

  onRemoveRelatedProduct(relatedProductIndex: number) {
    this.relatedProducts.splice(relatedProductIndex, 1);

    this.form.controls['related_products'].markAsDirty();
    this.form.controls['related_products'].markAsTouched();
  }

  onGoBack() {
    history.back()
  }
}
