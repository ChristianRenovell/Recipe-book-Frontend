import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-steps-table',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './steps-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsTableComponent {
  @Input() steps!: any[];
  @Output() removeStep = new EventEmitter<string>();

  deleteStep(idStep: string) {
    this.removeStep.emit(idStep);
  }
}
