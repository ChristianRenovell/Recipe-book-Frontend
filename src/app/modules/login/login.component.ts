import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { environment } from '../../environment/environment';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { LoginService } from '../../services/login.service';
import { LoginResponse } from '../../user.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {
  private _loginServices = inject(LoginService);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  protected form: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    check: [false as boolean, [Validators.required]],
  });

  isRegistre = signal<boolean>(false)

  ngOnInit(): void {
    initializeApp(environment.firebaseConfig);
  }

  onRedirectToSearch() {
    this._goToSearch();
  }

  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
        localStorage.setItem('token-recipes', result.token);
        this._goToSearch();
      });
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);
    }
  }

  private _goToSearch() {
    this._router.navigate(['search']);
  }

  async loginWithEmailAndPassword() {
    if(this.form.valid) {
      const auth = getAuth();
      try {
        const result = await signInWithEmailAndPassword(
          auth,
          this.form.value.email,
          this.form.value.password
        );
        const idToken = await result.user.getIdToken();
        this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
          localStorage.setItem('token-recipes', result.token);
          this._goToSearch();
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async registerWithEmailAndPassword() {
    const auth = getAuth();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        this.form.value.email,
        this.form.value.password
      );
      const idToken = await result.user.getIdToken();
      console.log(idToken);
      this._loginServices.login(idToken).subscribe((result: LoginResponse) => {
        localStorage.setItem('token-recipes', result.token);
        this._goToSearch();
      });
    } catch (error) {
      console.error(error);
    }
  }

  onChangeRegistryLogin() {
    this.form.reset()
    this.isRegistre.update(value => !value)
  }
}
