import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent {
  addForm!: NgForm;

  submitted: boolean = false;

  constructor(
    private toast: HotToastService,
    private router: Router,
    private bloodBankService: BloodBankService
  ) {}

  onSubmit(item: NgForm) {
    this.submitted = true;
    if(item.invalid){
      this.toast.error('Cannot register with empty fields🙄')
      return;
    }
    // console.log(item.value);

    const itemm = {...item.value};
    delete itemm.confirmPassword;
    // console.log(itemm)

    this.bloodBankService.createAdmin(itemm).pipe(
      this.toast.observe({
        loading: 'Saving...',
        success: (s) => 'Registered Successfully',
        error: (e) => 'Cannot register with empty fields🙄'
      })
    ).subscribe(
      (data: any) => {
        console.log(data)
        this.router.navigate(['admin-login']);
      }
    );
  }

}
