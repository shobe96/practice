import { Component, inject } from '@angular/core';
import { NavBarComponent } from './shared/feature/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [NavBarComponent, RouterOutlet],
})
export class AppComponent {
  title = 'employee';
  private translate = inject(TranslateService);

      constructor() {
        this.translate.addLangs(['rs', 'en']);
        this.translate.setFallbackLang('en');
        this.translate.use('en');
    }

}
