import {TrackerData} from "./tracker-data";
import {IRTDClient} from "../core/IRTDClient";
import {SymbolData} from "../core/SymbolData";
import {EventEmitter} from "@angular/core";

export class TickerData extends TrackerData {
    private mktDataClient: IRTDClient<SymbolData>;    

    constructor(id: string, topic: string, client: IRTDClient<SymbolData>){
        super(id, topic);
        this.mktDataClient = client;

        this.label1 = "Last Price";
        this.label2 = "Time";
        this.label3 = "Change";  

        this.trackerState = "default";      

        this.mktDataClient.onUpdate((data: SymbolData) => {
            if(!this.pauseUpdates){
                this.value1 = data.lastTradePrice.toString();                
                this.value2 = data.lastTradeTime.toString().replace("T"," ").replace("Z","");
                this.value3 = data.changePercent.toString();

                this.trackerState = data.changePercent > 0 ? this.trackerState = "up" : this.trackerState = "down";
            }                                   
        });
    }
}