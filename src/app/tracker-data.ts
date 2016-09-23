export class TrackerData{
    public id: string;
    public trackedTopic: string;
    public title: string;
    public label1: string;
    public value1: string;
    public label2: string;
    public value2: string;
    public label3: string;
    public value3: string;
    public label4: string;
    public value4: string;

    public pauseUpdates: Boolean;
    public trackerState: string;

    constructor(id: string, topic: string){
        this.id = id;
        this.trackedTopic = topic;
        this.pauseUpdates = false;
        this.trackerState = "default";
    }
}