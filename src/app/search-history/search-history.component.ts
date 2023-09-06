import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {Search} from "./searchModel";

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent {

  public constructor(private http: HttpClient) {
  }


  public searches: Search[] = [];

  public ngOnInit(): void {
    const authtoken = localStorage.getItem('authtoken');
    // if (authtoken == null) {
    //   return;
    // }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${authtoken}`
    });
    this.http.get('http://localhost:8000/searchHistory', {headers: headers}).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {

        let search: Search = {
          searchText: data[i].searchText,
          code: data[i].code,
          date: data[i].date.split(',')[0] // Splits the string at the comma and takes the first part to get date without time todo probably make a better way
        }

        this.searches.push(search);
      }
    });
  }
}

