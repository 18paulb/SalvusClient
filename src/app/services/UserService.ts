import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any;

  setUser(user: any) {
    this.currentUser = user;
  }

  getUser() {
    return this.currentUser;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.currentUser = null;
  }
}
