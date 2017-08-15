import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { CroppieModule } from 'angular-croppie-module';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

import { FileUploadModule } from "ng2-file-upload";

import { AppComponent }  from './app.component';

import { TopnavComponent } from './topnav.component';
import { PaginationComponent } from './pagination.component';
import { FooterComponent } from './footer.component';
import { DashboardmenuComponent } from './dashboard-menu.component';
import { DashboardmainComponent } from './dashboard-main.component';
import { DashboardavatarComponent } from './dashboard-avatar.component';
import { DashboardgalleryComponent } from './dashboard-gallery.component';
import { DashboardprojectsComponent } from './dashboard-projects.component';
import { ProjectnewComponent } from './projectnew.component';
import { ProjectsComponent } from './projects.component';
import { SignComponent } from './sign.component';

import { ShortenPipe } from './shorten.pipe';

import { ConfigService } from "./config.service";
import { ApiService } from "./api.service";
import { UserService } from "./user.service";
import { ProjectService } from "./project.service";
import { ValidatorsService } from './validators.service';
import { ErrorService } from "./error.service";

import { SigninformComponent } from "./signinform.component";
import { SignupformComponent } from "./signupform.component";
import { ActivationformComponent } from "./activationform.component";
import { ResetpasswordrequestformComponent } from "./resetpasswordrequestform.component";
import { ResetpasswordverificationformComponent } from "./resetpasswordverificationform.component";

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    CroppieModule,
    DatepickerModule.forRoot(),
    FileUploadModule
  ],
  declarations: [
    AppComponent,
    TopnavComponent,
    PaginationComponent,
    FooterComponent,
    DashboardmenuComponent,
    DashboardmainComponent,
    DashboardavatarComponent,
    DashboardgalleryComponent,
    DashboardprojectsComponent,
    ProjectnewComponent,
    ProjectsComponent,
    SignComponent,
    SigninformComponent,
    SignupformComponent,
    ActivationformComponent,
    ResetpasswordrequestformComponent,
    ResetpasswordverificationformComponent,
    ShortenPipe
  ],
  providers:    [ ConfigService, ApiService, UserService, ProjectService, ErrorService, ValidatorsService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
