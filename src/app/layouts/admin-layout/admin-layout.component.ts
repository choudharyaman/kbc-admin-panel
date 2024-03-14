import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer, MatSidenav} from "@angular/material/sidenav";
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {Profile} from "../../models/profile.model";
import {AuthService} from "../../services/auth.service";
import Swal from "sweetalert2";
import {AppConfig} from "../../config/app.config";
import {AppPages} from '../../config/app.pages';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild('sideNavDrawer') sideNavDrawer: MatDrawer | undefined;

  items: MenuItem[] = [];

  profile: Profile;
  currentUrl: string = '';
  constructor(private router: Router, private authService: AuthService) {
    this.profile = AuthService.getUser();
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon:'fa-solid fa-gauge',
        routerLink: AppPages.dashboard
      },
      {
        label: 'Orders',
        icon:'fa-solid fa-cart-shopping',
        expanded: this.currentUrl.startsWith('/orders'),
        items: [
          {
            label: 'New Orders',
            icon:'fa-solid fa-cart-plus',
            routerLink: AppPages.newOrders
          },
          {
            label: 'Confirmed Orders',
            icon:'fa-solid fa-cart-arrow-down',
            routerLink: AppPages.confirmedOrders
          },
          {
            label: 'In-Transit Orders',
            icon:'fa-solid fa-truck',
            routerLink: AppPages.inTransitOrders
          },
          {
            label: 'All Orders',
            icon:'fa-solid fa-cart-shopping',
            routerLink: AppPages.allOrders
          }
        ]
      },
      {
        label: 'Products',
        icon:'fa-solid fa-prescription-bottle-medical',
        expanded: this.currentUrl.startsWith('/products'),
        items: [
          {
            label: 'All Products',
            icon:'fa-solid fa-prescription-bottle-medical',
            routerLink: AppPages.allProducts,
          },
          {
            label: 'All Categories',
            icon:'fa-solid fa-cubes',
            routerLink: AppPages.productCategories,
          },
        ]
      },
      {
        label: 'Customers',
        icon:'fa-solid fa-users',
        routerLink: AppPages.customers
      },
      {
        label: 'Delivery Agents',
        icon:'fa-solid fa-motorcycle',
        expanded: this.currentUrl.startsWith('/delivery-persons') || this.currentUrl.startsWith('/courier-agents'),
        items: [
          {
            label: 'Delivery Persons',
            icon:'fa-solid fa-motorcycle',
            routerLink: AppPages.deliveryPersons,
          },
          {
            label: 'Courier Agents',
            icon:'fa-solid fa-truck',
            routerLink: AppPages.courierAgents,
          },
        ]
      },
      {
        label: 'Discounts & Taxes',
        icon:'fa-solid fa-percent',
        expanded: this.currentUrl.startsWith('/discounts') || this.currentUrl.startsWith('/taxes'),
        items: [
          {
            label: 'Discounts',
            icon:'fa-solid fa-tag',
            routerLink: AppPages.discounts,
          },
          {
            label: 'Taxes',
            icon:'fa-solid fa-coins',
            routerLink: AppPages.taxes,
          },
        ]
      },
      {
        label: 'Mobile App',
        icon:'fa-solid fa-mobile-screen',
        items: [
          {
            label: `Homepage Banners`,
            icon:'fa-regular fa-images',
            routerLink: AppPages.appMobileCustomerBanner
          },
          {
            label: `Alert Message`,
            icon:'fa-solid fa-circle-exclamation',
            routerLink: AppPages.appMobileCustomerAlert
          },
          {
            label: `App Settings`,
            icon:'fa fa-cogs',
            routerLink: AppPages.appMobileCustomerGlobalSettings
          }
        ]
      },
      {
        label: 'Global Settings',
        icon:'fa-solid fa-sliders',
        routerLink: AppPages.globalSettings
      },
      {
        label: 'Staff Members',
        icon:'fa-solid fa-clipboard-user',
        routerLink: AppPages.staff
      },
      {
        label: 'My Profile',
        icon:'fa-solid fa-user',
        routerLink: AppPages.profile
      }
    ]
  }

  onLogout(): void {
    Swal.fire({
      icon: 'question',
      title: 'Confirm Logout?',
      confirmButtonText: 'Logout',
      confirmButtonColor: AppConfig.COLORS.PRIMARY,
      showCancelButton: true,
      cancelButtonText: 'No',
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        await this.router.navigate([AppPages.login]);
      }
    });
  }

  async onViewProfile() {
    await this.router.navigate([AppPages.profile]);
  }
}
