import {Component, EventEmitter, Output, signal} from '@angular/core';
import {CertificateUploadService} from '../../services/certificate-upload';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-certificate-upload',
  imports: [],
  templateUrl: './certificate-upload.html',
  standalone: true,
  styleUrl: './certificate-upload.scss'
})
export class CertificateUpload {
  @Output() uploaded = new EventEmitter<{ fileName: string }>();

  file: File | null = null;
  dragOver = signal(false);
  progress = signal<number | null>(null);
  errorMsg = signal<string | null>(null);

  readonly allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  readonly maxSizeBytes = 10 * 1024 * 1024; // 10 MB

  constructor(private uploadService: CertificateUploadService) {}

  onBrowse(input: HTMLInputElement) {
    input.click();
  }

  onFileInputChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.setFile(file);
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave() {
    this.dragOver.set(false);
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.dragOver.set(false);
    const file = evt.dataTransfer?.files?.[0] ?? null;
    this.setFile(file);
  }

  removeFile() {
    this.file = null;
    this.progress.set(null);
    this.errorMsg.set(null);
  }

  private setFile(file: File | null) {
    this.errorMsg.set(null);
    this.progress.set(null);

    if (!file) { this.file = null; return; }

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMsg.set('Разрешени са PDF, JPG, PNG.');
      return;
    }
    if (file.size > this.maxSizeBytes) {
      this.errorMsg.set('Файлът е по-голям от 10MB.');
      return;
    }
    this.file = file;
  }

  startUpload() {
    if (!this.file) { return; }

    this.errorMsg.set(null);
    this.progress.set(0);

    this.uploadService.upload(this.file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total ?? 1;
          this.progress.set(Math.round((event.loaded / total) * 100));
        } else if (event.type === HttpEventType.Response) {
          this.progress.set(100);
          this.uploaded.emit({ fileName: this.file!.name });
        }
      },
      error: (err) => {
        this.errorMsg.set('Качването неуспя. Опитай отново.');
        this.progress.set(null);
        console.error(err);
      }
    });
  }
}
