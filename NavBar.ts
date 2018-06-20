/// <reference path="Menu.ts" />
/// <reference path="Time.ts" />

class NavBar {
    protected $elem: JQuery<HTMLElement>;
    //protected $burger: JQuery<HTMLElement>;

    constructor(
        protected id: string,
        protected menu: Menu
    ) {
    }

    public init(): void {
        this.$elem = $("#" + this.id);
        //this.$burger = this.$elem.find('.navbar-burger');
        
        this.menu.addOnActiveChangeListener((active: boolean) => this.onMenuActiveChange(active));

        //this.$burger.on("click", () => this.onBurgerClick());
    }

    // public get burgerLoading(): boolean {
    //     return this.$burger.hasClass("is-loading");
    // }
    // public set burgerLoading(value: boolean) {
    //     if (value) {
    //         this.$burger.addClass("is-loading");
    //     }
    //     else {
    //         this.$burger.removeClass("is-loading");
    //     }
    // }

    // protected onBurgerClick() {
    //     this.menu.toggle().then(
    //         (result: boolean): void => {
    //             if (!result) {
    //                 console.error("Burger click error: Toggle menu returned false.");
    //             }
    //         },
    //         (reason: any): void => {
    //             console.error("Burger click error: " + reason);
    //         }
    //     );
    // }
}