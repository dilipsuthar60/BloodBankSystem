import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit{
  camps: any;

  constructor(
    private toast: HotToastService,
    private router: Router,
    private bloodBankService: BloodBankService
  ) {}

  ngOnInit(): void {
    this.postCamps();
  }

  postCamps(): void {
    this.bloodBankService.getCamps().subscribe(
      (data: any) => {
        this.camps = data
        console.log(data)
      }
    )
  }

  convertTo12HourFormat(timeString: any): string {
    const [hours, minutes] = timeString.split(":");
    let formattedTime: number;
    let period: string;
  
    if (hours < 12) {
      formattedTime = hours;
      period = "AM";
    } else {
      formattedTime = hours % 12;
      period = "PM";
    }
  
    return `${formattedTime}:${minutes} ${period}`;
  }

  logout(): void {
    sessionStorage.removeItem('isAdminLoggedIn')
    this.toast.warning('You Have Been Logged Out⚠️')
    this.router.navigate(['admin-login']);
  }

}
