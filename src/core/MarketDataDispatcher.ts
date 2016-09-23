import {IRTDClient} from "./IRTDClient";
import {IRTDEventDispatcher} from "./IRTDEventDispatcher";
import {SymbolData} from "./SymbolData";

export class MarketDataDispatcher implements IRTDEventDispatcher<SymbolData> {
    private dispatcherId: string;
    private receivers: Object;

    constructor(id: string){
        this.dispatcherId = id;
        this.receivers = new Object();
    }

    public addReceiver(id: string, receiver: IRTDClient<SymbolData>){
        this.receivers[id] = receiver;
    }

    public removeReceiver(id: string){
        delete this.receivers[id];
    }
    
    public newData(data: SymbolData){
        for(var key in this.receivers){
            if(this.receivers.hasOwnProperty(key)){
                let rcv: IRTDClient<SymbolData> = this.receivers[key] as IRTDClient<SymbolData>;
                rcv.dataUpdate(data);
            }
        }
    }     
}