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
    return localStorage.getItem('authtoken');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authtoken') != null
   }

  logout() {
    localStorage.removeItem('authtoken');
    this.currentUser = null;
  }
}


