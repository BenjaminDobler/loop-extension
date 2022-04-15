import { ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Loop, Marker } from "@richapps/looper-services";
import { LoopService } from "@richapps/looper-services";

@Component({
    selector: 'loop-list',
    templateUrl: './looplist-component.html',
    styleUrls: ['./looplist-component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class LoopList {


    @Input('loopservice')
    public loopservice: LoopService | undefined;

    constructor(private ref: ChangeDetectorRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.loopservice) {
            changes.loopservice.currentValue.currentPercentage.subscribe((v: any) => {
                this.ref.detectChanges();
            });
            changes.loopservice.currentValue.currentTime.subscribe((v: any) => {
                this.ref.detectChanges();
            });
            changes.loopservice.currentValue.duration.subscribe((v: any) => {
                this.ref.detectChanges();
            });
        }
    }

    addMarker() {
        this.loopservice?.addMarkerAtCurrentTime();
    }

    setMarkerToCurrentTime(marker: Marker) {
        this.loopservice?.setMarkerToCurrentTime(marker);
    }

    goToPosition(marker: Marker) {
        this.loopservice?.setTime(marker.time);
    }

    startLoop(loop: Loop) {
        this.loopservice?.startLoop(loop);
    }

    updateMarkerName(marker: Marker, e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.loopservice?.updateMarkerName(marker, e.target.value);
    }

    removeMarker(marker: Marker) {
        this.loopservice?.removeMarker(marker);
    }

    changeLoopPlaybackSpeed(loop: Loop, event: any) {
        this.loopservice?.changeLoopPlaybackSpeed(loop, event.target.value);
    }

    updateLoopName(loop: Loop, name: string ) {
        console.log('update Loop name');
        this.loopservice?.updateLoopName(loop, name);
    }


}
