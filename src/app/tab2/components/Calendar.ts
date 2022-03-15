import { Component, OnInit } from "@angular/core";
import { CalendarCreator } from "../services/CalendarCreator";
import { Day } from "../models/day.model";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.html",
  styleUrls: ["../calendar.css"],
})
export class Calendar implements OnInit {
  public monthDays: Day[];

  public monthNumber: number;
  public year: number;

  public weekDaysName = [];

  constructor(public calendarCreator: CalendarCreator) {}

  ngOnInit(): void {
    this.setMonthDays(this.calendarCreator.getCurrentMonth());

    this.weekDaysName.push("Dll");
    this.weekDaysName.push("Dm");
    this.weekDaysName.push("Dm");
    this.weekDaysName.push("Dj");
    this.weekDaysName.push("Dv");
    this.weekDaysName.push("Ds");
    this.weekDaysName.push("Dm");
  }

  onNextMonth(): void {
    this.monthNumber++;

    if (this.monthNumber == 13) {
      this.monthNumber = 1;
      this.year++;
    }

    this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year));
  }

  onPreviousMonth() : void{
    this.monthNumber--;

    if (this.monthNumber < 1) {
      this.monthNumber = 12;
      this.year--;
    }

    this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year));
  }

  private setMonthDays(days: Day[]): void {
    this.monthDays = days;
    this.monthNumber = this.monthDays[0].monthIndex;
    this.year = this.monthDays[0].year;
  }
}