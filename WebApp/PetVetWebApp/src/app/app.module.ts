import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { routes } from './app.routes';


// Must export the config
const firebaseConfig = {
  apiKey: "AIzaSyD-EWtCcadCjtv9zX9x-thILOlBh-MXPd4",
  authDomain: "petvet-268116.firebaseapp.com",
  databaseURL: "https://petvet-268116.firebaseio.com",
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
    EmailComponent,
    SignupComponent,
    MembersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routes
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
