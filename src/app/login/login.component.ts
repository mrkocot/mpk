import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';



@Component({
  selector: 'app-login',
  template: `
  <div *ngIf="!loggedIn" class="login-container">
    <img src="assets/bus.png" alt="Bus Image" class="bus-image">
    <div *ngIf="!loggedIn" class="login-form">
      <input type="text" placeholder="Nazwa Użytkownika" [(ngModel)]="username" (keyup.enter)="login()">
      <button class="login-btn" (click)="login()">Zaloguj</button>
    </div>
  </div>`,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  loggedIn: boolean = false; 

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  login() {
    if (this.username.trim() === '') {
      // Handle the case when the username is empty
      console.log('Username is empty. Please enter a username.');
    } else {
      // Non-empty username, proceed with login and remove the login container
      this.authService.login(this.username);
      this.loggedIn = true; // Set the loggedIn flag to true
  
      // Navigate to CityDataComponent
      this.router.navigate(['/city-data']);
    }
  }
}