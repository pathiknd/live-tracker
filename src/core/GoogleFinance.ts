/// <reference path="../typings/globals/jquery/index.d.ts" />

import {IDataSource} from "./IDataSource"
//import $ = require("jquery");

export class GoogleFinance implements IDataSource{
    private url: string;

    constructor(){
        this.url = "https://finance.google.com/finance/info?q=";
    }

    public pullUpdates(topics: string[], callback: (error: any, body: any, response: string) => void): void{
        let reqUrl: string = this.url;
        for(let i:number = 0; i < topics.length; i++){
            reqUrl = reqUrl + topics[i] + ",";
        }
        reqUrl = reqUrl.substring(0, reqUrl.length - 1);

        $.ajax({
               url: reqUrl,
               dataType: "jsonp"
            })
        .done((data: any, textStatus: string, jqXhr: any) => {
            callback(null, data, textStatus);
        })
        .fail((jqXhr: any, textStatus: string, error: any) => {
            callback(error, null, textStatus);
        });        

        // request(reqUrl, function(error: any, response: any, body: string){
        //     callback(error, body.substring(4), response);
        // });
    }
} 