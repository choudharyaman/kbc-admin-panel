import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCourierAgentsComponent} from './list-courier-agents/list-courier-agents.component';
import {CourierAgentListResolver} from './resolvers/courier-agent.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListCourierAgentsComponent,
    resolve: {
      courierAgents: CourierAgentListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierAgentsRoutingModule { }
