import {IDataSource} from "./IDataSource"

export class MarketDataDummyExchange implements IDataSource{

    private prices: Object;

    constructor(){
        this.prices = new Object();
    }

    public pullUpdates(topics: string[], callback: (error: any, body: string, response: string) => void): void{
        let jsonObj: Object = new Object();

        for(var i in topics){
            let topic:string = topics[i];
            let topicObj: Object = new Object();
            if(!this.prices.hasOwnProperty(topic)){
                this.prices[topic] = ((new Date().getMilliseconds()) *  Number.parseFloat(Math.random().toFixed(2)));
            }
            var parts: any = topic.split(":");
            topicObj["t"] = parts[1];
            topicObj["e"] = parts[0];
            var change: number;
            var currentPrices: number = this.prices[topic];
            var changePercent: number = 0;
            if(Math.random() > 0.5){
                changePercent = 0.01;
            } else {
                changePercent = -0.01;
            }
            var nextPrice = (currentPrices + (currentPrices * changePercent));
            this.prices[topic] = nextPrice;
            topicObj["l"] =  nextPrice.toFixed(2);
            topicObj["cp"] = changePercent;
            topicObj["lt_dts"] = new Date();          
            jsonObj[i] = topicObj;
        }

        callback(null, JSON.stringify(jsonObj), JSON.stringify(jsonObj));
    }
}