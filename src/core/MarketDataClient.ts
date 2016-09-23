/// <reference path="../../node_modules/@types/node/index.d.ts" />

import {IRTDClient} from "./IRTDClient";
import {SymbolData} from "./SymbolData";
import * as Events from "events"; 

export class MarketDataClient implements IRTDClient<SymbolData>{
    private updateEvent: Events.EventEmitter;

    constructor(){
        this.updateEvent = new Events.EventEmitter();
    }

    public dataUpdate(data: SymbolData){
        //console.log(data.symbol + ": " + data.lastTradePrice + " @ " + data.lastTradeTime + " -- " + data.changePercent + "%");
        this.updateEvent.emit("update", data);       
    }

    public onUpdate(listner: (data: SymbolData) => void){
        this.updateEvent.on("update", listner);
    }
}