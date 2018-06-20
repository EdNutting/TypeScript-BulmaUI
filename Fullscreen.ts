namespace op_fullscreen {
    export function fullscreenAvailable(): boolean {
        if ('requestFullscreen' in document.documentElement ||
            'webkitRequestFullscreen' in document.documentElement ||
            'mozRequestFullScreen' in (<any>document.documentElement) ||
            'msRequestFullscreen' in (<any>document.documentElement)) {
            return true;
        }
        return false;
    }

    export function fullscreenActive(): boolean {
        return (document.fullscreenElement !== undefined && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement !== undefined && document.webkitFullscreenElement !== null) ||
            ((<any>document).mozFullScreenElement !== undefined && (<any>document).mozFullScreenElement !== null) ||
            ((<any>document).msFullscreenElement !== undefined && (<any>document).msFullscreenElement !== null);
    }

    export function getRequestFullscreenFunc(): () => void {
        if ('requestFullscreen' in document.documentElement) {
            return document.documentElement.requestFullscreen;
        }
        else if ('webkitRequestFullscreen' in document.documentElement) {
            return document.documentElement.webkitRequestFullscreen;
        }
        else if ('mozRequestFullScreen' in document.documentElement) {
            return (<any>document.documentElement).mozRequestFullScreen;
        }
        else if ('msRequestFullscreen' in document.documentElement) {
            return (<any>document.documentElement).msRequestFullscreen;
        }
        throw "Fullscreen not available.";
    }

    export function getExitFullscreenFunc(): () => void {
        if (document.exitFullscreen) {
            return document.exitFullscreen;
        }
        else if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen;
        }
        else if ((<any>document).mozCancelFullScreen) {
            return (<any>document).mozCancelFullScreen;
        }
        else if ((<any>document).msExitFullscreen) {
            return (<any>document).msExitFullscreen;
        }
        throw "Fullscreen not available.";
    }

    export function getOnFullscreenChangeName(): string {
        if ('onfullscreenchange' in document) {
            return "fullscreenchange";
        }
        else if ('onwebkitfullscreenchange' in document) {
            return "webkitfullscreenchange";
        }
        else if ('onmozfullscreenchange' in document) {
            return "mozfullscreenchange";
        }
        else if ('MSFullscreenChange' in document) {
            return "MSFullscreenChange";
        }
        throw "No fullscreen change event.";
    }

    export function getOnFullscreenErrorName(): string {
        if ('onfullscreenerror' in document) {
            return "fullscreenerror";
        }
        else if ('onwebkitfullscreenerror' in document) {
            return "webkitfullscreenerror";
        }
        else if ('onmozfullscreenerror' in document) {
            return "mozfullscreenerror";
        }
        else if ('MSFullscreenError' in document) {
            return "MSFullscreenError";
        }
        throw "No fullscreen error event.";
    }

    export function toggleFullscreen(): void {
        if (!fullscreenActive()) {
            getRequestFullscreenFunc().call(document.documentElement);
        } else {
            getExitFullscreenFunc().call(document);
        }
    }
}