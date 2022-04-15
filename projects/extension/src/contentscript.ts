


const loadScript = async (scriptPath: string) => {
    return new Promise<void>((resolve, reject) => {
        let s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = chrome.extension.getURL(scriptPath);
        s.onload = function () {
            resolve();
        };
        (document.head || document.documentElement).appendChild(s);
    });
}

async function init() {
    await loadScript('custom-elements.js');
    await loadScript('runtime.js');
    await loadScript('page.js');
}

init();