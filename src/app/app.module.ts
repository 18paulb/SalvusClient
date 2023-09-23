import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarkSearchComponent } from './mark-search/mark-search.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HttpClientXsrfModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { ResultsTableComponent } from './results-table/results-table.component';
import { NgOptimizedImage } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    MarkSearchComponent,
    LoginRegisterComponent,
    HeaderComponent,
    ResultsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    RouterModule,
    NgOptimizedImage

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
