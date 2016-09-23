import {Component, OnInit, EventEmitter, Output, Input} from "@angular/core";

import {TrackerData} from "./tracker-data";
import {TickerData} from "./ticker-data";
import {TickerTrackerService} from "./ticker-tracker.service";

@Component({
    selector: "tracker-list",
    templateUrl: "tracker-list.component.html"    
})
export class TrackerListComponent{
    @Output() removeItem: EventEmitter<any>;
    @Input() items: TrackerData[];

    constructor(){
        this.removeItem = new EventEmitter<any>();
    }

    sendRemoveItem(data: any)
    {
        this.removeItem.emit(data);
    }
}