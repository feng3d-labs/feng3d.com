interface OAVBaseMap extends HTMLElementEventMap
{
    /**
     * 值发生变化
     */
    "valuechanged": {
        /**
         * 宿主
         */
        space: Object,
        /**
         * 属性名称
         */
        attributeName: string,
        /**
         * 属性值
         */
        attributeValue: any
    };
}

interface OAVBase
{
    once<K extends keyof OAVBaseMap>(type: K, listener: (event: feng3d.Event<OAVBaseMap[K]>) => void, thisObject?: any, priority?: number): void;
    dispatch<K extends keyof OAVBaseMap>(type: K, data?: OAVBaseMap[K], bubbles?: boolean);
    has<K extends keyof OAVBaseMap>(type: K): boolean;
    on<K extends keyof OAVBaseMap>(type: K, listener: (event: feng3d.Event<OAVBaseMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
    off<K extends keyof OAVBaseMap>(type?: K, listener?: (event: feng3d.Event<OAVBaseMap[K]>) => any, thisObject?: any);
}

class OAVBase extends ui.Div implements feng3d.IObjectAttributeView
{
    protected _space: any;
    protected _attributeName: string;
    protected _attributeType: string;
    protected attributeViewInfo: feng3d.AttributeViewInfo;
    //
    label: ui.Span;

    /**
     * 对象属性界面
     */
    objectView: feng3d.IObjectView;
    /**
     * 对象属性块界面
     */
    objectBlockView: feng3d.IObjectBlockView;

    constructor(attributeViewInfo: feng3d.AttributeViewInfo)
    {
        super();
        this._space = attributeViewInfo.owner;
        this._attributeName = attributeViewInfo.name;
        this._attributeType = attributeViewInfo.type;
        this.attributeViewInfo = attributeViewInfo;

        if (this.attributeViewInfo.componentParam)
        {
            for (var key in this.attributeViewInfo.componentParam)
            {
                if (this.attributeViewInfo.componentParam.hasOwnProperty(key))
                {
                    this[key] = this.attributeViewInfo.componentParam[key];
                }
            }
        }
    }

    get space(): any
    {
        return this._space;
    }

    set space(value: any)
    {
        this._space = value;
        this.dispose();
        this.initView();
        this.updateView();
    }

    onAdded()
    {
        super.onAdded();
        this.initView();
        this.updateView();
    }

    /**
     * 初始化
     */
    initView()
    {
        if (this.label)
            this.label.text = this._attributeName;
    }

    /**
     * 销毁
     */
    dispose()
    {

    }

    /**
     * 更新
     */
    updateView()
    {
        
    }

    get attributeName(): string
    {
        return this._attributeName;
    }

    get attributeValue(): any
    {
        return this._space[this._attributeName];
    }

    set attributeValue(value: any)
    {
        if (this._space[this._attributeName] != value)
        {
            this._space[this._attributeName] = value;
            this.dispatch("valuechanged", { space: this._space, attributeName: this.attributeName, attributeValue: this.attributeValue }, true);
        }
        this.updateView();
    }
}