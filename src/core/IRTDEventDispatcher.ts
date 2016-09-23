import {IRTDClient} from "./IRTDClient";

export interface IRTDEventDispatcher<T>{
    addReceiver(id: string, receier: IRTDClient<T>): void;
    removeReceiver(id: string): void;
    newData(data: T): void;
}