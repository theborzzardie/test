import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { style, animate, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiService } from '../api.service';
// import { TOKENONE } from '../app.constants';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TokensComponent implements OnInit {


  totalDone = 0;
  downloadJsonHref: any;
  tokens: any = [];
  success = 0;
  fail = 0;
  fileUploading = false;
  fileName = '';
  token: string = '';
  searching = false;
  type = 'accountReference';
  tasksToRetry = 0;
  showRetryBtn = false;
  tokensToRetry: any = [];


  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    // console.log( new Date( 1703710800000 ).toISOString());
    if (!localStorage.getItem('kplctoken')) {
      this.getToken();
    }
  }

  openUploadDialog(): void {
    document.getElementById('uploadFileInput') ?.click();
  }


  getToken(): void {
    this.apiService.getToken().subscribe(
      (res: any) => {
        // console.log(res);
        localStorage.setItem('kplctoken', res.access_token);

      },
      (error: any) => {
        // console.log(error);

      }
    )
  }

  uploadRefreshedFile(event: any): void {
    this.fileUploading = true;
    this.totalDone = 0;
    this.tokens = [];
    this.success = 0;
    this.fail = 0;
    this.fileName = '';
    this.tasksToRetry = 0;
    this.tokensToRetry = [];
    this.showRetryBtn = false;


    const file: File = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    setTimeout(() => {
      this.extractDataFromFile(file);
    }, 1200);
  }

  extractDataFromFile(file: File): void {

    this.fileName = file.name.substring(0, file.name.lastIndexOf('.'));

    let workBook: XLSX.WorkBook | null = null;
    let jsonData: any = [];
    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
      // this.tokens = jsonData.slice(0, 2);
      this.tokens = jsonData;

      // console.log(jsonData);
      // console.log('isComplete', this.tokens);
      this.fileUploading = false;

    };

    reader.readAsBinaryString(file);

  }


  doLoop(): void {
    this.totalDone = 0;
    this.searching = true;
    // use below to test one
    // this.getTokenData( this.tokens[ 0 ] );

    this.tokens.forEach((data: any, index: number) => {
      setTimeout(() => {
        this.getTokenData(data);
        this.totalDone += 1;
        this.searching = this.totalDone === this.tokens.length ? false : true;

      }, 1500 * (index + 1));
    });

    // setTimeout(() => {
    //   this.totalDone === this.tokens.length ? console.log(JSON.stringify(this.tokens)) : '';
    // }, 1500 * this.tokens?.length + 5 );
  }

  getTokenData(data?: any): void {
    this.apiService.getTokenData(data.SEARCH_NUMBER, this.type).subscribe(
      (res: any) => {
        data.exists = 'true';
        data.accountNumber = res.body.data[0].accountReference ?? 'NOT FOUND';
        data.meterNumber = res.body.data[0].meterList[0].serialNum ?? 'NOT FOUND';
        data.balance = res.body.data[0].balance;
        data.fullName = res.body.data[0].fullName ?? 'NOT FOUND';
        data.lastBillAmount = res.body.data[0].colBills[0].lastBillAmount ?? 'NOT FOUND';
        data.billDate = new Date(res.body.data[0].colBills[0].billDate).toISOString() ?? 'NOT FOUND';
        data.dueDate = new Date(res.body.data[0].colBills[0].dueDate).toISOString() ?? 'NOT FOUND';
        data.readingValue = this.insertReadingValueString(res.body.data[0].meterList[0].latestUsageList);
        this.success += 1;
        data.errorMessage = '';
        // console.log(data);

      },
      (error: any) => {
        // console.log(error);
        if (error.fault.message === 'Invalid Credentials' || error.fault.message === 'Missing Credentials') {
          this.getToken();
          this.showRetryBtn = true;
          data.retry = true;
          this.tokensToRetry.push(data);
        } else {
          data.errorMessage = error ?.msgUser;
          data.exists = 'false';
          this.fail += 1;
        }

      }
    )
  }

  insertReadingValueString(latestUsageList: any): string {
    const readingValueList:any[] = [];
    latestUsageList.forEach((item: any) => {
      readingValueList.push(item.usageTypeDesc + " — " + item.readingValue);
    });

    return readingValueList.toString();
  }

  generateDownloadJsonUri(): void {
    let theJSON = JSON.stringify(this.tokens);
    let blob = new Blob([theJSON], { type: 'text/json' });
    let url = window.URL.createObjectURL(blob);
    let uri = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonHref = uri;
  }

  generateExcel(): void {
    const tokens: any = [...this.tokens, ...this.tokensToRetry];
    const filename = this.fileName + '-processed.xlsx'
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tokens);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Data');

    XLSX.writeFile(workBook, filename);
  }


  retryFailed(): void {
    this.searching = true;
    this.tasksToRetry = 0;

    this.tokens = this.tokens.filter((token: any) => !token.retry);
    this.totalDone = this.tokens.length;

    this.tokensToRetry.forEach((data: any, index: number) => {
      setTimeout(() => {
        this.getTokenData(data);
        this.tasksToRetry += 1;
        delete data.retry;
        this.searching = this.tasksToRetry === this.tokensToRetry.length ? false : true;

      }, 1500 * (index + 1));
    });

  }



}
