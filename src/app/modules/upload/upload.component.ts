import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FileUploadModule,
    ButtonModule,
    BadgeModule,
    ProgressBarModule,
    HttpClientModule,
    CommonModule,
  ],
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Output() emitFiles = new EventEmitter<any[]>();
  files: any = [];

  totalSizePercent: number = 0;

  choose(event: any, callback: any) {
    callback();
  }

  onSelectedFiles(event: any) {
    while (this.fileUpload.files.length > 3) {
      this.fileUpload.files.pop(); 
    }
    this.files = [...this.fileUpload.files];
    this.emitFiles.emit(this.files);
    this.totalSizePercent = (this.files.length / 3) * 100;
  }

  onRemoveTemplatingFile(event: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.files.splice(index, 1);
    this.fileUpload.files = [...this.files];
    this.emitFiles.emit(this.files);
    this.totalSizePercent = (this.files.length / 3) * 100;
  }
}
