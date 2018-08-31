import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarGeneratorComponent } from './calendar-generator.component';

@NgModule({
  declarations: [ CalendarGeneratorComponent ],
  imports: [ CommonModule, FormsModule],
  exports: [ CalendarGeneratorComponent, CommonModule, FormsModule]
})
export class CalendarGeneratorModule { }
