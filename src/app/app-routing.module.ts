import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarkSearchComponent} from "./mark-search/mark-search.component";
import {LoginRegisterComponent} from "./login-register/login-register.component";
import {SearchHistoryComponent} from "./search-history/search-history.component";
import {ResultsTableComponent} from "./results-table/results-table.component";

const routes: Routes = [
  { path: 'mark-search', component: MarkSearchComponent },
  { path: 'results-table', component: ResultsTableComponent },
  { path: '', component: LoginRegisterComponent },
  { path: 'search-history', component: SearchHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
