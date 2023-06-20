import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-donor-login',
  templateUrl: './donor-login.component.html',
  styleUrls: ['./donor-login.component.css']
})
export class DonorLoginComponent {
  loginForm: any;

  constructor(
    private authService: AuthService,
    private toast: HotToastService
  ) {

  }


  onSubmit(item: NgForm) {
    if(item.invalid) {
      this.toast.error('All Fields Required')
      return
    }
    this.authService.donorLogin(item.value);
  }
}
