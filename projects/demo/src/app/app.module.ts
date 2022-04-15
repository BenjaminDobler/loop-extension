import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TimelineComponent,LoopList, DurationFormatPipe  } from '@richapps/looper-components';

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
  bootstrap: [AppComponent]
})
export class AppModule { }
