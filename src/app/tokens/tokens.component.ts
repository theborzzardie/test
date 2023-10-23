import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { TOKENS } from "../app.constants";
import { interval } from 'rxjs';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  tokens = TOKENS;

  ngOnInit(): void {
    // this.getTokenData();
  }

  doLoop(): void {

    this.tokens.forEach((data: any, index: number) => {
      interval(2000).subscribe((x: any) => {
        // this.getTokenData(data);
        console.log('here');

      });
    });
  }

  getTokenData(data?: any): void {
    // data.metrNum
    this.apiService.getTokenData('061576385').subscribe(
      (res: any) => {
        console.log(res);
        data.name = res.body.data[0].fullname;
        data.balance = res.body.data[0].balance;
        data.prepayment = res.body.data[0].prepayment;
      },
      (error: any) => {
        console.log(error);
        data.errorMessage = error ?.msgUser;

      }
    )
  }

}
