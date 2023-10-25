import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { TOKENSIX, TOKENSEVEN, TOKENEIGHT, TOKENSNINE, TOKENTEN, TOKENELEVEN } from "../app.constants";
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
  tokens = TOKENSIX;
  success = 0;
  fail = 0;
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
        this.getTokenData(data);
        this.totalDone += 1;
      }, 1500 * (index + 1));
    });


    setTimeout(() => {
      console.log(JSON.stringify(this.tokens));
    }, 1500 * this.tokens ?.length + 1);
  }

  getTokenData(data?: any): void {
    // data.metrNum
    this.apiService.getTokenData(data.METER_NUMBER).subscribe(
      (res: any) => {
        data.exists = true;
        data.errorMessage = '';
        this.success += 1;
      },
      (error: any) => {
        console.log(error);
        data.errorMessage = error ?.msgUser;
        data.exists = false;
        this.fail += 1;

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
