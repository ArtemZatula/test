import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'

@Component({
  standalone: true,
  imports: [MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<{title: string}>(MAT_DIALOG_DATA);

  delete() {
    this.dialogRef.close(true);
  }

}
