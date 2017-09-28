import {IRTDServer} from "./IRTDServer";
import {IRTDClient} from "./IRTDClient";
import {IRTDEventDispatcher} from "./IRTDEventDispatcher";
import {IRTDEventDispatcherFactory} from "./IRTDEventDispatcherFactory";
import {SymbolData} from "./SymbolData";
import {IDataSource} from "./IDataSource";
import * as  Rx from "rxjs/Rx";  
import * as ES6Promise from "es6-promise";

export class MarketDataProvider implements IRTDServer<SymbolData> {

    //Parameters fed by consumer
    private refreshRate: number;
    private dispatcherFactory: IRTDEventDispatcherFactory<SymbolData>;
    private dataSource: IDataSource;

    //internal private members
    private dispatchers: Object;
    private streamingOn: Boolean;
    private symbols: string[];

    private responseStream: Rx.Observable<SymbolData>;
    private responseSubscription: Rx.Subscription;

    constructor(refreshRate: number, 
            dispatcherFactory: IRTDEventDispatcherFactory<SymbolData>,
            dataSource: IDataSource){
        this.refreshRate = refreshRate;
        this.dispatcherFactory = dispatcherFactory;
        this.streamingOn = false;
        this.dispatchers = new Object();
        this.symbols = [];
        this.dataSource = dataSource;
    }
    
    private setUpStreams(){
        //1. every 5 seconds raise an event.
        //2. pull data from data source i.e. Google Finance APIs
        //3. Map to JSON (optional)
        //4. Transform to our model - SymbolData
        //5. Convert collection of SymbolData[] in to a series of items on output streaming
        //6. notify clients for each update.       
        let firstStream: Rx.Observable<number> = Rx.Observable.interval(this.refreshRate); 
        
        this.responseStream = firstStream.mergeMap<number, string>((value: number, index: number) => {
                    return Rx.Observable.fromPromise(new Promise(
                            (resolve: (val? : string) => void, reject: (resoan? :any) => void) => {
                                this.dataSource.pullUpdates(this.symbols, (error: any, body: any, response: string) => {
                                    error ? reject(error) : resolve(body);
                                });
                            }));
            })
            .map<string, Object>((body: any) => {
                //return JSON.parse(body);
                return JSON.parse(body);
                //return body;
            })
            .map<Object, SymbolData[]>((responseObjs: JSON) => {
                let objs: SymbolData[] = [];
                for(var i in responseObjs){
                    let data: SymbolData = new SymbolData();
                    let resData = responseObjs[i];
                    data.symbol = resData["t"];                       
                    data.lastTradePrice = resData["l"];
                    data.lastTradeTime = resData["lt_dts"];
                    data.exchange = resData["e"];
                    data.changePercent = resData["cp"];
                    objs.push(data);
                }
                return objs;                
            })
            .flatMap<SymbolData[],SymbolData>((updates: SymbolData[]) => {
                return updates;
            });

        //disptach newData event to all clients.
        this.responseSubscription = this.responseStream.subscribe((data: SymbolData) => {
            if(data !== null){
                let dispatcher: IRTDEventDispatcher<SymbolData> = this.getDispatcherFromSymbol(data.getFullSymbolName()); 
                if(dispatcher !== null){
                    dispatcher.newData(data);
                }
            }
        });
    }

    private addDispatcher(symbol: string): IRTDEventDispatcher<SymbolData>{

        let dispatcher: IRTDEventDispatcher<SymbolData> = this.dispatcherFactory.getDispatcher(symbol);
        this.dispatchers[symbol] = dispatcher;
        return dispatcher;
    }

    private getDispatcherFromSymbol(symbol: string): IRTDEventDispatcher<SymbolData>{
        return this.dispatchers.hasOwnProperty(symbol) ? 
            this.dispatchers[symbol] as IRTDEventDispatcher<SymbolData> : null;
    }

    private trackSymbol(symbol: string): void{
        if(this.symbols.findIndex((x: string) => { return x === symbol}) < 0){
            this.symbols.push(symbol);
        }
    }

    private untrackSymbol(symbol: string): void{
        let index: number = this.symbols.findIndex((x: string) => { return x === symbol});
        if(index >= 0){
            this.symbols.slice(index, 1);
        }
    }

    //IRealTimeDataProvider Interface
    public addClient(id: string, args: string[], receiver: IRTDClient<SymbolData>){
        
        let symbol = args[0];

        let dispatcher: IRTDEventDispatcher<SymbolData> = this.getDispatcherFromSymbol(symbol);

        if(dispatcher === null){
            dispatcher = this.addDispatcher(symbol);
        }
        
        dispatcher.addReceiver(id, receiver);

        this.trackSymbol(symbol);

        if(!this.streamingOn){
            this.setUpStreams();
            this.streamingOn = true;
        }
    }

    public removeClient(id: string, args: string[]){

        let symbol = args[0];

        let dispatcher: IRTDEventDispatcher<SymbolData> = this.getDispatcherFromSymbol(symbol);

        if(dispatcher != null){
            dispatcher.removeReceiver(id);
        }
    }    
}