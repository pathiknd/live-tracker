import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TrackerListComponent } from "./tracker-list.component";
import { TrackerComponent } from "./tracker.component";
import { AddTrackerComponent } from "./add-tracker.component";
import { SearchTrackerComponent } from "./search-tracker.component";
import { TickerTrackerService } from "./ticker-tracker.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    TrackerListComponent,
    TrackerComponent,
    AddTrackerComponent,
    SearchTrackerComponent
  ],
  providers: [
    TickerTrackerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
