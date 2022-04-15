
console.log('Looper: Page.js loaded.');

import { BehaviorSubject, Subject } from "rxjs";
import { LoopService } from '@richapps/looper-services';



const loopService = new LoopService();
loopService.checkVideo();


(window as any).markers = new BehaviorSubject<any>([]);
//s.parentNode.removeChild(s);
console.log('custom elements loaded');


// const timelineTarget = document.querySelector('.html5-video-player');
const timelineTarget = document.querySelector('.ytp-progress-bar-container');
if (timelineTarget) {
    var timeline = document.createElement('looper-timeline') as any;
    timeline.loopservice = loopService;

    timelineTarget.appendChild(timeline);

    const timeline2 = timelineTarget.querySelector('looper-timeline') as HTMLElement;
    
    if (timeline2) {
        timeline2.style.top = '-20px';
        timeline.loopservice = loopService;
        console.log('timeline ', document.querySelector('looper-timeline'));
        timeline.addEventListener('boom', (e: any) => {
            console.log('boom event', e);
        });
    }
}





const getElement = (sel: string) => {
    return new Promise<Element>((resolve, reject) => {
        const tryGet = () => {
            const renderer = document.querySelector(sel);
            if (!renderer) {
                setTimeout(() => {
                    tryGet();
                }, 1000);
            } else {
                resolve(renderer);;
            }
        }
        tryGet();
    });

};


async function init() {


    const renderer = (await getElement('#secondary')) as any;



    const list = document.createElement('looper-list') as any;
    list.loopservice = loopService;
    renderer.prepend(list);

    const list2 = document.querySelector('looper-list') as any;
    list2.loopservice = loopService;


}

init();
// const sec = document.querySelector("#secondary");


// const observer = new MutationObserver(function (mutations_list) {
//     mutations_list.forEach(function (mutation) {
//         mutation.removedNodes.forEach(function (removed_node) {
//             console.log(removed_node);
//             // if(removed_node.id == 'child') {
//             // 	console.log('#child has been removed');
//             // 	observer.disconnect();
//             // }
//         });
//     });
// });

// if (sec) {
//     observer.observe(sec, { subtree: false, childList: true });
// } else {
//     console.log('no secondary!!!');
// }





