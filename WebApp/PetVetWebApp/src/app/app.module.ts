import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { MatExpansionModule } from '@angular/material/expansion'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, LineSeriesService, CategoryService, LegendService, DataLabelService, TooltipService } from '@syncfusion/ej2-angular-charts'



// Reactive Form
import { ReactiveFormsModule } from "@angular/forms";

// App routing modules
import { AppRoutingModule } from './shared/routing/app-routing.module';

// App components
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { PetsComponent } from './pets/pets.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { DataService } from './shared/services/data.service';

@NgModule({
  exports: [],
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    PetsComponent,
    DateAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2FlatpickrModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    ChartModule

  ],
  providers: [AuthService, LineSeriesService, DataService, CategoryService, LegendService, DataLabelService, TooltipService],
  bootstrap: [AppComponent]
})

export class AppModule { }