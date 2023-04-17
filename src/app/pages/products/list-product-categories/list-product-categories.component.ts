import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../services/product.service';
import {ProductCategory} from '../../../models/product.model';
import {ResponseData} from '../../../models/paginator.model';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {Toast} from '../../../utils/toast';
import {AppConfig} from '../../../config/app.config';
import {
  EditProductCategoryDialogComponent
} from '../edit-product-category-dialog/edit-product-category-dialog.component';

@Component({
  selector: 'app-list-product-categories',
  templateUrl: './list-product-categories.component.html',
  styleUrls: ['./list-product-categories.component.scss']
})
export class ListProductCategoriesComponent {

  productCategories: ProductCategory[];

  defaultCategoryThumbnail = "assets/images/icon-category-default.png";

  constructor(private route: ActivatedRoute, private router: Router, private dialogBox: MatDialog,
              private productService: ProductService, private spinner: NgxSpinnerService) {
    this.productCategories = this.route.snapshot.data['productCategories'];
  }

  ngOnInit() {
  }

  onAddNewCategory() {
    const availableCategories$ = this.productCategories.filter(cat => cat.parent_category == null);
    this.dialogBox.open(EditProductCategoryDialogComponent, {
      width: "600px",
      disableClose: true,
      data: {
        edit: false,
        availableCategories: availableCategories$
      }
    }).afterClosed().subscribe(t => {
      t && (console.log(t), this.fetchProductCategories())
    })
  }

  onEditCategory(category$: ProductCategory) {
    const availableCategories$ = this.productCategories.filter(cat => cat.parent_category == null && cat.id !== category$.id);
    this.dialogBox.open(EditProductCategoryDialogComponent, {
      width: "600px",
      disableClose: true,
      data: {
        edit: true,
        category: category$,
        availableCategories: availableCategories$
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchProductCategories();
      }
    })
  }

  onDeleteCategory(category: ProductCategory) {
    Swal.fire({
      title: `Delete Category - ${category.name}?`,
      icon: "question",
      html: `To confirm this action, please type <b><code>${category.name}</code></b>`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Delete!",
      showLoaderOnConfirm: true,
      confirmButtonColor: AppConfig.COLORS.DANGER,
      preConfirm: inputValue => {
        if (inputValue !== '' && inputValue === category.name) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct category name");
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show("deletingSpinner");
        this.productService.deleteProductCategory(category).subscribe(e => {
          this.spinner.hide("deletingSpinner");

          Toast.fire({
            icon: "success",
            text: "Product category deleted: " + category.name,
          });

          // setTimeout(() => {
          //   location.reload()
          // }, 500);

          this.fetchProductCategories();
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

        })
      }
    })
  }

  fetchProductCategories() {
    this.productService.getProductCategories().subscribe(res => {
      this.productCategories = (res as ResponseData).data
    })
  }

  async onViewProductCategory(category: ProductCategory) {
    await this.router.navigate([category.id], {
      relativeTo: this.route
    })
  }
}
