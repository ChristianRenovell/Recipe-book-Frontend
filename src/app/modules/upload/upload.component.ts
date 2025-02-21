import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
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
export class UploadComponent implements OnChanges {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Output() emitFiles = new EventEmitter<any>();
  @Input() urlImage!: string | null;

  files: any = [];

  totalSizePercent: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['urlImage'] && changes['urlImage'].currentValue) {
      this.addFileFromUrl(changes['urlImage'].currentValue);
    }
  }

  choose(event: any, callback: any) {
    callback();
  }

  onSelectedFiles(event: any) {
    const files = event.files;
    if (!files || files.length === 0) return;
  
    const newFiles = Array.from(files).map((file: any) => {
      return {
        file,
        objectURL: URL.createObjectURL(file), 
        name: file.name,
        blob: file, 
      };
    });
    this.files = [...this.files, ...newFiles].slice(0, 1);
    const filesTuSend = [...this.fileUpload.files];
  
    this.emitFiles.emit(filesTuSend);
  
    this.totalSizePercent = (this.files.length / 1) * 100;
  }
  

  onRemoveTemplatingFile(event: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.files.splice(index, 1);
    this.fileUpload.files = [...this.files];
    this.emitFiles.emit(this.files);
    this.totalSizePercent = (this.files.length / 1) * 100;
  }

  async addFileFromUrl(url: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'imagen.jpg', { type: blob.type });

      const fileWithPreview = Object.assign(file, {
        objectURL: URL.createObjectURL(file),
      });

      if (this.files.length < 3) {
        this.files.push(fileWithPreview);
        this.fileUpload.files = [...this.files];
        this.emitFiles.emit(this.files);
        this.totalSizePercent = (this.files.length / 1) * 100;
        this.fileUpload.cd.markForCheck();
      }
    } catch (error) {
      console.error('Error al cargar la imagen desde la URL:', error);
    }
  }
}
