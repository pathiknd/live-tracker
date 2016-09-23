import {IRTDEventDispatcherFactory} from "./IRTDEventDispatcherFactory";
import {IRTDEventDispatcher} from "./IRTDEventDispatcher";
import {MarketDataDispatcher} from "./MarketDataDispatcher";
import {SymbolData} from "./SymbolData";

export class MarketDataDispatcherFactory implements IRTDEventDispatcherFactory<SymbolData>{
    public getDispatcher(id: string): IRTDEventDispatcher<SymbolData>{
        return new MarketDataDispatcher(id);
    }
}