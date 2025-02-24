import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    SpeedDialModule,
    CardModule,
    ButtonModule,
    MenuModule,
  ],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private readonly _router = inject(Router);

  isAdmin = signal<boolean>(false);

  items: MenuItem[] | undefined;

  constructor() {
    this._checkIsAdmin();
    this.items = [
      {
        label: 'Iniciar sesión',
        icon: 'pi pi-user',
        command: () => this._redirectToLogin(),
      },
    ];
  }

  private _redirectToLogin(): void {
    this._router.navigate(['/login']); 
  }

  private _checkIsAdmin() {
    const token = localStorage.getItem('token-recipes');
    this.isAdmin.set(!!token);
  }

  onGoToNew() {
    this._router.navigate(['create']);
  }

  onGoToSearch() {
    this._router.navigate(['search']);
  }
}
