import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Farmer } from '../farmer.model';
import { FarmerService } from '../farmer.service';
import { UserService } from 'src/app/auth/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit, OnDestroy {
  farmer: Farmer;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private farmerId: string;
  private farmerSub: Subscription;
  private userStatusSub: Subscription;

  constructor(public farmerService: FarmerService, public route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.farmerId = paramMap.get('farmerId');
      // Loading Spinner
      this.isLoading = true;
      this.farmerSub = this.farmerService.getFarmer(this.farmerId)
      .subscribe(farmerData => {
        // Loading Spinner End
        this.isLoading = false;
        this.farmer = {
          farmerId: farmerData._id,
          farmerName: farmerData.farmerName,
          farmerPhone: farmerData.farmerPhone,
          farmerLanguage: farmerData.farmerLanguage,
          farmerCountry: farmerData.farmerCountry,
          imagePath: farmerData.imagePath,
          creator: farmerData.creator
        };
      });
    });
    this.userId = this.userService.getUserId(); // get userid on page load
    this.userIsAuthenticated = this.userService.getUserStatus();
    this.userStatusSub = this.userService
    .getUserStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.userService.getUserId(); // get user id if changed
    });
  }

  ngOnDestroy() {
    this.farmerSub.unsubscribe();
    this.userStatusSub.unsubscribe();
  }

  onDelete(farmerId: string) {
    this.isLoading = true;
    this.farmerService.deleteFarmer(farmerId)
    .subscribe(() => {
      this.farmerService.getFarmer(farmerId);
    }, () => {
      this.isLoading = false;
    });
  }
}
