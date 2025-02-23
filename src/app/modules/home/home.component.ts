import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, SpeedDialModule, CardModule, ButtonModule],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {

  private readonly _router = inject(Router);

  isAdmin = signal<boolean>(false)

  constructor() {
    this._checkIsAdmin()
  }

  private _checkIsAdmin() {
    const token = localStorage.getItem('token-recipes');
    this.isAdmin.set(!!token)
  }
  
  onGoToNew() {
    this._router.navigate(['create']);
  }

  onGoToSearch() {
    this._router.navigate(['search']);
  }

}
