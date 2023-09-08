import { Injectable } from '@angular/core';
import {Trademark} from "./trademarkModel";

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private results: Trademark[] = [];

  private searchedMark: string = '';

  public setResults(results: Trademark[]) {
    this.results = results;
  }

  public getResults() {
    return this.results;
  }

  getSearchedMark(): string {
    return this.searchedMark;
  }

  setSearchedMark(value: string) {
    this.searchedMark = value;
  }
}
