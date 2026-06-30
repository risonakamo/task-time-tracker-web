export namespace main {
	
	export class StartTaskReq {
	    title: string;
	
	    static createFrom(source: any = {}) {
	        return new StartTaskReq(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	    }
	}
	export class TTTState {
	    currentTaskValid: boolean;
	    currentTask: ttt.TimeEntry;
	    allTasks: ttt.TimeEntry[];
	    dayContainers: ttt.DayContainer[];
	
	    static createFrom(source: any = {}) {
	        return new TTTState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentTaskValid = source["currentTaskValid"];
	        this.currentTask = this.convertValues(source["currentTask"], ttt.TimeEntry);
	        this.allTasks = this.convertValues(source["allTasks"], ttt.TimeEntry);
	        this.dayContainers = this.convertValues(source["dayContainers"], ttt.DayContainer);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace ttt {
	
	export class TimeEntry {
	    id: string;
	    title: string;
	    timeStart: number;
	    timeEnd: number;
	    duration: number;
	
	    static createFrom(source: any = {}) {
	        return new TimeEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.timeStart = source["timeStart"];
	        this.timeEnd = source["timeEnd"];
	        this.duration = source["duration"];
	    }
	}
	export class DayContainer {
	    dateKey: string;
	    date: number;
	    entries: TimeEntry[];
	    totalDuration: number;
	
	    static createFrom(source: any = {}) {
	        return new DayContainer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dateKey = source["dateKey"];
	        this.date = source["date"];
	        this.entries = this.convertValues(source["entries"], TimeEntry);
	        this.totalDuration = source["totalDuration"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class TimeEntryEdit {
	    id: string;
	    title: string;
	    timeStart: number;
	    timeEnd: number;
	
	    static createFrom(source: any = {}) {
	        return new TimeEntryEdit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.timeStart = source["timeStart"];
	        this.timeEnd = source["timeEnd"];
	    }
	}

}

