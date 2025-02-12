import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, HttpClientModule, CommonModule],
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  files = [];

  totalSizePercent: number = 0;

  choose( event: any, callback:any) {  
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.files = event.currentFiles;
    this.totalSizePercent = (this.files.length / 3) * 100;
  }

  // onSelectedFiles(event:any) {
  //   debugger
  //   if(this.files.length < 4) {
  //     this.files = event.currentFiles;
  //     this.totalSizePercent = (this.files.length / 3) * 100;
  //   } 
  // }

  onSelectedFiles(event: any, fileUpload: FileUpload) {
    debugger
    const selectedFiles = event.files.length;
    const currentFiles = fileUpload.files.length;
    if (currentFiles > 3) {
      // Elimina los archivos extra
      fileUpload.files.splice(3);
      event.files.splice(3 - (currentFiles - selectedFiles));
      
      // Mensaje de error opcional
      alert('No puedes subir más de 3 archivos.');
    }

    this.updateProgress();
  }

  updateProgress() {
    this.totalSizePercent = (this.fileUpload.files.length / 3) * 100;
  }
}
