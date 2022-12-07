import { BehaviorSubject } from "rxjs";

export interface VideoData {
    currentPercentage: number;
    currentTime: number;
    duration: number;
}

export interface Marker {
    time: number;
    percentage: number;
    name?: string;
    id: number;
    index?: number;
}

export interface Loop {
    start: Marker;
    end: Marker;
    active: boolean;
    playbackSpeed: number;
    name?: string;
}


export class LoopService {

    extensionID = 'dgldkjmpjmijfajkjnlfehpihcdjocih';


    markers = new BehaviorSubject<Marker[]>([]);
    loops = new BehaviorSubject<Loop[]>([]);

    history: { markers: Marker[], loops: Loop[] }[] = [];

    currentTime = new BehaviorSubject<number>(0);
    currentPercentage = new BehaviorSubject<number>(0);
    duration = new BehaviorSubject<number>(0);

    videoData = new BehaviorSubject<VideoData>({ duration: 0, currentPercentage: 0, currentTime: 0 });
    activeLoop: any;
    private _id = 0;

    private _currentTime = 0;
    private _duration = 0;
    private _currentPercentage = 0;
    private _currentVideo: HTMLVideoElement | null = null;

    constructor() {
        this.restore();
        this.watchLocation();
    }

    watchLocation() {
        var oldHref = document.location.href;
        let oldYoutubeId = getYoutubeId(document.location.href);

        window.onload =  () => {
            const bodyList = document.querySelector("body") as Node;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (oldHref != document.location.href) {
                        console.log('Location changed ', document.location.href);
                        oldHref = document.location.href;
                        /* Changed ! your code here */
                        const youtubeID = getYoutubeId(document.location.href);
                        if (youtubeID !== oldYoutubeId) {
                            console.log('youtube id changed ', youtubeID);
                            this.restore();
                            oldYoutubeId = youtubeID;
                        }
                        console.log('youtube id ', youtubeID);
                    }
                });
            });

            var config = {
                childList: true,
                subtree: true
            };

            observer.observe(bodyList, config);
        };
    }

    addMarkerAtCurrentTime() {

        const newMarker = {
            time: this.currentTime.getValue(),
            percentage: this.currentPercentage.getValue(),
            id: this.getId()
        }

        let newMarkers = [...this.markers.getValue(), newMarker];

        newMarkers = newMarkers.sort((a, b) => {
            return a.time - b.time;

        });

        const newMarkerIndex = newMarkers.indexOf(newMarker);

        const nextMarker = newMarkers.length > newMarkerIndex + 1 ? newMarkers[newMarkerIndex + 1] : null;
        const previousMarker = newMarkerIndex - 1 >= 0 ? newMarkers[newMarkerIndex - 1] : null;

        let newLoop: Loop;
        let newLoops = [...this.loops.getValue()];
        if (!nextMarker && previousMarker) {
            newLoop = {
                start: previousMarker,
                end: newMarker,
                active: false,
                playbackSpeed: 1,
                name: ''
            }
            newLoops.push(newLoop)
        } else if (nextMarker && !previousMarker) {
            newLoop = {
                start: newMarker,
                end: nextMarker,
                active: false,
                playbackSpeed: 1,
                name: ''
            }
            newLoops.push(newLoop)
        } else if (nextMarker && previousMarker) {
            const existingLoop = newLoops.find(l => l.start.id === previousMarker.id && l.end.id === nextMarker.id);
            if (existingLoop) {
                existingLoop.end = newMarker;
            }
            newLoop = {
                start: newMarker,
                end: nextMarker,
                active: false,
                playbackSpeed: 1,
                name: ''
            }
            newLoops.push(newLoop);
        }

        newLoops = newLoops.sort((a, b) => {
            return a.start.time - (b.start?.time | 0);

        });

        newMarkers = newMarkers.map((m, index) => ({ ...m, index }));
        this.markers.next(newMarkers);
        this.loops.next(newLoops);
        this.store();
    }

    removeMarker(marker: Marker) {
        let markers = this.markers.getValue();
        let loops = this.loops.getValue();
        const markerIndex = markers.indexOf(marker);
        const nextMarker = markers.length > markerIndex + 1 ? markers[markerIndex + 1] : null;
        const previousMarker = markerIndex - 1 >= 0 ? markers[markerIndex - 1] : null;

        if (nextMarker && previousMarker) {
            const prevLoop = loops.find(l => l.end.id === marker.id);
            const nextLoop = loops.find(l => l.start.id === marker.id);
            if (prevLoop && nextLoop) {
                loops = loops.filter(l => l !== nextLoop);
                prevLoop.end = nextMarker;
            }
            markers = markers.filter(m => m !== marker);
        } else if (nextMarker) {
            const nextLoop = loops.find(l => l.start.id === marker.id);
            if (nextLoop) {
                loops = loops.filter(l => l !== nextLoop);
            }
            markers = markers.filter(m => m !== marker);
        } else if (previousMarker) {
            const prevLoop = loops.find(l => l.end.id === marker.id);
            if (prevLoop) {
                loops = loops.filter(l => l !== prevLoop);
            } else {
                console.log('nope ');
            }
            markers = markers.filter(m => m !== marker);
        } else {
            markers = markers.filter(m => m !== marker);
        }

        this.markers.next(markers);
        this.loops.next(loops);
        this.store();
    }

    getId() {
        this._id++;
        return this._id;
    }

    checkVideo() {
        const doCheck = () => {
            const video = document.querySelector('video');
            if (this._currentVideo !== video) {
                console.log('video element changed');
                if (video) {
                    console.log('new video element found!');
                    this.updateVideo();
                }
                this._currentVideo = video;
            }
            setTimeout(() => {
                doCheck();
            }, 2000);
        }

        doCheck();

    }

    setTime(time: number) {
        if (this._currentVideo) {
            this._currentVideo.currentTime = time;
        }
    }

    setMarkerToCurrentTime(marker: Marker) {
        marker.time = this.currentTime.getValue();
        marker.percentage = this.currentPercentage.getValue();
        this.markers.next(this.markers.getValue());
        this.store();
    }

    updateMarkerName(marker: Marker, name: string) {
        marker.name = name;
        this.markers.next(this.markers.getValue());
        this.store();
    }

    updateLoopName(loop: Loop, name: string) {
        loop.name = name;
        this.loops.next(this.loops.getValue());
        this.store();
    }

    changeLoopPlaybackSpeed(loop: Loop, value: any) {
        loop.playbackSpeed = value;
        this.loops.next(this.loops.getValue());
        this.store();
    }
    updateVideo() {
        const video = document.querySelector('video');
        this._duration = video?.duration || 0;
        this._currentTime = video?.currentTime || 0;
        this.duration.next(this._duration);

        video?.addEventListener('loadedmetadata', () => {
            this._duration = video?.duration || 0;
            this.duration.next(this._duration);
        });
        video?.addEventListener('timeupdate', (e) => {
            this._currentTime = video?.currentTime || 0;
            this._currentPercentage = (this._currentTime / this._duration) * 100;
            this.currentTime.next(this._currentTime);
            this.currentPercentage.next(this._currentPercentage);
            this._duration = video?.duration;
            this.duration.next(this._duration);

            this.videoData.next({ ...this.videoData.getValue(), currentPercentage: this._currentPercentage, currentTime: this._currentTime, duration: this._duration });

            if (this.activeLoop && video) {
                const startMarker = this.activeLoop.start;
                const endMarker = this.activeLoop.end;
                if (video.currentTime >= endMarker.time) {
                    video.currentTime = startMarker.time;
                }
            }

        });
    }

    startLoop(loop: Loop) {
        if (this.activeLoop === loop) {
            loop.active = false;
            this.activeLoop = null;
            return;
        }
        if (this.activeLoop) {
            this.activeLoop.active = false;
        }
        this.activeLoop = loop;
        const video = this._currentVideo;
        this.activeLoop.active = true;
        if (video) {
            const startMarker = loop.start;
            const endMarker = loop.end;
            video.currentTime = startMarker.time;
        }

    }

    store() {
        try {
            this.sendUpdate();
        } catch (e) {
            console.log('error');
        }
        const youtubeId = getYoutubeId(window.location.href);
        const currentData = {
            loops: this.loops.getValue(),
            markers: this.markers.getValue()
        };
        localStorage.setItem('loops-' + youtubeId, JSON.stringify(currentData));

        this.history.push(currentData);
    }

    restore() {
        const youtubeId = getYoutubeId(window.location.href);
        const data = localStorage.getItem('loops-' + youtubeId);
        if (data) {
            const parsed = JSON.parse(data);
            this.loops.next(parsed.loops);
            this.markers.next(parsed.markers);
        } else {
            console.log('set empty');
            this.loops.next([]);
            this.markers.next([]);
            this.activeLoop = null;
        }
    }

    sendUpdate() {
        chrome.runtime.sendMessage(this.extensionID, { data: this.videoData.getValue() }, (response: any) => {
            console.log('response');
        });
    };

}



const getYoutubeId = (url: any) => {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}