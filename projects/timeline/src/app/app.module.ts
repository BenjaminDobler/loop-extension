import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoopList } from './loop-list/looplist-component';
import { DurationFormatPipe } from './pipes/duration';
import { TimelineComponent } from './timeline/timeline.component';


@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    LoopList,
    DurationFormatPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [TimelineComponent, LoopList]
})
export class AppModule { 

  constructor(private injector: Injector) {

  }
  ngDoBootstrap() {
    const customElement = createCustomElement(TimelineComponent, { injector: this.injector });
    const customElementLoopList = createCustomElement(LoopList, { injector: this.injector });

    customElements.define('looper-timeline', customElement);
    customElements.define('looper-list', customElementLoopList);

  }
}
