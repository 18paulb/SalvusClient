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

  results: Trademark[] = []
  searchedMark: string = this.resultsService.getSearchedMark()

  itemsPerPage: number = 10
  currentPage: number = 1
  totalPages: number = 0
  pagedItems: Trademark[] = []

  ngOnInit(): void {
    this.results = this.resultsService.getResults()
    this.totalPages = Math.ceil(this.results.length / this.itemsPerPage);
    this.loadPage(this.currentPage);
  }

  loadPage(page: number): void {
    const startIdx = (page - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    this.pagedItems = this.results.slice(startIdx, endIdx);
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }
}
