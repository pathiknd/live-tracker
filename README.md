# Design

Page is composed of a group of angular components.

![Page Composition](/images/page.png)

App design:

![App Design](/images/live-tracker-design.png)


# RxJS Usage

Following code snippet shows the search functionality carried out as user types using Rx.

```javascript
//this is called by Angular. We put this on our keyUp event stream and return.    
onKeyUp(event: any){    
	this.keyUpEvent.next(event.keyCode);        
}

//internal keyUp event
this.keyUpEvent = new EventEmitter<number>(true);
//set-up stream.
//1. convert internal keyUpEvent to a stream
//2. wait for 300ms to ensure we capture few key strokes before performing search
//3. filter will stop processing if there are less than two characters in search box
//4. fire search or endSearch based on key pressed. 27 is ESC key code.
this.keyUpEventSteam = this.keyUpEvent
                    .asObservable()
                    .debounceTime(300)
                    .filter((keyCode: number) => {                        
                        return keyCode == 27 ? true : this.name.length != 1;
                    })
                    .map((keyCode: number, index: number) => {
                        return (keyCode == 27 || this.name.length == 0) ? "end" : "search";
                    })                   
                    
//raise appropriate event
this.keyUpEventSteam.subscribe((targetEvent: string) => {
	targetEvent == "search" ? this.searchItem.emit(this.name) : this.sendEndSearch();
});

//searchItem event handler in parent component
onSearchItem(term: string){
	let match: string = term.toUpperCase();
    this.displayItems = this.trackedItems.filter((value: TrackerData) => {
    	return value.trackedTopic.indexOf(match) >= 0;
	});
}
```

Following code snippet is for toggling between Highlight and Details view on double-click using Rx.

```javascript	
//we convert click events raised by Angular on <div> element to a stream
this.eventStream = Rx.Observable.fromEvent(this.trackerBody.nativeElement, "click");
//1. buffer for 250ms. This will capture double click.
//2. calculate number of events (clicks) from buffer
//3. publish if it is double click.
this.clickStream = this.eventStream.bufferWhen(() => this.eventStream.auditTime(250))
                    .map<number>((value: any[], index: number) => { 
                        return value.length;
                    })
                    .filter((value: number, index: number) => {
                        return value >= 2;
                    });

//toggle details view. "showDetails" is a bound property so Angular will toggle the view.	 
this.clickStream.subscribe((value: any) => {
	this.showDetails = !this.showDetails;            
})
```

Pulling data from Google Finance using Rx.

```javascript
//1. every 5 seconds raise an event.
//2. pull data from data source i.e. Google Finance APIs
//3. Map to JSON (optional)
//4. Transform to our model - SymbolData
//5. Convert collection of SymbolData[] in to a series of items on output streaming
//6. notify clients for each update.        
this.responseStream = Rx.Observable.interval(this.refreshRate)
	.flatMap<string>((value: number) => {
    	return Rx.Observable.fromPromise(new Promise(
        	(resolve: (val? : string) => void, reject: (resoan? :any) => void) => {
            	this.dataSource.pullUpdates(this.symbols, (error: any, body: any, response: string) => {
                	error ? reject(error) : resolve(body);
                });
            }));
	})
    .map<Object>((body: any) => {
    	//return JSON.parse(body);
        return body;
	})
    .map<SymbolData[]>((responseObjs: JSON) => {
    	let objs: SymbolData[] = [];
        for(var i in responseObjs){
        	let data: SymbolData = new SymbolData();
            let resData = responseObjs[i];
            data.symbol = resData["t"];                       
            data.lastTradePrice = resData["l"];
            data.lastTradeTime = resData["lt_dts"];
            data.changePercent = resData["cp"];
            data.exchange = resData["e"];
            objs.push(data);
		}
    	return objs;                
	})
    .flatMap<SymbolData>((updates: SymbolData[]) => {
    	return updates;
	});

	//disptach newData event to all clients
    this.responseSubscription = this.responseStream.subscribe((data: SymbolData) => {
    	if(data !== null){
        	let dispatcher: IRTDEventDispatcher<SymbolData> = this.getDispatcherFromSymbol(data.getFullSymbolName()); 
            if(dispatcher !== null){
            	dispatcher.newData(data);
			}
		}
	});
```

# Problems faced during development

* Using npm modules written in Javascript in TypeScript with type safety is not straightforward at the moment. The current scenario is confusing with two tools for that: tsd (or DefinitelyTyped) and typings. typings is the recommeded approach, but good news is this is changing. TypeScript 2.0 has integrated this with npm so you can install the type definitions using npm only. e.g. the following command will install type declarations for node and then you can use Node feature in type safe way.

```
npm install --save @types\node
```

* Bundling Angular 2 app with Webpack was running in to issues at runtime. I followed the steps given on Angular 2 website but it dind't work for me. However, the good news is that angular-cli takes care of all that now. It lets you create project scaffolding, build and bundle with Webpack and keep webpack-dev-server running while you develop.

```
This will create scaffolding.

>ng new hello-world

Now go to the directory and build

>ng build

And start the server so that you can launch your app in browser. The server will automatically re-build when you change your source code and the page will be refreshed in the browser.

>ng serve
```
angular-cli is still in beta phase but I haven't faced any issue using it. It makes the whole development experience very smooth and lets you focus core job.

# What I liked

* Thanks to TypeScript, being able to write "OO" code for Javascript was great. I used generics, interfaces, etc. It lets you organize your code in very structured way - the way you normally see in OO languages like C#, Java, etc. I was able to implement some patters like Observer and Command in TypeScript.

* Rx is very powerful. It is a bit difficult to start but once you get used to thinking in terms of streams and operators, it makes lot of problems a lot easier to solve.

* angular-cli: it makes the app development a lot easier. There are number of components you have to bring togather to make it work like TypeScript compiler, webpack, typings, webpack-dev-server, etc. angular-cli lets you use all that with simple commands.

* Chrome lets you debug Typescript code so combination of webpack-dev-server and Chrome makes it easy to debug code during development.

* I do not have experience with Angular 1.x so I can't comment how Angular 2 is different. But Angular 2 app looks very organized and managable - provided you break it down to smaller components and keep them separate as Angular 2 recommends. It was very easy to write smaller components and then compose them in a root component on the page. 