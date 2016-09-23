import {Component, OnInit, EventEmitter} from "@angular/core";
import {TrackerListComponent} from "./tracker-list.component";
import {AddTrackerComponent} from "./add-tracker.component";
import {TrackerData} from "./tracker-data";
import {TickerData} from "./ticker-data";
import {TickerTrackerService} from "./ticker-tracker.service";
import * as  Rx from "rxjs/Rx";

@Component({    
    selector: "app-root",
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{

    trackedItems: TrackerData[];
    displayItems: TrackerData[];
    tickerSvc: TickerTrackerService;

    private searchEventSteam: Rx.Observable<string>;
    private searchInputStream: Rx.Observable<string>;
    private searchInputEvent: EventEmitter<string>;

    constructor(tickerService: TickerTrackerService){
        this.tickerSvc = tickerService;
        this.searchInputEvent = new EventEmitter<string>();
        this.trackedItems = [];
        this.displayItems = this.trackedItems;
    } 

    addItems(): void{
        this.trackedItems.push(this.tickerSvc.track("LON", "VOD"));
        this.trackedItems.push(this.tickerSvc.track("LON", "HSBA"));
        this.trackedItems.push(this.tickerSvc.track("CURRENCY", "GBPUSD"));
        this.trackedItems.push(this.tickerSvc.track("CURRENCY", "EURGBP"));
        this.trackedItems.push(this.tickerSvc.track("NASDAQ", "GOOG"));
        this.trackedItems.push(this.tickerSvc.track("NASDAQ", "AAPL"));        
        this.trackedItems.push(this.tickerSvc.track("NYSE", "SAP"));
        this.trackedItems.push(this.tickerSvc.track("NYSE", "GE"));
        this.trackedItems.push(this.tickerSvc.track("NSE", "TCS"));
        this.trackedItems.push(this.tickerSvc.track("NSE", "TATASTEEL"));        
    }

    ngOnInit(): void{
        this.addItems();
    }

    onSearchItem(term: string){
        let match: string = term.toUpperCase();
        this.displayItems = this.trackedItems.filter((value: TrackerData) => {
            return value.trackedTopic.indexOf(match) >= 0;
        });
    }

    onEndSearch(){
        this.displayItems = this.trackedItems;        
    }
           
    onAddItem(name: string){
        this.trackedItems.push(this.tickerSvc.trackByName(name.toUpperCase())); 
    }

    onRemoveItem(data: any){
        this.tickerSvc.untrack(data);

        let index: number = this.trackedItems.findIndex((value: TrackerData) => {
            return value.id == data.id;
        });

        if(index >= 0){
            this.trackedItems.splice(index, 1);                        
        }
    }    
}
