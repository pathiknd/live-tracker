import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from "@angular/core";

import {TrackerData} from "./tracker-data";
import {TickerData} from "./ticker-data";
import * as  Rx from "rxjs/Rx";

@Component({    
    selector: "add-tracker",
    templateUrl: "add-tracker.component.html"
})
export class AddTrackerComponent{
    @Output() addItem: EventEmitter<any>;
    name: string;

    constructor(){
        this.addItem = new EventEmitter<any>();
        this.name = "";
    }

    sendAddItem(){        
        this.addItem.emit(this.name);
        this.name = "";
    }
}