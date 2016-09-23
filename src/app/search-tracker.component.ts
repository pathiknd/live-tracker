import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import * as  Rx from "rxjs/Rx";

@Component({    
    selector: "search-tracker",
    templateUrl: "search-tracker.component.html"
})
export class SearchTrackerComponent{
    @Output() searchItem: EventEmitter<string>;
    @Output() endSearch: EventEmitter<void>;
    private keyUpEvent: EventEmitter<number>;
    name: string;

    private keyUpEventSteam: Rx.Observable<string>;    

    constructor(){
        this.searchItem = new EventEmitter<any>(true);
        this.endSearch = new EventEmitter<any>(true);
        this.name = "";
        //internal keyUp event
        this.keyUpEvent = new EventEmitter<number>(true);
        //set-up stream.
        //1. wait for 300ms to ensure we capture few key strokes before performing search
        //2. filter will stop processing if there are less than two characters in search box
        //3. fire search or endSearch based on key pressed. 27 is ESC key code.        
        this.keyUpEventSteam = this.keyUpEvent
                    .asObservable()
                    .debounceTime(300)
                    .filter((keyCode: number) => {                        
                        return keyCode == 27 ? true : this.name.length != 1;
                    })
                    .map((keyCode: number, index: number) => {
                        return (keyCode == 27 || this.name.length == 0) ? "end" : "search";
                    })                   
                    

        this.keyUpEventSteam.subscribe((targetEvent: string) => {
            targetEvent == "search" ? this.searchItem.emit(this.name) : this.sendEndSearch();
        })
    }

    sendEndSearch(){
        this.name = "";
        this.endSearch.emit();
    }

    //this is called by Angular. We put this on our keyUp event stream and return.    
    onKeyUp(event: any){
        this.keyUpEvent.next(event.keyCode);                        
    }
}