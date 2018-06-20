abstract class Modal {
    protected $elem: JQuery<HTMLElement>;
    protected $closeButton: JQuery<HTMLElement>;

    constructor(
        protected id: string,
        protected onClose: () => void) {
    }

    public init(): void {
        this.$elem = $("#" + this.id);
        this.$closeButton = this.$elem.find(".modal-card-head .delete");

        this.$closeButton.on("click", (event) => this.onCloseClick(event));
    }

    public show(): void {
        this.$elem.addClass("is-active");
    }

    public hide(): void {
        this.$elem.removeClass("is-active");
    }

    protected onCloseClick(event: JQuery.Event<HTMLElement>): void {
        event.preventDefault();
        event.stopPropagation();

        this.hide();
        this.onClose();
    }

    public getChild(selector: string): JQuery<HTMLElement> {
        return this.$elem.find(selector);
    }
}

class ErrorModal extends Modal {
    protected $retryButton: JQuery<HTMLElement>;

    constructor(
        id: string,
        onClose: () => void,
        protected onRetry: () => void) {
        super(id, onClose);
    }

    public init(): void {
        super.init();

        this.$retryButton = this.$elem.find(".modal-card-foot button");

        this.$retryButton.on("click", (event) => this.onRetryClick(event));
    }

    protected onRetryClick(event: JQuery.Event<HTMLElement>): void {
        event.preventDefault();
        event.stopPropagation();

        this.hide();
        this.onRetry();
    }
}

class ConfirmModal extends Modal {
    protected $confirmButton: JQuery<HTMLElement>;
    protected $cancelButton: JQuery<HTMLElement>;

    public data: any;

    constructor(
        id: string,
        onClose: () => void,
        protected onConfirm: () => void) {
        super(id, onClose);
    }

    public init(): void {
        super.init();

        this.$confirmButton = this.$elem.find(".modal-card-foot button[data-action='confirm']");
        this.$cancelButton = this.$elem.find(".modal-card-foot button[data-action='cancel']");

        this.$confirmButton.on("click", (event) => this.onConfirmClick(event));
        this.$cancelButton.on("click", (event) => this.onCloseClick(event));
    }

    protected onConfirmClick(event: JQuery.Event<HTMLElement>): void {
        event.preventDefault();
        event.stopPropagation();

        this.hide();
        this.onConfirm();
    }
}

class TextInputModal extends ConfirmModal {
    constructor(
        id: string,
        onClose: () => void,
        onConfirm: () => void) {
        super(id, onClose, onConfirm);
    }

    public get value(): string {
        return <string>this.$elem.find("input").val();
    }

    public set value(val: string) {
        this.$elem.find("input").val(val);
    }
}

class NumberInputModal extends ConfirmModal {
    constructor(
        id: string,
        onClose: () => void,
        onConfirm: () => void) {
        super(id, onClose, onConfirm);
    }

    public get value(): number {
        return parseInt(<string>this.$elem.find("input").val());
    }

    public set value(val: number) {
        this.$elem.find("input").val(val);
    }
}

class ActionTableModal extends Modal {
    protected $doneButton: JQuery<HTMLElement>;

    public actions: Array<{
        action: string,
        classname: string,
        text: string,
        onClick: (event) => void
    }> = [];

    constructor(
        id: string,
        onClose: () => void) {
        super(id, onClose);
    }

    public init(): void {
        super.init();

        this.$doneButton = this.$elem.find(".modal-card-foot button");

        this.$doneButton.on("click", (event) => this.onCloseClick(event));
    }
    
    public set values(vals: Array<{
        text: string,
        value: string
    }>) {
        let tbody = this.$elem.find("tbody");
        tbody.find("tr").remove();
        vals = vals.sort((a, b) => a.text.localeCompare(b.text));
        for (let val of vals) {
            let newRow = $("<tr data-value=\"" + val.value + "\">");
            newRow.append("<td>" + val.text + "</td>");
            let actionButtons = $("<td class=\"buttons\"></td>");

            for (let action of this.actions) {
                let actionButton = $(
                    "<button class=\"button " + action.classname +
                    "\" data-action=\"" + action.action +
                    "\">" + action.text +
                    "</button>"
                );
                actionButtons.append(actionButton);

                actionButton.on("click", action.onClick);
            }

            newRow.append(actionButtons);
            tbody.append(newRow);
        }
    }
}

class MultiInputModal extends ConfirmModal {
    private inputs: Array<{
        type: string,
        from: string,
        $elem: JQuery<HTMLElement>
    }> = [];

    constructor(
        id: string,
        onClose: () => void,
        onConfirm: () => void) {
        super(id, onClose, onConfirm);
    }

    public init(): void {
        super.init();

        let inputPlaceholders = this.getChild("[data-is-input]");
        for (let input of inputPlaceholders) {
            this.inputs.push({
                type: input.dataset["type"],
                from: input.dataset["from"],
                $elem: $(input)
            });
        }
    }

    public get value(): any {
        let result: any = {};

        for (let input of this.inputs) {
            switch (input.type) {
                case "text":
                    result[input.from] = <string>input.$elem.val();
                    break;
                case "checkboxes":
                    let checkedBoxes = input.$elem.find("input[type=\"checkbox\"]:checked");
                    let checkedValues = [];
                    for (let checkBox of checkedBoxes) {
                        checkedValues.push(checkBox.dataset["value"]);
                    }
                    result[input.from] = checkedValues;
                    break;
            }
        }

        return result;
    }

    public set value(val: any) {
        for (let input of this.inputs) {
            switch (input.type) {
                case "text":
                    input.$elem.val(val[input.from]);
                    break;
                case "checkboxes":
                    input.$elem.children().remove();

                    let options = val[input.from];
                    let values = options.values;
                    let checked = options.checked;
                    for (let value of values) {
                        let elemHTML =
                            "<div class=\"column is-narrow\">" +
                            "<label class=\"checkbox\">";
                        
                        if (checked.indexOf(value.name) > -1) {
                            elemHTML += "<input type=\"checkbox\" data-value=\"" + value.name + "\" checked=\"checked\"> ";
                        }
                        else {
                            elemHTML += "<input type=\"checkbox\" data-value=\"" + value.name + "\"> ";
                        }
                        elemHTML += value.display_name + "</label></div>";

                        let $elem = $(elemHTML);
                        input.$elem.append($elem);
                    }
                    break;    
            }
        }
    }
}