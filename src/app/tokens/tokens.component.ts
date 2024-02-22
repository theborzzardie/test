import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from '../api.service';
import { TOKENONE } from '../app.constants';


@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {


  totalDone = 0;
  downloadJsonHref: any;
  tokens = TOKENONE;
  success = 0;
  fail = 0;
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    // console.log( new Date( 1703710800000 ).toISOString());
    this.doLoop();
  }

  doLoop(): void {
    this.totalDone = 0;
    // use below to test one
    // this.getTokenData( this.tokens[ 0 ] );


    this.tokens.forEach((data: any, index: number) => {
      setTimeout(() => {
        this.getTokenData(data);
        this.totalDone += 1;
      }, 1500 * (index + 1));
    });


    setTimeout(() => {
      console.log(JSON.stringify(this.tokens));
    }, 1500 * this.tokens ?.length + 1 );
  }

  getTokenData(data?: any): void {
    // data.metrNum
    this.apiService.getTokenData(data.ACCOUNT_NUMBER).subscribe(
      (res: any) => {
        data.exists = true;
        data.errorMessage = '';
        data.meterNumber = res.body.data[0].meterList[0].serialNum ?? 'NOT FOUND';
        data.balance = res.body.data[0].balance;
        data.fullName = res.body.data[0].fullName ?? 'NOT FOUND';
        data.lastBillAmount = res.body.data[0].colBills[0].lastBillAmount ?? 'NOT FOUND';
        data.billDate = new Date(res.body.data[0].colBills[0].billDate).toISOString() ?? 'NOT FOUND';
        data.dueDate = new Date(res.body.data[0].colBills[0].dueDate).toISOString() ?? 'NOT FOUND';
        this.success += 1;
        // console.log( data );

      },
      (error: any) => {
        console.log(error);
        data.errorMessage = error ?.msgUser;
        data.exists = false;
        this.fail += 1;

      }
    )
  }


  generateDownloadJsonUri(): void {
    let theJSON = JSON.stringify(this.tokens);
    let blob = new Blob([theJSON], { type: 'text/json' });
    let url = window.URL.createObjectURL(blob);
    let uri = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonHref = uri;
  }

}
