import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "https://selfservice.kplc.co.ke/api/publicData/2.0.1/newContractList?"

  constructor(private httpClient: HttpClient) { }

  getTokenData(number: any, searchtype: string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + searchtype + '=' + number, { observe: 'response' });
  }
}


// GET TOKEN ENDPOINT
// https://selfservice.kplc.co.ke/api/token

// GET TOKEN PAYLOAD, SENT AS FORM DATA
// grant_type=client_credentials&scope=token_public accounts_public attributes_public customers_public documents_public listData_public rccs_public sectorSupplies_public selfReads_public serviceRequests_public services_public streets_public supplies_public users_public workRequests_public publicData_public juaforsure_public calculator_public sscalculator_public token_private accounts_private accounts_public attributes_public attributes_private customers_public customers_private documents_private documents_public listData_public rccs_private rccs_public sectorSupplies_private sectorSupplies_public selfReads_private selfReads_public serviceRequests_private serviceRequests_public services_private services_public streets_public supplies_private supplies_public users_private users_public workRequests_private workRequests_public notification_private outage_private juaforsure_private juaforsure_public prepayment_private pdfbill_private publicData_public selfReadsPeriod_private corporateAccount_private calculator_public sscalculator_public register_public ssaccounts_public addaccount_public summaryLetter_public whtcertificate_public selfService_public
