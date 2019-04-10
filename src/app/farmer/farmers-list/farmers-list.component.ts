import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Farmer } from '../farmer.model';
import { FarmerService } from '../farmer.service';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-farmers-list',
  templateUrl: './farmers-list.component.html',
  styleUrls: ['./farmers-list.component.css']
})
export class FarmersListComponent implements OnInit, OnDestroy {
  farmers: Farmer[] = [];
  isLoading = false;
  totalFarmers = 0;
  farmersPerPage = 3;
  currentPage = 1;
  userIsAuthenticated = false;
  userId: string;
  private farmerSub: Subscription;
  private userStatusSub: Subscription;

  constructor(public farmerService: FarmerService, private userService: UserService) { }

  ngOnInit() {
    this.isLoading = true;
    this.farmerService.getFarmers(this.farmersPerPage, this.currentPage);
    this.userId = this.userService.getUserId(); // get userid on page load
    this.farmerSub = this.farmerService
    .getFarmerUpdateListner()
    .subscribe((farmerData: {farmers: Farmer[], farmerCount: number}) => {
      this.isLoading = false;
      this.totalFarmers = farmerData.farmerCount;
      this.farmers = farmerData.farmers;
    });
    this.userIsAuthenticated = this.userService.getUserStatus();
    this.userStatusSub = this.userService
    .getUserStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.userService.getUserId(); // get user id if changed
    });
  }

  onChangedPage(btnText: string) {
    this.isLoading = true;
    if (btnText === "next"){
      this.currentPage++;
    } else {
      this.currentPage--;
    }
    this.farmerService.getFarmers(this.farmersPerPage, this.currentPage)
  }

  ngOnDestroy() {
    this.farmerSub.unsubscribe();
    this.userStatusSub.unsubscribe();
  }

  onDelete(farmerId: string) {
    this.isLoading = true;
    this.farmerService.deleteFarmer(farmerId)
    .subscribe(() => {
      this.farmerService.getFarmers(this.farmersPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
}
