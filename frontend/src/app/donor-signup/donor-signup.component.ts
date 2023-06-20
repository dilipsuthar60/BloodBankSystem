// import { Component } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HotToastService } from '@ngneat/hot-toast';
// import { BloodBankService } from '../blood-bank.service';

// @Component({
//   selector: 'app-donor-signup',
//   templateUrl: './donor-signup.component.html',
//   styleUrls: ['./donor-signup.component.css']
// })
// export class DonorSignupComponent {
//   bloodGroups: string[] = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
//   conditions: string[] = ['None', 'Diabetes', 'Blood Pressure', 'Heart Problem', 'Any Other'];

//   addForm!: NgForm;

//   isBelowMinimumAge = false;

//   submitted: boolean = false;

//   constructor(
//     private toast: HotToastService,
//     private router: Router,
//     private bloodBankService: BloodBankService
//   ) {}

//   onSubmit(item: NgForm) {
//     this.submitted = true;
//     if(item.invalid){
//       this.toast.error('Cannot register with empty fields🙄')
//       return;
//     }
//     console.log(item.value);

//     // this.bloodBankService.createDonor(item.value).subscribe(
//     //   (data: any) => {
//     //     console.log(data)
//     //     this.toast
//     //   }, error => {
//     //     console.log(error)
//     //     this.toast.error('Select Gender')
//     //   }
//     // )

//     const itemm = {...item.value};
//     delete itemm.confirmPassword;
//     console.log(itemm)

//     this.bloodBankService.createDonor(itemm).pipe(
//       this.toast.observe({
//         loading: 'Saving...',
//         success: (s) => 'Registered Successfully',
//         error: (e) => 'Cannot register with empty fields🙄'
//       })
//     ).subscribe(
//       (data: any) => {
//         console.log(data)
//         this.router.navigate(['admin-login']);
//       }
//     );
//   }


//   checkAge(dob: Date): void {
//     const selectedDate = new Date(dob);
//     const minimumDate = new Date();
//     minimumDate.setFullYear(minimumDate.getFullYear() - 18);

//     if (selectedDate > minimumDate) {
//       this.isBelowMinimumAge = true;
//     } else {
//       this.isBelowMinimumAge = false;
//     }
//   }
// }


import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';

@Component({
  selector: 'app-donor-signup',
  templateUrl: './donor-signup.component.html',
  styleUrls: ['./donor-signup.component.css']
})
export class DonorSignupComponent {
  bloodGroups: string[] = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
  conditions: string[] = ['None', 'Diabetes', 'Blood Pressure', 'Heart Problem', 'Any Other'];

  addForm!: NgForm;

  isBelowMinimumAge = false;
  selectedImage: string | undefined;

  submitted: boolean = false;

  constructor(
    private toast: HotToastService,
    private router: Router,
    private bloodBankService: BloodBankService
  ) {}

  onSubmit(item: NgForm) {
    this.submitted = true;
    if (item.invalid) {
      this.toast.error('Cannot register with empty fields🙄');
      return;
    }
    console.log(item.value);

    // ... Rest of your code

    const itemm = { ...item.value };
    delete itemm.confirmPassword;
    console.log(itemm);

    // Assign the selected image file to the itemm object
    // itemm.image = this.selectedImage;

    this.bloodBankService.createDonor(itemm).pipe(
      this.toast.observe({
        loading: 'Saving...',
        success: (s) => 'Registered Successfully',
        error: (e) => 'Cannot register with empty fields🙄'
      })
    ).subscribe(
      (data: any) => {
        console.log(data);
        this.router.navigate(['admin-login']);
      }
    );
  }

  checkAge(dob: Date): void {
    const selectedDate = new Date(dob);
    const minimumDate = new Date();
    minimumDate.setFullYear(minimumDate.getFullYear() - 18);

    if (selectedDate > minimumDate) {
      this.isBelowMinimumAge = true;
    } else {
      this.isBelowMinimumAge = false;
    }
  }

  onImageChange(files: any): void {
    if (files && files.length > 0) {
      this.selectedImage = files.item(0);
    }
  }
}
