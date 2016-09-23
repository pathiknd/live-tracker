import {IDataSource} from "./IDataSource"

export class MarketDataDummyExchange implements IDataSource{

    public pullUpdates(topics: string[], callback: (error: any, body: string, response: string) => void): void{

    }
}