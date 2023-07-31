import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarkSearchComponent} from "./mark-search/mark-search.component";
import {LoginRegisterComponent} from "./login-register/login-register.component";

const routes: Routes = [
  { path: 'mark-search', component: MarkSearchComponent },
  { path: '', component: LoginRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
