import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResultsService} from "../services/ResultsService";
import {Trademark} from "../services/TrademarkModel";
import {firstValueFrom} from "rxjs";
import {environment} from '../../environments/environment';
import {LoggerService} from "../services/LoggerService";

@Component({
  selector: 'app-mark-search',
  templateUrl: './mark-search.component.html',
  styleUrls: ['./mark-search.component.css']
})
export class MarkSearchComponent {
  baseUrl = environment.baseUrl + "trademark/";

  constructor(private http: HttpClient, private resultsService: ResultsService, private logger: LoggerService) {
  }

  options: [string, string][] = [['Advertising and Business', '035'], ['Building Construction and Repair', '037'], ['Chemicals', '001'], ['Clothing', '025'], ['Computer and Scientific', '042'],
    ['Cordage and Fibers', '022'], ['Cosmetics and Cleaning Preparations', '003'], ['Educational and Entertainment', '041'], ['Electrical and Scientific Apparatus', '009'], ['Environmental Control Apparatus', '011'],
    ['Fabrics', '024'], ['Fancy Goods', '026'], ['Firearms', '013'], ['Floor Coverings', '026'], ['Furniture and Articles Not Otherwise Classified', '020'], ['Hand Tools', '008'], ['Hotels and Restaurants', '043'],
    ['Housewares and Glass', '021'], ['Insurance and Financial', '036'], ['Jewelry', '014'], ['Leather Goods', '018'], ['Light Beverages', '032'], ['Lubricants and Fuels', '004'], ['Machinery', '007'],
    ['Meats and Processed Foods', '029'], ['Medical Apparatus', '010'], ['Medical, Beauty and Agricultural', '044'], ['Metal Goods', '006'], ['Musical Instruments', '015'], ['Natural Agricultural Products', '031'],
    ['Non-metallic Building Materials', '019'], ['Paints', '002'], ['Paper Goods and Printed Matter', '016'], ['Personal and Legal', '045'], ['Pharmaceuticals', '005'], ['Rubber Goods', '017'], ["Smokers' Articles", '034'],
    ['Staple Foods', '030'], ['Telecommunications', '038'], ['Toys and Sporting Goods', '028'], ['Transportation and Storage', '039'], ['Treatment of Materials', '040'], ['Vehicles', '012'], ['Wines and Spirits', '033'],
    ['Yarns and Threads', '023']]

  results: Trademark[] = [];
  shownResults: Trademark[] = [];

  selectedOption: string | null = null;
  mark: string = '';

  NUM_ELEMENTS_TO_LOAD: number = 30

  isLoading: boolean = false;

  numPingsSent: number = 0;

  // 5 * 24 should be 2 minutes total of waiting
  MAX_PINGS: number = 24;

  async markSearch() {

    try {
      if (this.mark == '' || this.selectedOption == null) {
        this.logger.warn("Missing mark identification or an option has not been selected")
        return
      }

      this.numPingsSent = 0;
      this.results.length = 0;
      this.isLoading = true;

      let data = await this.getSameSearch();
      await this.pingForResults(data.task_id)

      this.isLoading = false;

    } catch (error) {
      if (error instanceof Error) this.logger.error(error.message);
      alert("An error has occurred, try refreshing the page or changing your search")
      this.isLoading = false;
    }
  }

  getSameSearch(): Promise<any> {
    return firstValueFrom(this.http.get(this.baseUrl + `markSearchSame?query=${this.mark}&code=${this.selectedOption}&activeStatus=live`, {
      headers: new HttpHeaders({
        'Authorization': `${localStorage.getItem('authtoken')}`
      })
    }));
  }

  async pingForResults(taskId: string) {

    this.numPingsSent += 1;

    if (this.numPingsSent > this.MAX_PINGS) {
      throw Error(`Number of Pings exceeds max of ${this.MAX_PINGS}`);
    }

    let url = environment.baseUrl + `tasks/check_status?task_id=${taskId}&query=${this.mark}`
    let headers = new HttpHeaders({'Authorization': `${localStorage.getItem('authtoken')}`})

    try {
      let data: any = await firstValueFrom(this.http.get(url, {headers}));

      if (data.data == null) {
        // If data is null, wait for 5 seconds before making the next request
        // This is blocking, so it will keep going and loading until it hits MAX_PINGS
        console.log("Ping Sent")
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.pingForResults(taskId);
      } else {
        this.results = this.createTrademarks(data.data);
        this.resultsService.setResults(this.results)
        this.resultsService.setSearchedMark(this.mark)
        // This will remove from results and put in shownResults
        this.shownResults = this.results.splice(0, this.NUM_ELEMENTS_TO_LOAD)
      }
    } catch (error) {
      if (error instanceof Error) {
        // Now TypeScript knows that error is of type Error
        this.logger.error(error.message);
      } else {
        this.logger.error('Caught an unknown error');
      }
    }
  }

  createTrademarks(data: any): any {
    let trademarks: any = []
    for (let i = 0; i < data.length; i++) {

      try {
        let trademark = data[i]['trademark']
        let riskLevel = data[i]['riskLevel']

        let descriptionAndCode = trademark.description_and_code;

        // replace ';' with new line characters
        if (descriptionAndCode[0] != null)
          descriptionAndCode[0] = descriptionAndCode[0].replace(/;/g, '\n')

        trademarks.push({
          mark_identification: trademark.mark_identification,
          case_owners: trademark.case_owners,
          date_filed: this.convertDateFormat(trademark.date_filed),
          case_file_description: descriptionAndCode[0],
          code: this.convertCategoryCode(this.options, descriptionAndCode[1]),
          riskLevel: riskLevel
        })
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(error.message)
        }
      }
    }

    // @ts-ignore
    trademarks.sort((a: Trademark, b: Trademark) => b.riskLevel - a.riskLevel);

    for (let i = 0; i < trademarks.length; ++i) {
      trademarks[i].riskLevel = this.convertRiskLevel(trademarks[i].riskLevel)
    }

    return trademarks;

  }

  public showMoreResults(): void {
    this.shownResults.push(...this.results.splice(0, this.NUM_ELEMENTS_TO_LOAD));
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

  public convertRiskLevel(riskLevel: number): string {

    //TODO: These are arbitrary values, eventually figure out a better way of judging
    if (riskLevel > 60 && riskLevel <= 100) {
      return "High"
    } else if (riskLevel > 30 && riskLevel <= 60) {
      return "Moderate"
    } else {
      return "Low"
    }
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


