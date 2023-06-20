import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-create-camp',
  templateUrl: './create-camp.component.html',
  styleUrls: ['./create-camp.component.css']
})
export class CreateCampComponent {
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
      this.toast.error('Cannot create camp with empty fields🙄')
      return;
    }
    console.log(item.value);

    this.bloodBankService.createCamp(item.value).pipe(
      this.toast.observe({
        loading: 'Saving...',
        success: (s) => 'Camp Created Successfully',
        error: (e) => 'Cannot create camp with empty fields🙄'
      })
    ).subscribe(
      (data: any) => {
        console.log(data)
        this.bloodBankService.sendMail(data.id).pipe(
          this.toast.observe({
            loading: 'Sending Mail...',
            success: (s) => 'Mail Sent Successfully',
            error: (e) => 'Cannot Send Mail 🙄'
          })
        ).subscribe(
          (data: any) => {
            console.log(data);
            console.log("hello")
            this.router.navigate(['admin-home']);
          }
        );
      })
  }
  
  
  
  
  
  getMinDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }
}
