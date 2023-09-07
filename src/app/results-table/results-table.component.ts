import {Component, Input} from '@angular/core';
import {Trademark} from "../mark-search/trademarkModel";
import {ResultsService} from "../services/ResultsService";

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent {

  constructor(private resultsService: ResultsService) {
  }

  results: Trademark[] = this.resultsService.getResults()
  searchedMark: string = this.resultsService.getSearchedMark()
}
