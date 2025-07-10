import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-icon-button',
  imports: [Button, Tooltip],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' = 'primary';
  @Input() tooltip = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() rounded = true;
  @Output() action = new EventEmitter<object>();
}
