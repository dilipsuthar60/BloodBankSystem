// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { DonorSignupComponent } from './donor-signup/donor-signup.component';
// import { AppComponent } from './app.component';
// import { DonorLoginComponent } from './donor-login/donor-login.component';
// import { AdminLoginComponent } from './admin-login/admin-login.component';
// import { CreateCampComponent } from './create-camp/create-camp.component';
// import { AdminHomeComponent } from './admin-home/admin-home.component';
// import { EditCampComponent } from './edit-camp/edit-camp.component';
// import { DonorHomeComponent } from './donor-home/donor-home.component';

// const routes: Routes = [
    // {path: '', component: AppComponent},
    // {path: 'donor-signup', component: DonorSignupComponent},
    // {path: 'donor-login', component: DonorLoginComponent},
    // {path: 'admin-login', component: AdminLoginComponent},
    // {path: 'create-camp', component: CreateCampComponent},
    // {path: 'admin-home', component: AdminHomeComponent},
    // {path: 'edit-camp/:id', component: EditCampComponent},
    // {path: 'donor-home', component: DonorHomeComponent}
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }



import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonorSignupComponent } from './donor-signup/donor-signup.component';
import { DonorLoginComponent } from './donor-login/donor-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { CreateCampComponent } from './create-camp/create-camp.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { EditCampComponent } from './edit-camp/edit-camp.component';
import { DonorHomeComponent } from './donor-home/donor-home.component';
import { DonorAuthGuard } from './donor-auth.guard';
import { AdminAuthGuard } from './admin-auth.guard';
import { ViewDonorsComponent } from './view-donors/view-donors.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'donor-login', pathMatch: 'full' },
  { path: 'donor-signup', component: DonorSignupComponent },
  { path: 'donor-login', component: DonorLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-signup', component: AdminSignupComponent },
  { path: 'create-camp', component: CreateCampComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AdminAuthGuard] },
  { path: 'edit-camp/:id', component: EditCampComponent, canActivate: [AdminAuthGuard] },
  { path: 'view-donors/:id', component: ViewDonorsComponent, canActivate: [AdminAuthGuard] },
  { path: 'donor-home', component: DonorHomeComponent, canActivate: [DonorAuthGuard], pathMatch: 'full' },
  { path: '**', redirectTo: 'donor-home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

