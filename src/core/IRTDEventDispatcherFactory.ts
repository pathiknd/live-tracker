import {IRTDEventDispatcher} from "./IRTDEventDispatcher";

export interface IRTDEventDispatcherFactory<T>{
    getDispatcher(dispId: string): IRTDEventDispatcher<T>;
}
