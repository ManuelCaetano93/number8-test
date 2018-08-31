import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  eachDay,
  getDate,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  format,
  getDay,
  setDay,
  startOfWeek,
  endOfWeek,
  addDays,
  isAfter,
  differenceInDays
} from 'date-fns';

export type AddClass = string | string[] | { [k: string]: boolean } | null;

export interface Day {
  date: Date;
  day: number;
  month: number;
  year: number;
  inThisMonth: boolean;
  invalid: boolean;
}

@Component({
  selector: 'app-calendar-generator',
  templateUrl: './calendar-generator.component.html',
  styleUrls: ['./calendar-generator.component.sass'],
  encapsulation: ViewEncapsulation.None
})


export class CalendarGeneratorComponent implements OnInit {

  private positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];


  @Input() dateChange: Date;

  @Input() daysChange: number;

  innerValue: Date;
  displayValue: string;
  displayFormat: string;
  date: Date;
  barTitle: string;
  barTitleFormat: string;
  barTitleIfEmpty: string;
  firstCalendarDay: number;
  currentMonth: number;
  currentDays: number;
  months: Day[][];
  days: Day[];
  view: string;
  years: { year: number; isThisYear: boolean }[];
  dayNames: string[];
  dayNamesFormat: string;
  locale: object;
  placeholder: string;
  addClass: AddClass;
  addStyle: { [k: string]: any } | null;
  fieldId: string;
  useEmptyBarTitle: boolean;
  disabled: boolean;
  anyDaysLeft: boolean;

  constructor() { }

  ngOnInit() {
    this.view = 'days';
    this.setOptions();
    this.initDayNames();
    this.initDays();
    this.init();
  }


  initDayNames(): void {
    this.dayNames = [];
    const start = this.firstCalendarDay;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, this.dayNamesFormat, this.locale));
    }
  }

  initDays(): void {

    this.currentMonth = 0;
    this.months = [];

    console.log(this.currentDays);
    let anyDaysLeft = true;
    let daysLeft = this.currentDays;
    let i = 0;
    let newActualDate = this.date;
    const end = addDays(this.date, daysLeft);

    while (anyDaysLeft) {
      let actualDate = this.date || new Date();
      if ( isAfter(newActualDate, actualDate) ) {
        actualDate = newActualDate;
      }
      console.log(actualDate);
      const start = startOfMonth(actualDate);

      let cyclyingDays = eachDay(actualDate, addDays(actualDate, daysLeft)).map(date  => {
        if (isSameMonth(date, start) && differenceInDays(end, date) >= 0) {
          return {
            date: date,
            day: getDate(date),
            month: getMonth(date),
            year: getYear(date),
            inThisMonth: true,
            invalid: false,
            isEndOfWeek: isSameDay(date, endOfWeek(date)),
            isStartOfWeek: isSameDay(date, startOfWeek(date))
          };
        }
      });

      cyclyingDays = cyclyingDays.filter((obj) => obj);

      const currentWeekDay = getDay(start) - this.firstCalendarDay;
      const prevDays = currentWeekDay < 0 ? 7 - this.firstCalendarDay : currentWeekDay;

      for (let j = 1; j <= prevDays; j++) {
        cyclyingDays.unshift({
          date: null,
          day: null,
          month: null,
          year: null,
          inThisMonth: true,
          invalid: true,
          isEndOfWeek: null,
          isStartOfWeek: null
        });
      }


      const remainingDays = getDay(endOfWeek(end)) - getDay(end);
      if (remainingDays !== 0) {
        for (let j = 1; j <= remainingDays; j++) {
          cyclyingDays.push({
            date: null,
            day: null,
            month: null,
            year: null,
            inThisMonth: true,
            invalid: true,
            isEndOfWeek: null,
            isStartOfWeek: null
          });
        }
      }

      this.months[i] = cyclyingDays;
      newActualDate = addMonths(actualDate, 1);
      newActualDate = startOfMonth(newActualDate);
      daysLeft -= differenceInDays(newActualDate, actualDate);
      if (daysLeft < 1) {
        anyDaysLeft = false;
      }
      i++;
    }
  }

  setOptions(date = new Date(), days = this.currentDays): void {
    const today = new Date(); // Change
    this.displayFormat =  'MMM D[,] YYYY';
    this.barTitleFormat =  'MMMM YYYY';
    this.date = date;
    this.currentDays = days || 60;
    this.dayNamesFormat =  'ddd';
    this.firstCalendarDay = 0;
    this.addClass = {};
    this.addStyle = {};
  }
  previousMonthDays(): void {
    this.currentMonth -= 1;
    this.init();
  }
  nextMonthDays(): void {
    this.currentMonth += 1;
    this.init();
  }

  addDay(days, date): void {
    days = {
      date: date,
      day: getDate(date),
      month: getMonth(date),
      year: getYear(date),
      inThisMonth: true,
      invalid: false,
      isEndOfWeek: isSameDay(date, endOfWeek(date)),
      isStartOfWeek: isSameDay(date, startOfWeek(date))
    };
  }

  init(): void {
    const actualDate = this.date || new Date();
    const start = startOfMonth(addMonths(actualDate, this.currentMonth));
    const end = endOfMonth(actualDate);
    this.days = this.months[this.currentMonth];

    if (this.innerValue) {
      this.displayValue = format(this.innerValue, this.displayFormat, this.locale);
      this.barTitle = format(start, this.barTitleFormat, this.locale);
    } else {
      this.displayValue = '';
      this.barTitle = this.useEmptyBarTitle ? this.barTitleIfEmpty : format(start, this.barTitleFormat, this.locale);
    }
  }
}
