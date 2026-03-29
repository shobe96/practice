import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from './shared/feature/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import {
    TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [NavBarComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'employee';
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.translate.addLangs(['rs', 'en']);
    this.translate.setFallbackLang('en');
    
    // Check if a language is already set, otherwise use 'en'
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|rs/) ? browserLang : 'en');
  }

}
