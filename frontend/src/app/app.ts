import {Component, DOCUMENT, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
})
export class App implements OnInit {
  private document: Document = inject(DOCUMENT);

  ngOnInit(): void {
    this.removeSplashScreen()
  }

  private removeSplashScreen() {
    setTimeout(() => {
      this.document.getElementById('splash-screen')?.remove();
      this.document.getElementById('splash-screen-css')?.remove();
    }, 200)
  }
}
