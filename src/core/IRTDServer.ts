import {IRTDClient} from "./IRTDClient";

export interface IRTDServer<T>{
    addClient(id: string, args: string[], receiver: IRTDClient<T>): void;
    removeClient(id: string, args: string[]): void;    
}