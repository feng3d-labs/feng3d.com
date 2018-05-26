/**
 * 默认基础对象界面
 * @author feng 2016-3-11
 */
@feng3d.OVComponent()
class OVBaseDefault extends ui.Div implements feng3d.IObjectView
{
    public label: ui.Span;
    public image: ui.Image;
    //
    private _space: Object;

    constructor(objectViewInfo: feng3d.ObjectViewInfo)
    {
        super();

        this.label = new ui.Span();
        this.image = new ui.Image();
        this.addChild(this.label);
        this.addChild(this.image);

        this.updateView();
    }

    get space(): Object
    {
        return this._space;
    }

    set space(value: Object)
    {
        this._space = value;
        this.updateView();
    }

    getAttributeView(attributeName: String)
    {
        return null;
    }

    getblockView(blockName: String)
    {
        return null;
    }

    /**
     * 更新界面
     */
    updateView(): void
    {
        this.image.visible = false;
        this.label.visible = true;
        var value = this._space;
        if (typeof value == "string" && value.indexOf("data:") == 0)
        {
            this.image.visible = true;
            this.label.visible = false;
            this.image.source = value;
        } else
        {
            var string = String(value);
            if (string.length > 1000)
                string = string.substr(0, 1000) + "\n......."
            this.label.text = string;
        }
    }
}