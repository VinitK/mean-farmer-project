import { NgModule } from "@angular/core";
import { CreateFarmerComponent } from './create-farmer/create-farmer.component';
import { FarmersListComponent } from './farmers-list/farmers-list.component';
import { FarmerComponent } from './farmer/farmer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        FarmersListComponent,
        CreateFarmerComponent,
        FarmerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class FarmerModule { }