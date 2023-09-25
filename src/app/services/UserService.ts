import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  private currentUser: any;
  baseUrl = environment.baseUrl + "authentication/";

  setUser(user: any) {
    this.currentUser = user;
  }

  getUser() {
    return this.currentUser;
  }

  getAuthToken() {
    return localStorage.getItem('authtoken');
  }

  isAuthenticated(): Observable<any> {
    const authtoken = localStorage.getItem('authtoken');
    if (authtoken === null) {
      return of(false);
    }

    return this.http.get(this.baseUrl + `verify-authtoken`, {
      headers: new HttpHeaders({
        'Authorization': authtoken
      }),
      observe: 'response'
    });
  }

  logout() {
    this.currentUser = null;
    localStorage.clear();
  }
}


