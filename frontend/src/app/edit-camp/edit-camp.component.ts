import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-edit-camp',
  templateUrl: './edit-camp.component.html',
  styleUrls: ['./edit-camp.component.css']
})
export class EditCampComponent implements OnInit {
  // editForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;
  submitted: boolean = false;
  camp: any;
  campId: any;

  constructor(
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private bloodBankService: BloodBankService
  ) {}

  ngOnInit(): void {
    this.campId = this.route.snapshot.paramMap.get('id');
    if (this.campId) {
      this.getSingleCamp(this.campId);
    }
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    console.log(form.invalid)
    if (form.invalid) {
      this.toast.error('Cannot create camp with empty fields');
      return;
    }

    console.log(form.value);

    this.bloodBankService.updateCamp(form.value, this.campId).subscribe(
      (data: any) => {
        this.toast.success('Camp updated successfully');
        this.router.navigate(['/admin-home']);
      },
      (error: any) => {
        this.toast.error('Error updating camp');
      }
    );
  }

  getSingleCamp(campId: string) {
    this.bloodBankService.getSingleCamp(campId).subscribe(
      (data: any) => {
        console.log(data)
        this.camp = data;
        this.patchFormValues();
      },
      (error: any) => {
        this.toast.error('Error retrieving camp details');
      }
    );
  }

  patchFormValues() {
    if (this.camp) {
      this.editForm.controls['name'].setValue(this.camp.name);
      this.editForm.controls['createdBy'].setValue(this.camp.createdBy);
      this.editForm.controls['location'].setValue(this.camp.location);
      this.editForm.controls['date'].setValue(this.camp.date);
      this.editForm.controls['startTime'].setValue(this.camp.startTime);
      this.editForm.controls['endTime'].setValue(this.camp.endTime);
    }
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