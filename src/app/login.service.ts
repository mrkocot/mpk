import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public email: string | null = null;
  
  constructor(public afAuth: AngularFireAuth) { }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
        this.getEmail()
      })
      .catch((error) => {
        console.log(error);
      });
  }

   getEmail(): String | null {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.email = user.email
          console.log(this.email)
        } else {
          console.log("No user is currently logged in!")
        }
      });
      return this.email;
  }

  logout() {
    console.log("Logged out")
    this.email = null
    return this.afAuth.signOut();
  }
}
