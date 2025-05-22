import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrl: './skill.component.scss',
    imports: [RouterOutlet, ConfirmDialog]
})
export class SkillComponent {

}
