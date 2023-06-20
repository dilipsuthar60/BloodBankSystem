import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-view-donors',
  templateUrl: './view-donors.component.html',
  styleUrls: ['./view-donors.component.css']
})
export class ViewDonorsComponent {
  campName: any;
  registeredDonors: any
  
  constructor(
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private bloodBankService: BloodBankService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.bloodBankService.getSingleCamp(id).subscribe(
      (data: any) => {
        console.log(data)
        this.campName = data.name
      }
    )
    // console.log(Number(this.route.snapshot.paramMap.get('id')))
    this.bloodBankService.donorsRegistered(id).subscribe(
      (data: any) => { 
        // console.log(data)
        this.registeredDonors = data;
      }
    )
  }

}
