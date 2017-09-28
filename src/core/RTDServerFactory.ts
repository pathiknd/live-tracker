import {IRTDServer} from "./IRTDServer";
import {MarketDataProvider} from "./MarketDataProvider";
import {MarketDataDispatcherFactory} from "./MarketDataDispatcherFactory";
import {MarketDataDummyExchange} from "./MarketDataDummyExchange";
import {GoogleFinance} from "./GoogleFinance";

export class RTDServerFactory<T>{

    static getServer(type: string, refreshRate?: number): IRTDServer<any>{
        switch(type){
            case "md-google-finance":
                return new MarketDataProvider(
                    refreshRate == null ? 20000 : refreshRate,
                    new MarketDataDispatcherFactory(),
                    new MarketDataDummyExchange()
                    //new GoogleFinance()
                )
            default:
                return null;
        }
    }
}