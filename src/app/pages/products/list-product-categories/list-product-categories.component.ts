import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../services/product.service';
import {ProductCategory} from '../../../models/product.model';
import {ResponseData} from '../../../models/paginator.model';
import {NgxSpinnerService} from 'ngx-spinner';
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
