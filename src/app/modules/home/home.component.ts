import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, SpeedDialModule],
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  items: MenuItem[];

  private readonly _router = inject(Router);

  constructor() {
    this.items = [
      {
        icon: 'pi pi-pencil',
        tooltipOptions: {
          tooltipLabel: 'Buscador',
        },
        command: () => {
          this._router.navigate(['search']);
        },
      },
      {
        icon: 'pi pi-search',
        tooltipOptions: {
          tooltipLabel: 'Nueva receta',
        },
        command: () => {
          this._router.navigate(['create']);
        },
        
      },
    ];
  }

}
