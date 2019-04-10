import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { FarmerService } from '../farmer.service';
import { Farmer } from '../farmer.model';
import { mimeType } from './mime-type.validator';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-create-farmer',
  templateUrl: './create-farmer.component.html',
  styleUrls: ['./create-farmer.component.css']
})
export class CreateFarmerComponent implements OnInit, OnDestroy {

  countryList = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  languageList = ["Afrikanns", "Albanian", "Arabic", "Armenian", "Basque", "Bengali", "Bulgarian", "Catalan", "Cambodian", "Chinese (Mandarin)", "Croation", "Czech", "Danish", "Dutch", "English", "Estonian", "Fiji", "Finnish", "French", "Georgian", "German", "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Korean", "Latin", "Latvian", "Lithuanian", "Macedonian", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", "Nepali", "Norwegian", "Persian", "Polish", "Portuguese", "Punjabi", "Quechua", "Romanian", "Russian", "Samoan", "Serbian", "Slovak", "Slovenian", "Spanish", "Swahili", "Swedish ", "Tamil", "Tatar", "Telugu", "Thai", "Tibetan", "Tonga", "Turkish", "Ukranian", "Urdu", "Uzbek", "Vietnamese", "Welsh", "Xhosa"];

  form:FormGroup;

  private mode = 'create';
  private farmerId: string;
  private userStatusSub: Subscription; // 1/4 spinner off - create userStatusSub of type Subscription

  farmer: Farmer;
  isLoading = false;
  imagePreview: string;

  constructor(public farmerService: FarmerService, public route: ActivatedRoute, private userService: UserService) { } // 2/4 spinner off - add userService
  
  ngOnInit() {
    
    this.userStatusSub = this.userService
    .getUserStatusListener()
    .subscribe(userStatus => {
      this.isLoading = false;
    }); // 3/4 spinner off - listen and set spinner off

    this.form = new FormGroup({
      farmerName: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      farmerPhone: new FormControl(null, { validators: [Validators.required, Validators.minLength(10)] }),
      farmerLanguage: new FormControl(null, { validators: [Validators.required] }),
      farmerCountry: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    });
    // Check if we have farmer id
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('farmerId')) {
        this.mode = 'edit';
        this.farmerId = paramMap.get('farmerId');
        // Loading Spinner
        this.isLoading = true;
        this.farmerService.getFarmer(this.farmerId)
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
          this.form.setValue({
            farmerName: this.farmer.farmerName,
            farmerPhone: this.farmer.farmerPhone,
            farmerLanguage: this.farmer.farmerLanguage,
            farmerCountry: this.farmer.farmerCountry,
            image: this.farmer.imagePath
          });
        });
      }
      else {
        this.mode = 'create';
        this.farmerId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveFarmer() {
    
    if (this.form.invalid) {
      console.log("FORM INVALID");
      return;
    }
    this.isLoading = true;
    if(this.mode==="create") {
      console.log("SAVING FARMER CREATE");
      this.farmerService.addFarmer(
        this.form.value.farmerName, 
        this.form.value.farmerPhone, 
        this.form.value.farmerLanguage, 
        this.form.value.farmerCountry,
        this.form.value.image,
        null
        );
    } else {
      console.log("SAVING FARMER UPDATE");
      this.farmerService.updateFarmer(
        this.farmerId,
        this.form.value.farmerName, 
        this.form.value.farmerPhone, 
        this.form.value.farmerLanguage, 
        this.form.value.farmerCountry,
        this.form.value.image,
        null
      );
    }
    
    this.form.reset();
  }

  ngOnDestroy() {
    this.userStatusSub.unsubscribe(); // 4/4 spinner off - Unsubscribe
  }
}
