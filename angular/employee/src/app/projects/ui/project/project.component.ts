import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
    imports: [RouterOutlet, ConfirmDialog]
})
export class ProjectComponent {

}
