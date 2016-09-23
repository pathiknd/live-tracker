export class SymbolData{
    public symbol: string;
    public exchange: string;
    public lastTradePrice: number;
    public lastTradeTime: Date;
    public change: number;
    public changePercent: number;

    public getFullSymbolName(){
        return this.exchange + ":" + this.symbol;
    }
}
