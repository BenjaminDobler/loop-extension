import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Loop, Marker } from '@richapps/looper-services';


@Component({
  selector: 'looper-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TimelineComponent {


  knobPosition = 0;
  duration = 0;
  currentTime = 0;
  progress = 0;

  @Input('loopservice')
  public loopservice: any;

  @ViewChild('timelineContainer') public timelineContainer!: ElementRef<HTMLDivElement>;

  public containerWidth = 0;

  constructor(private ref: ChangeDetectorRef, private el: ElementRef) { }

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

  ngAfterViewInit() {
    const ro = new ResizeObserver( entries => {
      for (let entry of entries) {
        console.log('resize', entry);
        const width = entry.contentRect.width;
        this.containerWidth = width;
        // const width = entry.contentBoxSize ? entry.contentBoxSize.inlineSize : entry.contentRect.width;
       
        // if (entry.target.tagName === 'H1') {
        //   entry.target.textContent = width < 1000 ? '😱😱😱' : '😊😊😊';  
        // }
        
        // if (entry.target.tagName === 'H2' && width < 500) {
        //   entry.target.textContent = 'I won"t change anymore'; 
        //   ro.unobserve(entry.target); // stop observing this element when it's size will reach 500px
        // }
      }
    });
    
    // we can add more than one element to observe
    ro.observe(this.timelineContainer.nativeElement);

    this.containerWidth = this.timelineContainer.nativeElement.getBoundingClientRect().width;
    window.addEventListener('resize', () => {
      this.containerWidth = this.timelineContainer.nativeElement.getBoundingClientRect().width;
    });
  }

  getKnobPosition() {
    return (this.loopservice.currentPercentage.getValue() / 100) * this.containerWidth;
  }

  getMarkerPosition(marker: Marker) {
    return (marker.percentage / 100) * this.containerWidth;
  }

  getLoopPosition(loop: Loop) {
    return (loop.start.percentage / 100) * this.containerWidth;
  }

  getLoopWidth(loop: Loop) {
    const duration = loop.end.time - loop.start.time;
    const p = duration / this.loopservice.duration.getValue();
    return p * this.containerWidth;
  }

  startLoop(loop: Loop) {
    this.loopservice?.startLoop(loop);
  }

  addMarker() {
    this.loopservice.addMarkerAtCurrentTime();
  }
}



