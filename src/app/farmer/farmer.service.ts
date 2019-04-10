import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Farmer } from './farmer.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl+'/farmers/';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {

  private farmers: Farmer[] = [];
  private farmerUpdated = new Subject<{ farmers: Farmer[], farmerCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getFarmers(farmersPerPage: number, currentPage: number) {

    const queryParams = `?pagesize=${farmersPerPage}&page=${currentPage}`;

    this.http.get<{ message:string, farmers: any, maxFarmers: number }>(BACKEND_URL+queryParams)
    .pipe(
      map((farmerData) => {
      return { farmers: farmerData.farmers.map(farmer => {
        return {
          id: farmer._id,
          farmerName: farmer.farmerName,
          farmerPhone: farmer.farmerPhone,
          farmerLanguage: farmer.farmerLanguage,
          farmerCountry: farmer.farmerCountry,
          imagePath: farmer.imagePath,
          creator: farmer.creator
        }
      }), maxFarmers: farmerData.maxFarmers };
    }))
    .subscribe(transformedFarmerData => {
      // Logic
      this.farmers = transformedFarmerData.farmers;
      // Logic End
      this.farmerUpdated.next({ farmers: [...this.farmers], farmerCount: transformedFarmerData.maxFarmers });
    });
  }

  getFarmer(id: string) {
    return this.http.get<{ 
      _id: string, 
      farmerName: string, 
      farmerPhone: string, 
      farmerLanguage: string, 
      farmerCountry: string, 
      imagePath: string, 
      creator: string 
    }>(BACKEND_URL+id);
  }

  getFarmerUpdateListner() {
    return this.farmerUpdated.asObservable();
  }

  addFarmer(farmerName: string, farmerPhone: string, farmerLanguage: string, farmerCountry: string, image: File, creator: string) {
    console.log("ADDING FARMER 1");
    const farmerData = new FormData();
    farmerData.append("farmerName", farmerName);
    farmerData.append("farmerPhone", farmerPhone);
    farmerData.append("farmerLanguage", farmerLanguage);
    farmerData.append("farmerCountry", farmerCountry);
    farmerData.append("image", image, farmerName);
    farmerData.append("creator", null);
    this.http
    .post<{ message:string, farmer: Farmer }>(BACKEND_URL, farmerData)
    .subscribe((responseData) => {
      console.log("ADDING FARMER 2");
      this.router.navigate(["/farmers/"]);
    });
  }

  updateFarmer(
    farmerId: string, 
    farmerName: string, 
    farmerPhone: string, 
    farmerLanguage: string, 
    farmerCountry: string,
    image: File | string,
    creator: null
    ) {
      let farmerData: Farmer | FormData;
      if (typeof(image) === "object") {
        farmerData = new FormData();
        farmerData.append("farmerId", farmerId);
        farmerData.append("farmerName", farmerName);
        farmerData.append("farmerPhone", farmerPhone);
        farmerData.append("farmerLanguage", farmerLanguage);
        farmerData.append("farmerCountry", farmerCountry);
        farmerData.append("image", image, farmerName);
        farmerData.append("creator", null);
      } else {
        farmerData = {
          farmerId: farmerId,
          farmerName: farmerName,
          farmerPhone: farmerPhone,
          farmerLanguage: farmerLanguage,
          farmerCountry: farmerCountry,
          imagePath: image,
          creator: null
        };
      }
      this.http.put<{ message:string }>(BACKEND_URL+farmerId, farmerData)
      .subscribe(response => {
        this.router.navigate(["/farmers/"]);
      });
    }

  deleteFarmer(farmerId: string) {
    return this.http.delete<{message:string}>(BACKEND_URL+farmerId);
  }
}
