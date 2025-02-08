import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {  LoginService } from '../../services/login.service';
import { LoginResponse } from '../../user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {


  private _loginServices = inject(LoginService)

  ngOnInit(): void {
    initializeApp(environment.firebaseConfig);
  }

  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
    
      const idToken = await result.user.getIdToken();

      this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
        localStorage.setItem("token", result.token);
      });
    } catch (error) {
      console.error("Error en loginWithGoogle:", error);
    }
  }
  test() {
    this._loginServices.test().subscribe(()=>{
      alert('aaa')
     })
  }

  async loginWithEmailAndPassword() {
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, "christianrenovell83@gmail.com", "123456Abc");
      const idToken = await result.user.getIdToken();
      console.log(idToken);
      this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
        localStorage.setItem("token", result.token);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async registerWithEmailAndPassword() {
    const auth = getAuth();
    try {
      const result = await createUserWithEmailAndPassword(auth, "christianrenovell83@gmail.com", "123456Abc");
      const idToken = await result.user.getIdToken();
      console.log(idToken);
      this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
        localStorage.setItem("token", result.token);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
