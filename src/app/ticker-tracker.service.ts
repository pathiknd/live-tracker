import {Injectable} from "@angular/core";

import {IRTDServer} from "../core/IRTDServer";
import {MarketDataClient} from "../core/MarketDataClient";
import {RTDServerFactory} from "../core/RTDServerFactory";
import {SymbolData} from "../core/SymbolData";
import {TickerData} from "./ticker-data";
import {TrackerData} from "./tracker-data";

@Injectable()
export class TickerTrackerService{
    private mktDataSvc: IRTDServer<SymbolData>;
    private tickers: TickerData[];

    constructor(){
        this.mktDataSvc = RTDServerFactory.getServer("md-google-finance", 5000);
        this.tickers = [];        
    }

    public trackByName(name: string): TrackerData{
        let parts = name.split(":");
        return (parts.length == 2) ? this.track(parts[0], parts[1]) : null;
    }

    public track(exchange: string, ticker: string): TrackerData{

        let trackingId: string = this.tickers.length.toString();
        let fullTicker: string = exchange + ":" + ticker;

        let client: MarketDataClient = new MarketDataClient();
        this.mktDataSvc.addClient(trackingId, [fullTicker], client);

        let data: TickerData  = new TickerData(this.tickers.length.toString(), fullTicker, client);
        this.tickers.push(data);

        return data as TrackerData;
    }

    public untrack(data: TrackerData): void{
        this.mktDataSvc.removeClient(data.id, [data.trackedTopic]);

        this.tickers.slice(parseInt(data.id), 1);
    }
}