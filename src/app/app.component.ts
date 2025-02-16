import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ProgressSpinnerModule],
  providers: [MessageService, LoadingService],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly _logingServices = inject(LoadingService)

  loading = signal<boolean>(false);

  constructor() {
    this._logingServices.loading$.subscribe(this.loading.set)
  }
}
