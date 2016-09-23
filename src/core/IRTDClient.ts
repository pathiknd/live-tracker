export interface IRTDClient<T>{
    dataUpdate(data: T): void;
    onUpdate(handler: (data: T) => void): void;     
}