import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResultsService} from "../services/ResultsService";
import {Trademark} from "../services/trademarkModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mark-search',
  templateUrl: './mark-search.component.html',
  styleUrls: ['./mark-search.component.css']
})
export class MarkSearchComponent {
  baseUrl = "http://localhost:8000/trademark/";

  constructor(private http: HttpClient, private resultsService: ResultsService, private router: Router) {
  }

  // options: [string, string][] = [['Chemicals', '001'], ['Paints', "002"], ['Cosmetics and Cleaning Preparations', "003"], ['Lubricants and Fuels', "004"], ['Pharmaceuticals', "005"],
  //   ['Metal Goods', "006"], ['Machinery', "007"], ['Hand Tools', "008"], ['Electrical and Scientific Apparatus', "009"], ['Medical Apparatus', "010"], ['Environmental Control Apparatus', '011'],
  //   ['Vehicles', '012'], ['Firearms', '013'], ['Jewelry', '014'], ['Musical Instruments', '015'], ['Paper Goods and Printed Matter', '016'], ['Rubber Goods', '017'], ['Leather Goods', '018'],
  //   ['Non-metallic Building Materials', '019'], ['Furniture and Articles Not Otherwise Classified', '020'], ['Housewares and Glass', '021'], ['Cordage and Fibers', '022'],
  //   ['Yarns and Threads', '023'], ['Fabrics', '024'], ['Clothing', '025'], ['Fancy Goods', '026'], ['Floor Coverings', '026'], ['Toys and Sporting Goods', '028'], ['Meats and Processed Foods', '029'],
  //   ['Staple Foods', '030'], ['Natural Agricultural Products', '031'], ['Light Beverages', '032'], ['Wines and Spirits', '033'], ['Smokers\' Articles', '034'], ['Advertising and Business', '035'],
  //   ['Insurance and Financial', '036'], ['Building Construction and Repair', '037'], ['Telecommunications', '038'], ['Transportation and Storage', '039'], ['Treatment of Materials', '040'],
  //   ['Educational and Entertainment', '041'], ['Computer and Scientific', '042'], ['Hotels and Restaurants', '043'], ['Medical, Beauty and Agricultural', '044'], ['Personal and Legal', '045']]

  options: [string, string][] = [['Advertising and Business', '035'], ['Building Construction and Repair', '037'], ['Chemicals', '001'], ['Clothing', '025'], ['Computer and Scientific', '042'],
    ['Cordage and Fibers', '022'], ['Cosmetics and Cleaning Preparations', '003'], ['Educational and Entertainment', '041'], ['Electrical and Scientific Apparatus', '009'], ['Environmental Control Apparatus', '011'],
    ['Fabrics', '024'], ['Fancy Goods', '026'], ['Firearms', '013'], ['Floor Coverings', '026'], ['Furniture and Articles Not Otherwise Classified', '020'], ['Hand Tools', '008'], ['Hotels and Restaurants', '043'],
    ['Housewares and Glass', '021'], ['Insurance and Financial', '036'], ['Jewelry', '014'], ['Leather Goods', '018'], ['Light Beverages', '032'], ['Lubricants and Fuels', '004'], ['Machinery', '007'],
    ['Meats and Processed Foods', '029'], ['Medical Apparatus', '010'], ['Medical, Beauty and Agricultural', '044'], ['Metal Goods', '006'], ['Musical Instruments', '015'], ['Natural Agricultural Products', '031'],
    ['Non-metallic Building Materials', '019'], ['Paints', '002'], ['Paper Goods and Printed Matter', '016'], ['Personal and Legal', '045'], ['Pharmaceuticals', '005'], ['Rubber Goods', '017'], ["Smokers' Articles", '034'],
    ['Staple Foods', '030'], ['Telecommunications', '038'], ['Toys and Sporting Goods', '028'], ['Transportation and Storage', '039'], ['Treatment of Materials', '040'], ['Vehicles', '012'], ['Wines and Spirits', '033'],
    ['Yarns and Threads', '023']]

  results: Trademark[] = [];

  selectedOption: [string, string] = ['', ''];
  mark: string = '';
  description: string = ''
  classification: string = ''
  searchScope: string = 'Same'
  // mark: string = 'king'
  // description: string = ''
  // classification: string = ''
  // searchScope: string = 'all'
  // selectedOption: [string, string] = ['Chemicals', '001']

  filteredOptions = [...this.options];
  categorySearchTerm = '';

  filterResults() {
    this.filteredOptions = this.options.filter(
      option => option[0].toLowerCase().includes(this.categorySearchTerm.toLowerCase())
    );
  }

  selectOption(option: string) {
    this.categorySearchTerm = option;
    this.filteredOptions = [];
  }

  public markSearch(): void {
    this.results = [];

    if (this.mark == '' || this.selectedOption[1] == '' || this.searchScope == '') {
      throw Error
    }

    if (this.searchScope === 'All') {
      this.http.get(this.baseUrl + `markSearchAll?query=${this.mark}&activeStatus=live`, {
        headers: new HttpHeaders({
          // 'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
          'Authorization': `${localStorage.getItem('authtoken')}`
        })
      })
        .subscribe((data: any) => {
          this.createTrademarks(data.data)
        })
    }

    if (this.searchScope === 'Same') {
      this.markSearchSameRecursive(null, true);
      // this.http.get(this.baseUrl + `markSearchSame?query=${this.mark}&code=${this.selectedOption[1]}&activeStatus=live`, {
      //   headers: new HttpHeaders({
      //     // 'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
      //     'Authorization': `${localStorage.getItem('authtoken')}`
      //   })
      // })
      //   .subscribe((data: any) => {
      //     this.createTrademarks(data.data);
      //   })
    }
  }

  markSearchSameRecursive(lastEvaluatedKey : any, isFirstTime : boolean = false): void {
    if (!isFirstTime && lastEvaluatedKey === null) {
      return;
    }

    this.http.get(this.baseUrl + `markSearchSame?query=${this.mark}&code=${this.selectedOption[1]}&activeStatus=live&lastEvaluatedKey=${lastEvaluatedKey}`, {
        headers: new HttpHeaders({
            // 'Authorization': `Bearer ${localStorage.getItem('authtoken')}`
            'Authorization': `${localStorage.getItem('authtoken')}`
        })
    })
        .subscribe((data: any) => {
            this.createTrademarks(data.data);
            this.markSearchSameRecursive(data.lastEvalutedKey);
        })
  }

  public classifyCode(): void {
    this.http.get(this.baseUrl + `classifyCode?query=${encodeURIComponent(this.description)}`)
      .subscribe((data: any) => {
        this.classification = data.classification

        //This sets the selected option to the classification if it is in the list of options
        //Basically sets the code for the search and also picks an option from the dropdown of classifications
        if (this.options.some(([key, value]) => key.toLowerCase() === data.classification.toLowerCase())) {
          this.selectedOption = this.options.find(([key, value]) => key.toLowerCase() === data.classification.toLowerCase())!
        }

      })
  }

  public createTrademarks(data: any): void {
    for (let i = 0; i < data.length; i++) {

      let trademark = data[i]['trademark']
      let riskLevel = data[i]['riskLevel']

      this.results.push({
        mark_identification: trademark.mark_identification,
        case_owners: trademark.case_owners,
        date_filed: this.convertDateFormat(trademark.date_filed),
        case_file_descriptions: trademark.case_file_descriptions,
        codes: this.convertCategoryCode(this.options, trademark.codes),
        riskLevel: this.convertRiskLevel(riskLevel)
      })
    }

    if (this.results.length != 0) {

      //Sort the results
      let customOrder = ["red", "yellow", "green"];

      this.results = this.results.sort((a, b) => customOrder.indexOf(a.riskLevel) - customOrder.indexOf(b.riskLevel));

      this.resultsService.setResults(this.results)
      this.resultsService.setSearchedMark(this.mark)
      this.router.navigate(['/results-table'])
    }
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

    else if (riskLevel == "green") return "Low Risk"

    else return ""
  }

  public convertCategoryCode(arr: [string, string][], number: string): string {

    for (const [text, num] of arr) {
      if (num === number) {
        return text;
      }
    }
    return "ERROR";  // return null if the number is not found
  }

}


