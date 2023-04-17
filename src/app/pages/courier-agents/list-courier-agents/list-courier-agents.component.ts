import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {CourierAgent} from '../../../models/delivery-agent.model';
import {PaginatorMeta, QueryParamsMeta, ResponseData} from '../../../models/paginator.model';
import {AppConfig} from '../../../config/app.config';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {CourierAgentService} from '../../../services/courier-agent.service';
import {EditCourierAgentDialogComponent} from '../edit-courier-agent-dialog/edit-courier-agent-dialog.component';
import Swal from 'sweetalert2';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Toast} from '../../../utils/toast';

@Component({
  selector: 'app-list-courier-agents',
  templateUrl: './list-courier-agents.component.html',
  styleUrls: ['./list-courier-agents.component.scss']
})
export class ListCourierAgentsComponent {
  appConfig = AppConfig;

  tableDataSource: MatTableDataSource<CourierAgent[]> | [] = [];
  tableColumns = ["position", "logo", "courier_agent_name", "courier_agent_website", "is_active", "created_at", "action"];
  tablePaginatorParams: PaginatorMeta;
  tablePageSizeOptions = AppConfig.PAGINATION.PAGE_SIZE_OPTIONS
  tableSearchTerm: string = '';
  tableSearchInputEl: FormControl = new FormControl();

  defaultCompanyLogo: string = "assets/images/icon-company-logo-default.png";

  @ViewChild(MatSort) tableSort: MatSort | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService,
              private dialogBox: MatDialog, private service: CourierAgentService) {

    this.tablePaginatorParams = this.route.snapshot.data['courierAgents'];
    this.tablePaginatorParams.current_page --;

    this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
    this.tableDataSource.sort = this.tableSort;

  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.tableSearchInputEl.valueChanges
      .pipe(debounceTime(AppConfig.DURATIONS.SEARCH_DEBOUNCE_TIME_MS))
      .pipe(distinctUntilChanged())
      .subscribe(changedValue => {
        this.onSearchTable(changedValue);
      });
  }

  onAddCourierAgent() {
    this.dialogBox.open(EditCourierAgentDialogComponent, {
      width: "350px",
      disableClose: !0,
      data: {
        edit: !1
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchCourierAgents(this.getQueryParams());
      }
    })
  }

  onEditCourierAgent(agent: CourierAgent) {
    this.dialogBox.open(EditCourierAgentDialogComponent, {
      width: "350px",
      disableClose: true,
      data: {
        edit: true,
        courierAgent: agent
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.fetchCourierAgents(this.getQueryParams());
      }
    })
  }

  onDeleteCourierAgent(agent: CourierAgent) {
    Swal.fire({
      icon: "question",
      title: `Confirm delete Courier Agent: ${agent.courier_agent_name}?`,
      html: `Enter <code>${agent.courier_agent_name}</code> to delete`,
      input: "text",
      inputPlaceholder: "Courier Agent Name",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete!",
      confirmButtonColor: AppConfig.COLORS.DANGER,
      inputAttributes: {
        autocapitalize: "off",
        required: "required"
      },
      preConfirm: inputValue => {
        if (inputValue !== "" && inputValue === agent.courier_agent_name) {
          return inputValue;
        } else {
          Swal.showValidationMessage("Please type correct agent name");
        }
      }
    }).then(result => {
      if(result.isConfirmed) {
        this.spinner.show("deletingSpinner");
        this.service.deleteCourierAgent(agent).subscribe(e => {
          this.spinner.hide("deletingSpinner");
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: `Agent: ${agent.courier_agent_name} deleted`,
            timer: AppConfig.DURATIONS.TOAST_DISPLAY_TIME_MS
          });
          this.fetchCourierAgents(this.getQueryParams());
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

  onSearchTable(searchTerm: string): void {
    searchTerm = searchTerm?.trim()?.toLowerCase() ?? null;
    console.log('searchTerm', searchTerm);
    if (this.tableSearchTerm === searchTerm) {
      return;
    }
    this.tableSearchTerm = searchTerm;

    const query = this.getQueryParams();

    this.fetchCourierAgents(query);
  }

  onTablePageChange($event: any) {
    const query = this.getQueryParams();

    // change pages;
    query.page = $event.pageIndex + 1;
    query.page_size = $event.pageSize;

    this.fetchCourierAgents(query);
  }

  getQueryParams() {
    const query: QueryParamsMeta = {};

    if (this.tableSearchTerm) {
      query.search = this.tableSearchTerm
    }

    // page
    query.page = 1;
    query.page_size = AppConfig.PAGINATION.DEFAULT_PAGE_SIZE;

    return query;
  }

  fetchCourierAgents(query: QueryParamsMeta) {
    this.service.getCourierAgents(query).subscribe(res => {
      this.tablePaginatorParams = (res as ResponseData).data;
      this.tablePaginatorParams.current_page --;

      this.tableDataSource = new MatTableDataSource(this.tablePaginatorParams?.results ?? []);
      this.tableDataSource.sort = this.tableSort;
    }, t => {
      Swal.fire({
        icon: "error",
        html: '<div class="text-danger">Error while fetching data</div>',
        position: "top-end",
        timer: AppConfig.DURATIONS.POPUP_DISPLAY_TIME_MS
      });
    })
  }
}
