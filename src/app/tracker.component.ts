import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from "@angular/core";

import {TrackerData} from "./tracker-data";
import {TickerData} from "./ticker-data";
import * as  Rx from "rxjs/Rx";

@Component({    
    selector: "tracker",
    templateUrl: "tracker.component.html"
})
export class TrackerComponent implements AfterViewInit{
    @Input() data: TrackerData;
    @Output() removeItem: EventEmitter<any>;
    @ViewChild("trackerBody") trackerBody: ElementRef;
    @ViewChild("trackerComponent") trackerComponent: ElementRef;
    @ViewChild("trackerHighlight") trackerHighlight: ElementRef;
    
    private eventStream:  Rx.Observable<any>;    
    private clickStream: Rx.Observable<any>;   
    
    showDetails: Boolean;

    constructor(){
        this.removeItem = new EventEmitter(true);
    }

    ngAfterViewInit(){
        //we convert click events raised by Angular on <div> element to a stream                
        this.eventStream = Rx.Observable.fromEvent(this.trackerBody.nativeElement, "click");
        //1. buffer for 250ms. This will capture double click.
        //2. calculate number of events (clicks) from buffer
        //3. publish if it is double click.
        this.clickStream = this.eventStream.bufferWhen(() => this.eventStream.auditTime(250))
                    .map<any,number>((value: any[], index: number) => { 
                        return value.length;
                    })
                    .filter((value: number, index: number) => {
                        return value >= 2;
                    });

        this.clickStream.subscribe((value: any) => {
            this.showDetails = !this.showDetails;            
        })
    }

    sendRemoveItem(){
        this.removeItem.emit(this.data);
    }

    toggleUpdates(){
        this.data.pauseUpdates = !this.data.pauseUpdates;
    }
}