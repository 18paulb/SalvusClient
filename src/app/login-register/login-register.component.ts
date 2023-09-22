import {Component, OnInit} from '@angular/core';
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
  // baseUrl = "http://localhost:8000/authentication/";
  baseUrl = "https://salvusbackend-6f4cec5e1bd6.herokuapp.com/authentication/"

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.userService.getAuthToken() != null) {
      this.router.navigate(['/mark-search']);
    }
  }

  registerEmail: string = '';
  registerPassword: string = '';
  confirmedRegisterPassword: string = '';
  companyName: string = '';

  loginEmail: string = '';
  loginPassword: string = '';

  showLoginForm: boolean = true;
  showRegisterForm: boolean =  false;

  loginSuccess: boolean = true;
  registerSuccess: boolean = true;
  errorMessage = ''

  public register(): void {
    try {

      if (this.registerEmail === '' || this.registerPassword === '' || this.confirmedRegisterPassword === '') {
        this.errorMessage = "Missing information"
        this.registerSuccess = false;
        return;
      }

      if (this.registerPassword !== this.confirmedRegisterPassword) {
        this.errorMessage = "Passwords do not match"
        this.registerPassword = ''
        this.confirmedRegisterPassword = ''
        this.registerSuccess = false;
        return;
      }

      this.http.post<{ authtoken: string }>(this.baseUrl + 'register', {
        email: this.registerEmail,
        password: this.registerPassword,
        company_name: this.companyName
      }, {observe: 'response'}).subscribe((response: any) => {
        console.log(response);
        if (response.status == 200 && response.body != null) {
          const token = response.body.authtoken;
          // TODO: We need to learn how to do the authtoken storage properly, this is unsafe
          localStorage.setItem('authtoken', token);
          this.router.navigate(['/mark-search']).then(r => console.log(r));
        } else {
          this.errorMessage = 'Register Failed';
        }
      });

    } catch (e) {
      this.errorMessage = 'Register failed'
    }
  }

  public login(): void {
    this.loginSuccess = true;

    this.http.post<{ authtoken: string }>(this.baseUrl + 'login', {
      email: this.loginEmail,
      password: this.loginPassword
    }, {observe: 'response'}).subscribe(
      response => {
        if (response.status === 200 && response.body !== null) {
          const token = response.body.authtoken;
          // TODO: We need to learn how to do the authtoken storage properly, this is unsafe
          localStorage.setItem('authtoken', token);
          this.router.navigate(['/mark-search']).then(r => console.log(r));
        } else {
          this.loginSuccess = false;
        }
      },
      error => {
        if (error.status === 401) {
          // Handle 401 error here
          this.loginSuccess = false;
          this.errorMessage = "Your username or password is incorrect"
        } else {
          // Handle other errors
          this.loginSuccess = false;
          this.errorMessage = "Your username or password is incorrect"
        }
      }
    );

  }


}
