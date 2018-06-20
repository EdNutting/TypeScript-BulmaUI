/// <reference path="../../../../api/static/api/ts/api_client.d.ts" />
/// <reference path="Modal.ts" />
/// <reference path="NavBar.ts" />
/// <reference path="Tabs.ts" />
/// <reference path="Globals.ts" />

function logStage(name: string) {
    console.log("------ " + name + " ------");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

enum ErrorReasons {
    UNKNOWN,
    FORBIDDEN,
    SERVER_ERROR
}

class App {
    public navbar: NavBar;

    public apiClient: api.APIClient;

    public ignoreNextHashChange: Array<string> = [];

    protected $loadingModal: JQuery<HTMLElement>;

    public lastKnownErrorReason: ErrorReasons = ErrorReasons.UNKNOWN;

    constructor() {
        $("#loading-modal-javascript-warning").css("opacity", 0);
    }

    public init(): void {
        this.$loadingModal = $("#loading-modal");
        this.$loadingModal.find(".modal-close").on("click", () =>
            this.hideLoadingModal(this.loadingModalCallCount));

        this.navbar = new NavBar("navbar-main");
        this.navbar.init();

        this.apiClient = new api.APIClient();

        window.addEventListener("hashchange", (evt: HashChangeEvent) => this.onHashChange(evt));

        $(".dropdown")
            .on("click", (event) => {
                if ($.contains($(event.target).parents(".dropdown")[0], document.activeElement)) {
                    $(event.target).parents(".dropdown").addClass("is-active");
                }
                else {
                    $(event.target).parents(".dropdown").removeClass("is-active");
                }
            })
            .find(".dropdown-trigger button")
            .on("focus", (event) => {
                $(event.target).parents(".dropdown").addClass("is-active");
            })
            .on("blur", (event) => {
                $(event.target).parents(".dropdown").removeClass("is-active");
            });

        if (getCookie("hide-cookie-notice") != "") {
            $("#cookie-notice-close").parent().remove();
        }
        else {
            $("#cookie-notice-close").on("click", () => {
                $("#cookie-notice-close").parent().remove();
                setCookie("hide-cookie-notice", "true", 365);
            });
        }
    }

    public load(): Promise<boolean> {
        return this.loadFromHash();
    }

    public onHashChange(evt: HashChangeEvent): void {
        this.loadFromHash(); // TODO: Handle success/failure
    }

    public loadFromHash(): Promise<boolean> {
        if (this.ignoreNextHashChange.indexOf(window.location.hash) > -1) {
            this.ignoreNextHashChange = this.ignoreNextHashChange.filter(item => item === window.location.hash);
            return Promise.resolve(true);
        }

        logStage("Hash changed: " + window.location.hash);

        let hash = window.location.hash.substr(1);
        let hashParts = hash.split("_");

        let loadingModalCallNum = this.showLoadingModal();

        // let loadMenuPromise = Promise.resolve(true);

        // if (hashParts[0] == "menu") {
        //     logStage("Load Menu");

        //     loadMenuPromise = this.menu.show(hash);
        // }
        // else {
        //     this.menu.hide(false);
        // }

        return resolveAllBooleans([/*loadMenuPromise*/]);
    }

    private loadingModalCallCount = 0;
    public showLoadingModal(): number {
        this.loadingModalCallCount++;
        this.$loadingModal.addClass("is-active");
        return this.loadingModalCallCount;
    }
    public hideLoadingModal(callNum: number) {
        if (callNum == this.loadingModalCallCount) {
            this.$loadingModal.removeClass("is-active");
        }
    }
}

$(function () {
    app = new App();

    function load() {
        // Break stack to prevent overflow
        setTimeout(attemptLoad, 1);
    }

    function attemptLoad() {
        try {
            let loadPromise = app.load();
            loadPromise.then(
                (result: boolean) => {
                    if (!result) {
                        failLoad("App load returned false. Last known error reason:" + app.lastKnownErrorReason);
                    }
                },
                (error: any) => {
                    failLoad(error);
                });

        }
        catch (e) {
            console.error(e);
            failLoad(e);
        }
    }

    function failLoad(reason: string) {
        console.error(reason);
        if (app.lastKnownErrorReason == ErrorReasons.FORBIDDEN) {
            app.lastKnownErrorReason = ErrorReasons.UNKNOWN;
            let redirectToLogin = () => {
                window.location.assign("/accounts/login");
            };
            let modal = new ErrorModal("modal-not-logged-in", redirectToLogin, redirectToLogin);
            modal.init();
            modal.show();
        }
        else {
            let modal = new ErrorModal("modal-app-load-failed", load, load);
            modal.init();
            modal.show();
        }
    }

    app.init();

    load();
});
