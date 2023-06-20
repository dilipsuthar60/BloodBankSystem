// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HotToastService } from '@ngneat/hot-toast';
// import { BloodBankService } from '../blood-bank.service';
// import { Observable, map } from 'rxjs';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-donor-home',
//   templateUrl: './donor-home.component.html',
//   styleUrls: ['./donor-home.component.css']
// })
// export class DonorHomeComponent {
//   registeredCamps: any = {};
//   camps: any;

//   constructor(
//     private toast: HotToastService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private bloodBankService: BloodBankService
//   ) {}

//   ngOnInit(): void {
//     this.postCamps();
//     // this.getRegistrationStatus();
//   }

//   postCamps(): void {
//     this.bloodBankService.getCamps().subscribe(
//       (data: any) => {
//         this.camps = data;
//         // console.log(data);
//       }
//     );
//   }

//   convertTo12HourFormat(timeString: any): string {
//     const [hours, minutes] = timeString.split(":");
//     let formattedTime: number;
//     let period: string;

//     if (hours < 12) {
//       formattedTime = hours;
//       period = "AM";
//     } else {
//       formattedTime = hours % 12;
//       period = "PM";
//     }

//     return `${formattedTime}:${minutes} ${period}`;
//   }

//   isRegistered(camp: any): Observable<boolean> {
//     const campId = camp.id;
//     const donorId = Number(this.route.snapshot.paramMap.get('id'));
//     console.log(donorId)
//     const item = {
//       campId,
//       donorId
//     };

//     return this.bloodBankService.isRegister(item).pipe(
//       map((data: any) => data.isRegistered)
//     );
//   }

//   getRegistrationStatus(): void {
//     const donorId = Number(this.route.snapshot.paramMap.get('id'));
//     this.bloodBankService.campsRegistered(donorId).subscribe(
//       (data: any) => {
//         // console.log(data);
//         this.registeredCamps = data.reduce((result: any, camp: any) => {
//           result[camp.id] = true;
//           return result;
//         }, {});
//       }
//     );
//   }

//   onButtonClick(camp: any) {
//     const isRegistered = this.registeredCamps[camp.id] || false;

//     if (isRegistered) {
//       this.unregisterCamp(camp);
//     } else {
//       this.registerCamp(camp);
//     }
//   }

//   registerCamp(camp: any) {
//     const campId = camp.id;
//     const donorId = Number(this.route.snapshot.paramMap.get('id'));
//     const item = {
//       campId,
//       donorId
//     };

//     this.bloodBankService.registerDonor(item).subscribe(
//       (data: any) => {
//         this.toast.success('Registered successfully');
//         this.registeredCamps[camp.id] = true;
//       },
//       (error: any) => {
//         this.toast.error(error.error.error.message);
//       }
//     );
//   }

//   async unregisterCamp(camp: any) {
//     const shouldDelete = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You want to unregister from camp',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes'
//     });
//     if(!shouldDelete.isConfirmed) return;

//     const campId = camp.id;
//     const donorId = Number(this.route.snapshot.paramMap.get('id'));
//     const item = {
//       campId,
//       donorId
//     };

//     this.bloodBankService.unregisterDonor(item).subscribe(
//       (data: any) => {
//         this.toast.success('Unregistered successfully');
//         this.registeredCamps[camp.id] = false;
//       },
//       (error: any) => {
//         this.toast.error(error.error.error.message);
//       }
//     );
//   }
// }


import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BloodBankService } from '../blood-bank.service';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donor-home',
  templateUrl: './donor-home.component.html',
  styleUrls: ['./donor-home.component.css']
})
export class DonorHomeComponent {
  registeredCamps: any = {};
  camps: any;
  donorID: any
  filteredCamps: any;
  searchQuery: string = '';

  constructor(
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private bloodBankService: BloodBankService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(Number(this.route.snapshot.paramMap.get('id')))
    const storedDonorID = sessionStorage.getItem('donorID');
    if (storedDonorID && storedDonorID !== '0') {
      this.donorID = Number(storedDonorID);
    } else {
      console.log(Number(this.route.snapshot.paramMap.get('id')))
      const donorID = Number(this.route.snapshot.paramMap.get('id'));
      sessionStorage.setItem('donorID', donorID.toString());
      console.log(donorID)
      this.donorID = donorID;
    }
    console.log(this.donorID)
    
    this.getRegistrationStatus(this.donorID);
    console.log(this.registeredCamps)
    window.history.pushState({}, document.title, "/" + "donor-home");
    this.postCamps();
  }

  postCamps(): void {
    this.bloodBankService.getCamps().subscribe(
      (data: any) => {
        this.camps = data;
        this.filteredCamps = data;
        this.changeDetectorRef.detectChanges();
        // console.log(data);
      }
    );
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

  isRegistered(camp: any, donorId: number): Observable<boolean> {
    const campId = camp.id;
    const item = {
      campId,
      donorId
    };

    return this.bloodBankService.isRegister(item).pipe(
      map((data: any) => data.isRegistered)
    );
  }

  getRegistrationStatus(donorId: number): void {
    this.bloodBankService.campsRegistered(donorId).subscribe(
      (data: any) => {
        // console.log(data);
        this.registeredCamps = data.reduce((result: any, camp: any) => {
          result[camp.id] = true;
          return result;
        }, {});
      }
    );
  }

  onButtonClick(camp: any) {
    // const donorId = Number(this.route.snapshot.queryParams['id']);
    const isRegistered = this.registeredCamps[camp.id] || false;

    if (isRegistered) {
      this.unregisterCamp(camp);
    } else {
      this.registerCamp(camp);
    }
  }

  registerCamp(camp: any) {
    const campId = camp.id;
    const donorId = this.donorID;
    const item = {
      campId,
      donorId
    };

    console.log(item)

    this.bloodBankService.registerDonor(item).subscribe(
      (data: any) => {
        this.toast.success('Registered successfully');
        this.registeredCamps[camp.id] = true;
      },
      (error: any) => {
        this.toast.error(error.error.error.message);
      }
    );
  }

  async unregisterCamp(camp: any) {
    const shouldDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unregister from camp',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    });
    if(!shouldDelete.isConfirmed) return;

    const campId = camp.id;
    const donorId = this.donorID;
    const item = {
      campId,
      donorId
    };

    this.bloodBankService.unregisterDonor(item).subscribe(
      (data: any) => {
        this.toast.success('Unregistered successfully');
        this.registeredCamps[camp.id] = false;
      },
      (error: any) => {
        this.toast.error(error.error.error.message);
      }
    );
  }

  logout(): void {
    sessionStorage.removeItem('donorID')
    sessionStorage.removeItem('isDonorLoggedIn')
    this.toast.warning('You Have Been Logged Out ⚠️')
    this.router.navigate(['donor-login']);
  }

  filterCamps(): void {
    console.log(this.searchQuery)
    console.log(this.filteredCamps)
    this.filteredCamps = this.camps.filter((camp: any) =>
      camp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      camp.location.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(this.filteredCamps)
  }
  
}

