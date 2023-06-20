import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DonorSignupComponent } from './donor-signup/donor-signup.component';
import { DonorLoginComponent } from './donor-login/donor-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { CreateCampComponent } from './create-camp/create-camp.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { DonorHomeComponent } from './donor-home/donor-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { EditCampComponent } from './edit-camp/edit-camp.component';
import { ViewDonorsComponent } from './view-donors/view-donors.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    DonorSignupComponent,
    DonorLoginComponent,
    AdminLoginComponent,
    CreateCampComponent,
    DonorHomeComponent,
    AdminHomeComponent,
    EditCampComponent,
    ViewDonorsComponent,
    AdminSignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HotToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
