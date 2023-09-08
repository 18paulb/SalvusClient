import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResultsService} from "../services/ResultsService";
import {Trademark} from "./trademarkModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mark-search',
  templateUrl: './mark-search.component.html',
  styleUrls: ['./mark-search.component.css']
})
export class MarkSearchComponent {

  constructor(private http: HttpClient, private resultsService: ResultsService, private router: Router) {
  }

  options: [string, string][] = [['Chemicals', '001'], ['Paints', "002"], ['Cosmetics and Cleaning Preparations', "003"], ['Lubricants and Fuels', "004"], ['Pharmaceuticals', "005"],
    ['Metal Goods', "006"], ['Machinery', "007"], ['Hand Tools', "008"], ['Electrical and Scientific Apparatus', "009"], ['Medical Apparatus', "010"], ['Environmental Control Apparatus', '011'],
    ['Vehicles', '012'], ['Firearms', '013'], ['Jewelry', '014'], ['Musical Instruments', '015'], ['Paper Goods and Printed Matter', '016'], ['Rubber Goods', '017'], ['Leather Goods', '018'],
    ['Non-metallic Building Materials', '019'], ['Furniture and Articles Not Otherwise Classified', '020'], ['Housewares and Glass', '021'], ['Cordage and Fibers', '022'],
    ['Yarns and Threads', '023'], ['Fabrics', '024'], ['Clothing', '025'], ['Fancy Goods', '026'], ['Floor Coverings', '026'], ['Toys and Sporting Goods', '028'], ['Meats and Processed Foods', '029'],
    ['Staple Foods', '030'], ['Natural Agricultural Products', '031'], ['Light Beverages', '032'], ['Wines and Spirits', '033'], ['Smokers\' Articles', '034'], ['Advertising and Business', '035'],
    ['Insurance and Financial', '036'], ['Building Construction and Repair', '037'], ['Telecommunications', '038'], ['Transportation and Storage', '039'], ['Treatment of Materials', '040'],
    ['Educational and Entertainment', '041'], ['Computer and Scientific', '042'], ['Hotels and Restaurants', '043'], ['Medical, Beauty and Agricultural', '044'], ['Personal and Legal', '045']]

  results: Trademark[] = [];

  // selectedOption: [string, string] = ['', ''];
  // mark: string = '';
  // description: string = ''
  // classification: string = ''
  // searchWidth: string = ''
  mark: string = 'king'
  description: string = ''
  classification: string = ''
  searchScope: string = 'all'
  selectedOption: [string, string] = ['Chemicals', '001']

  public markSearch(): void {
    this.results = [];

    if (this.mark == '' || this.selectedOption[1] == '' || this.searchScope == '') {
      throw Error
    }

    // To avoid exposing data via url, maybe use the authtoken to retrieve the company name and email in the server
    this.http.get(`http://localhost:8000/markSearch?query=${this.mark}&code=${this.selectedOption[1]}&searchWidth=${this.searchScope}`, {
      headers: new HttpHeaders({
        // 'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
        'Authorization': `${localStorage.getItem('authtoken')}`
      })
    })
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {

          let trademark = data[i]['trademark']
          let riskLevel = data[i]['riskLevel']

          this.results.push({
            mark_identification: trademark.mark_identification,
            case_owners: trademark.case_owners,
            date_filed: this.convertDateFormat(trademark.date_filed),
            case_file_descriptions: trademark.case_file_descriptions,
            category: "TODO: Get Category",
            riskLevel: this.convertRiskLevel(riskLevel)
          })
        }

        if (this.results.length != 0) {

          //Sort the results
          let customOrder = ["red", "yellow", "green"];

          debugger

          this.results = this.results.sort((a, b) => customOrder.indexOf(a.riskLevel) - customOrder.indexOf(b.riskLevel));

          this.resultsService.setResults(this.results)
          this.resultsService.setSearchedMark(this.mark)
          this.router.navigate(['/results-table'])
        }
      })
  }

  public classifyCode(): void {
    this.http.get(`http://localhost:8000/classifyCode?query=${encodeURIComponent(this.description)}`)
      .subscribe((data: any) => {
        this.classification = data.classification

        //This sets the selected option to the classification if it is in the list of options
        //Basically sets the code for the search and also picks an option from the dropdown of classifications
        if (this.options.some(([key, value]) => key.toLowerCase() === data.classification.toLowerCase())) {
          this.selectedOption = this.options.find(([key, value]) => key.toLowerCase() === data.classification.toLowerCase())!
        }

      })
  }

  public convertDateFormat(dateStr: string): string {
    // Extract year, month, and day as substrings
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    // Create a new Date object (Note: JavaScript month is 0-based, so -1 on month)
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Array of month names for conversion
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Construct the formatted date string
    return `${day} ${monthNames[dateObj.getMonth()]} ${year}`;
  }

  public convertRiskLevel(riskLevel: string): string {
    if (riskLevel == "yellow") return "Moderate Risk"

    else if (riskLevel == "red") return "High Risk"

    else if (riskLevel == "green") return "No Risk"

    else return ""

  }

}


