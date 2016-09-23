export interface IDataSource{
    pullUpdates(topics: string[], callback: (error: any, body: any, response: string) => void): void;
}