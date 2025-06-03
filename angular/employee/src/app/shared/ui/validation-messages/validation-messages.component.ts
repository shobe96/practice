import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-messages',
  imports: [],
  templateUrl: './validation-messages.component.html',
  styleUrl: './validation-messages.component.scss',
})
export class ValidationMessagesComponent {
  @Input() control!: AbstractControl | null;
  @Input() messages: { [key: string]: string } = {};

  get errorKeys(): string[] {
    if (!this.control || !this.control.errors) return [];
    return Object.keys(this.control.errors);
  }
}
