import { Component } from '@angular/core';
import { LoopService } from '@richapps/looper-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  service = new LoopService();



  ngAfterViewInit() {
    setTimeout(() => {
      this.service.checkVideo();
    }, 1000);
  }
}
