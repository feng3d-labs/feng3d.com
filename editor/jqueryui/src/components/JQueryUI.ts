namespace ui
{
    export class Spinner extends Element
    {
        dom: HTMLInputElement;
        constructor()
        {
            super();
            var dom = document.createElement("input");
            this.dom = dom;
        }

        onAdded()
        {
            super.onAdded();
            $(this.dom).spinner();
        }
    }

    export class Datepicker extends Element
    {
        constructor()
        {
            super();
            var dom = document.createElement("input");
            dom.type = "text";
            this.dom = dom;
            // <input type="text" id = "datepicker" >
        }

        onAdded()
        {
            super.onAdded();
            $(this.dom).datepicker().change(() =>
            {
                this.dispatch("change");
            });
        }

        get value()
        {
            return $(this.dom).datepicker("getDate");
        }

        set value(v)
        {
            $(this.dom).datepicker("setDate", v);
        }
    }
}