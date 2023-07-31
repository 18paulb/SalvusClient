import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-mark-search',
  templateUrl: './mark-search.component.html',
  styleUrls: ['./mark-search.component.css']
})
export class MarkSearchComponent {

  constructor(private http: HttpClient) {
  }

  results: Trademark[] = [];
  selectedOption: [string, string] = ['',''];
  options: [string, string][] = [['Chemicals', '001'], ['Paints', "002"], ['Cosmetics and Cleaning Preparations', "003"], ['Lubricants and Fuels', "004"], ['Pharmaceuticals', "005"],
    ['Metal Goods', "006"], ['Machinery', "007"], ['Hand Tools', "008"], ['Electrical and Scientific Apparatus', "009"], ['Medical Apparatus', "010"], ['Environmental Control Apparatus', '011'],
    ['Vehicles', '012'], ['Firearms', '013'], ['Jewelry', '014'], ['Musical Instruments', '015'], ['Paper Goods and Printed Matter', '016'], ['Rubber Goods', '017'], ['Leather Goods', '018'],
    ['Non-metallic Building Materials', '019'], ['Furniture and Articles Not Otherwise Classified', '020'], ['Housewares and Glass', '021'], ['Cordage and Fibers', '022'],
    ['Yarns and Threads', '023'], ['Fabrics', '024'], ['Clothing', '025'], ['Fancy Goods', '026'], ['Floor Coverings', '026'], ['Toys and Sporting Goods', '028'], ['Meats and Processed Foods', '029'],
    ['Staple Foods', '030'], ['Natural Agricultural Products', '031'], ['Light Beverages', '032'], ['Wines and Spirits', '033'], ['Smokers\' Articles', '034'], ['Advertising and Business', '035'],
    ['Insurance and Financial', '036'], ['Building Construction and Repair', '037'], ['Telecommunications', '038'], ['Transportation and Storage', '039'], ['Treatment of Materials', '040'],
    ['Educational and Entertainment', '041'], ['Computer and Scientific', '042'], ['Hotels and Restaurants', '043'], ['Medical, Beauty and Agricultural', '044'], ['Personal and Legal', '045']]
  mark: string = '';

  // TODO: Eventually this will grab the company name of the user that is logged in
  companyName: string = 'REPLACE COMPANY NAME';
  email: string = 'REPLACE EMAIL';
  typeCode: string = '000'
  description: string = ''

  public markSearch(): void {
    console.log("Running Search")
    this.results = [];
    // To avoid exposing data via url, maybe use the authtoken to retrieve the company name and email in the server
    this.http.get(`http://localhost:8000/markSearch?query=${this.mark}&code=${this.selectedOption[1]}&companyName=${this.companyName}&email=${this.email}`)
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {

          let trademark: Trademark = {
            mark_identification: data[i].mark_identification,
            case_owners: data[i].case_owners,
            filing_date: data[i].filing_date,
            case_file_description: data[i].case_file_description,
            category: "TODO: Get Category",
            riskLevel: "TODO: Get Risk Level"
          }

          this.results.push(trademark)
        }
      })
  }

  public classifyCode(): void {
    console.log("Running Classify")
    this.http.get(`http://localhost:8000/classifyCode?query=${encodeURIComponent(this.description)}`)
      .subscribe((data: any) => {
        console.log(data)
      })
  }
}

interface Trademark {
  mark_identification: string;
  case_owners: [],
  filing_date: string;
  case_file_description: string;
  category: string;
  riskLevel: string;
}
