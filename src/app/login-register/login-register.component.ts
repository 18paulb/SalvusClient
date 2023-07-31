import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {Router} from '@angular/router';
import {UserService} from "../services/UserService";

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
  }

  registerEmail: string = '';
  registerPassword: string = '';
  companyName: string = '';

  loginEmail: string = '';
  loginPassword: string = '';

  public register(): void {
    debugger
    this.http.post('http://localhost:8000/register', {
      email: this.registerEmail,
      password: this.registerPassword,
      company_name: this.companyName
    }).subscribe((data: any) => {
      console.log(data);
    });
  }

  public login(): void {
    try {
      this.http.post<{ authtoken: string }>('http://localhost:8000/login', {
        email: this.loginEmail,
        password: this.loginPassword
      }, {observe: 'response'}).subscribe(response => {
        if (response.status == 200 && response.body != null) {
          const token = response.body.authtoken;
          // TODO: We need to learn how to do the authtoken storage properly, this is unsafe
          localStorage.setItem('authToken', token);
          this.router.navigate(['/mark-search']).then(r => console.log(r));
        } else {
          alert('Login failed');
        }
      });
    } catch (e) {
      alert('Login failed')
      console.log(e);
    }
  }



}
