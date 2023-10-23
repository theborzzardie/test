import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { TOKENS } from "../app.constants";
import { interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {


  totalDone = 0;
  downloadJsonHref: any;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,

  ) { }

  tokens = [
    { "FULL_NAME": "LIMITED SAFARICOM KENYA", "REFERENCE": 61685489, "MBAIMETERS": "0122367165" },
    { "FULL_NAME": "LIMITED SAFARICOM KENYA", "REFERENCE": 83895268, "MBAIMETERS": "062224729" },
    { "FULL_NAME": "LIMITED SAFARICOM KENYA", "REFERENCE": 109601961, "MBAIMETERS": 37177040518 },
    { "FULL_NAME": "LIMITED SARARICOM", "REFERENCE": 58475575, "MBAIMETERS": "050006178" },
  ];

  ngOnInit(): void {
    this.doLoop();
  }

  doLoop(): void {
    this.totalDone = 0;

    this.tokens.forEach((data: any, index: number) => {
      setTimeout(() => {
        // this.subscribeToSaveBulkResponse(this.serviceRequestService.initiateServiceRequest(serviceRequest), organisation.shortCode);
        this.getTokenData(data);
        this.totalDone += 1;
      }, 2000 * (index + 1));
    });


    setTimeout(() => {
      console.log(JSON.stringify(this.tokens));
    }, 2000 * this.tokens ?.length + 1);
  }

  getTokenData(data?: any): void {
    // data.metrNum
    this.apiService.getTokenData(data.MBAIMETERS).subscribe(
      (res: any) => {
        // console.log(res);
        // data.name = res.body.data[0].fullName;
        // data.balance = res.body.data[0].balance;
        // data.prepayment = res.body.data[0].prepayment;
        data.exists = true;
      },
      (error: any) => {
        console.log(error);
        data.errorMessage = error ?.msgUser;
        data.exists = false;

      }
    )
  }


  generateDownloadJsonUri() {
    let theJSON = JSON.stringify(this.tokens);
    let blob = new Blob([theJSON], { type: 'text/json' });
    let url= window.URL.createObjectURL(blob);
    let uri = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonHref = uri;
  }

}
