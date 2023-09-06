import { Component } from '@angular/core';
import { UserService} from "../services/UserService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public userService: UserService) {
  }


  public logout(): void {
    this.userService.logout();
    localStorage.clear();
  }
}
