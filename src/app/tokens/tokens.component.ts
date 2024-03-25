import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { style, animate, transition, trigger } from '@angular/animations';

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

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    // console.log( new Date( 1703710800000 ).toISOString());
    // this.doLoop();
    this.token = localStorage.getItem('kplctoken') ?? '';
  }

  openUploadDialog(): void {
    document.getElementById('uploadFileInput') ?.click();
  }

  uploadRefreshedFile(event: any): void {
    this.fileUploading = true;
    this.totalDone = 0;
    this.tokens = [];
    this.success = 0;
    this.fail = 0;
    this.fileName = '';

    const file: File = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    setTimeout(() => {
      this.extractDataFromFile(file);
    }, 2000);
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
      this.tokens = jsonData.slice(0, 5);
      // this.tokens = jsonData;

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


    setTimeout(() => {
      console.log(JSON.stringify(this.tokens));
    }, 1500 * this.tokens ?.length + 2 );
  }

  getTokenData(data?: any): void {
    this.apiService.getTokenData(data.SEARCH_NUMBER, this.type).subscribe(
      (res: any) => {
        data.exists = 'true';
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
        data.exists = 'false';
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



  generateExcel(): void {
    const filename = this.fileName + '-processed.xlsx'
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tokens);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Data');

    XLSX.writeFile(workBook, filename);
  }

  writeToLocal(): void {
    this.token.length ? localStorage.setItem('kplctoken', this.token) : '';
  }




}
