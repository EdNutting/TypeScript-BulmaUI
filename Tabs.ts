// TODO: Set display none on tabs after timeout so that they don't end up in tab index

class Tabs {
    protected $elem: JQuery<HTMLElement>;
    protected $tabItems: JQuery<HTMLElement>;
    protected $tabs: JQuery<HTMLElement>;

    protected onTabChangeListeners: Array<(tab: string) => void> = [];

    constructor(
        protected id: string
    ) {
    }

    public init(): void {
        this.$elem = $("#" + this.id);
        this.$tabItems = this.$elem.find(".tabs li");
        this.$tabs = this.$elem.find(".tab");

        this.$tabs.each((idx, el) => {
            el.setAttribute("data-position", idx.toString());
        });

        this.$tabItems.on("click", (event) => this.onTabItemClicked(event));
    }

    public get tabElements(): JQuery<HTMLElement> {
        return this.$tabs;
    }

    public get currentTab(): string {
        return this.stripPrefix(this.$tabs.filter(".is-active").attr("id"));
    }

    protected stripPrefix(tab: string): string {
        if (tab.startsWith("tab-")) {
            tab = tab.substring(4);
        }
        return tab;
    }

    protected onTabItemClicked(event: JQuery.Event<HTMLElement>): void {
        event.preventDefault();
        event.stopPropagation();

        this.switchTab(event.currentTarget.dataset.target);
    }

    public switchTab(target: string): void {
        var $target = $("#" + target);
        if ($target.length > 0) {
            var targetPosition = $target[0].dataset.position;

            this.$tabItems.each((idx, el) => {
                if (el.dataset.target == target) {
                    el.classList.add('is-active');
                }
                else {
                    el.classList.remove('is-active');
                }
            });

            this.$tabs.each((idx, el) => {
                var position = el.dataset.position;
                if (position == targetPosition) {
                    el.classList.remove('is-left');
                    el.classList.remove('is-right');

                    el.classList.add('is-active');
                }
                else if (position < targetPosition) {
                    el.classList.remove('is-active');
                    el.classList.remove('is-right');

                    el.classList.add('is-left');
                }
                else {
                    el.classList.remove('is-active');
                    el.classList.remove('is-left');

                    el.classList.add('is-right');
                }
            });

            this.triggerOnTabChangeListener(target);
        }
    }

    public addOnTabChangeListener(func: (tab: string) => void): void {
        this.onTabChangeListeners.push(func);
    }

    protected triggerOnTabChangeListener(tab: string) {
        tab = this.stripPrefix(tab);

        for (let listener of this.onTabChangeListeners) {
            listener(tab);
        }
    }
}