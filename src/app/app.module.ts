import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarGeneratorComponent } from './calendar-generator/calendar-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarGeneratorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
