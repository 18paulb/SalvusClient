import {Component, Input} from '@angular/core';
import {Trademark} from "../services/TrademarkModel";
import {ResultsService} from "../services/ResultsService";

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent {

  @Input() results!: Trademark[];

  constructor(private resultsService: ResultsService) {
  }
}
