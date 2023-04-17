import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourierAgentsRoutingModule } from './courier-agents-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { ListCourierAgentsComponent } from './list-courier-agents/list-courier-agents.component';
import { EditCourierAgentDialogComponent } from './edit-courier-agent-dialog/edit-courier-agent-dialog.component';


@NgModule({
  declarations: [
    ListCourierAgentsComponent,
    EditCourierAgentDialogComponent
  ],
  imports: [
    CommonModule,
    CourierAgentsRoutingModule,
    SharedModule
  ]
})
export class CourierAgentsModule { }
