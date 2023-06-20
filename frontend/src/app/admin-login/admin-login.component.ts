import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: any

  constructor(
    private authService: AuthService,
    private toast: HotToastService
  ) {

  }

  onSubmit(item : any) {
    if(item.invalid) {
      this.toast.error('All Fields Required')
      return
    }
    this.authService.adminLogin(item.value);
  }

}
