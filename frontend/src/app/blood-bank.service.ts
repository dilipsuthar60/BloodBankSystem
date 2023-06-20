import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BloodBankService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://[::1]:3000/'

  createDonor(donor: any) {
    return this.http.post(this.baseUrl + 'donors', donor);
  }

  createCamp(camp: any) {
    return this.http.post(this.baseUrl + 'camps', camp)
  }

  getCamps() {
    return this.http.get(this.baseUrl + 'camps')
  }

  updateCamp(camp: any, campId: any) {
    return this.http.put(this.baseUrl + `camps/${campId}`, camp)
  }

  getSingleCamp(campId: any) {
    return this.http.get(this.baseUrl + `camps/${campId}`)
  }

  adminLogin(item: any) {
    return this.http.post(this.baseUrl + 'admin/login', item)
  }

  donorLogin(item: any) {
    return this.http.post(this.baseUrl + 'donors/login', item)
  }

  isRegister(item: any) {
    return this.http.post(this.baseUrl + 'donors/isRegister', item);
  }

  registerDonor(item: any) {
    // console.log(item)
    return this.http.post(this.baseUrl + 'camps/register', item)
  }

  unregisterDonor(item: any) {
    return this.http.post(this.baseUrl + 'camps/unregister', item)
  }

  campsRegistered(id: number) {
    return this.http.get(this.baseUrl + `donors/${id}/camps`)
  }

  donorsRegistered(id: number) {
    return this.http.get(this.baseUrl + `camps/${id}/donors`)
  }

  sendMail(id: number) {
    return this.http.get(this.baseUrl + `camps/${id}/sendEmailsToDonors`)
  }

  createAdmin(item: any){
    return this.http.post(this.baseUrl + `admins`, item);
  }
}
