import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './admin/login/login.component';
import { RegisterComponent } from './admin/register/register.component';
import { ForgotPasswordComponent } from './admin/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './admin/verify-email/verify-email.component';

const firebaseConfig = {
  apiKey: "AIzaSyD-EWtCcadCjtv9zX9x-thILOlBh-MXPd4",
  authDomain: "petvet-268116.firebaseapp.com",
  databaseURL: "https://petvet-268116.firebaseio.com/",
  projectId: "petvet-268116",
  storageBucket: "petvet-268116.appspot.com",
  messagingSenderId: "1080934441565",
  appId: "1:1080934441565:web:51fbda4495c98722bd23b4",
  measurementId: "G-XZ28FNEXX1"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
