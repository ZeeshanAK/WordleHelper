import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModules } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NOTYF, notyfFactory } from './notyf.token';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModules,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: NOTYF, useFactory: notyfFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
