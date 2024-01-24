import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable( {
  providedIn: 'root'
} )
export class ApiService
{

  baseUrl = "https://selfservice.kplc.co.ke/api/publicData/2.0.1/newContractList?accountReference="

  constructor ( private httpClient: HttpClient ) { }

  getTokenData ( number: any ): Observable<any>
  {
    return this.httpClient.get<any>( this.baseUrl + number, { observe: 'response' } );
  }
}
