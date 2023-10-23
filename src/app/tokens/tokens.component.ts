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
  tokens = TOKENS;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,


  ) { }

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
      }, 5000 * (index + 1));
    });


    setTimeout(() => {
      console.log(JSON.stringify(this.tokens));
    }, 5000 * this.tokens ?.length + 1);
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
        data.errorMessage = '';
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
    let url = window.URL.createObjectURL(blob);
    let uri = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonHref = uri;
  }

}
