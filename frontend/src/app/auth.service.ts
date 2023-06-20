import { Injectable } from '@angular/core';
import { BloodBankService } from './blood-bank.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(
    private bloodBankService: BloodBankService,
    private router: Router,
    private toast: HotToastService,
  ) {
    
  }

  adminLogin(item: any): void {
    this.bloodBankService.adminLogin(item).pipe(
      this.toast.observe({
        loading: 'Log In...',
        success: (s) => 'Admin LoggedIn Successfully',
        error: (e) => e.error.error.message
      })
    ).subscribe(
      (data: any) => {
        // console.log(data)
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        this.router.navigate(['admin-home'])
      }
    );
  }

  isAdminLoggedIn(): boolean {
    let isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');

    return isAdminLoggedIn ? JSON.parse(isAdminLoggedIn) : false;
  }

  donorLogin(item: any): void {
    this.bloodBankService.donorLogin(item).pipe(
      this.toast.observe({
        loading: 'Log In...',
        success: (s) => 'Donor LoggedIn Successfully',
        error: (e) => e.error.error.message
      })
    ).subscribe(
      (data: any) => {
        console.log(data)
        const donorId = data.id;
        console.log(donorId)
        // this.router.navigate(['donor-home'], { queryParams: { id: donorId } });
        this.router.navigate(['donor-home', { id: donorId }]);
        // this.router.navigate([`donor-home/${data.id}`])
        sessionStorage.setItem('isDonorLoggedIn', 'true');
      }
    );
  }

  isDonorLoggedIn(): boolean {
    let isDonorLoggedIn = sessionStorage.getItem('isDonorLoggedIn');

    return isDonorLoggedIn ? JSON.parse(isDonorLoggedIn) : false;
  }

}
