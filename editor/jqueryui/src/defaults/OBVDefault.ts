/**
 * 默认对象属性块界面
 * @author feng 2016-3-22
 */
@feng3d.OBVComponent()
class OBVDefault extends ui.Div implements feng3d.IObjectBlockView
{
	private _space: Object;
	private _blockName: string;

	private attributeViews: feng3d.IObjectAttributeView[];
	private itemList: feng3d.AttributeViewInfo[];

	group: ui.Div;
	titleGroup: ui.Div;
	titleButton: ui.Button;
	contentGroup: ui.Div;

	// border: eui.Rect;

	objectView: feng3d.IObjectView;

	/**
	 * @inheritDoc
	 */
	constructor(blockViewInfo: feng3d.BlockViewInfo)
	{
		super();

		this._space = blockViewInfo.owner;
		this._blockName = blockViewInfo.name;
		this.itemList = blockViewInfo.itemList;

		this.group = new ui.Div();
		this.titleGroup = new ui.Div();
		this.titleButton = new ui.Button();
		this.contentGroup = new ui.Div();

		this.addChild(this.group);
		this.addChild(this.titleGroup);
		this.addChild(this.titleButton);
		this.addChild(this.contentGroup);

		this.initView();
		this.titleButton.on("click", this.onTitleButtonClick, this);
	}

	initView(): void
	{
		if (this._blockName != null && this._blockName.length > 0)
		{
			// this.addChildAt(this.border, 0);
			this.group.addChild(this.titleGroup);
		} else
		{
			// this.removeChild(this.border);
// 			this.group.removeChild(this.titleGroup);
		}

		this.attributeViews = [];
		var objectAttributeInfos = this.itemList;
		for (var i = 0; i < objectAttributeInfos.length; i++)
		{
			var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
			// displayObject.percentWidth = 100;
			displayObject.objectView = this.objectView;
			displayObject.objectBlockView = this;
			this.contentGroup.addChild(displayObject);
			this.attributeViews.push(<any>displayObject);
		}
	}

	dispose()
	{
		this.titleButton.off("click", this.onTitleButtonClick, this);

		for (var i = 0; i < this.attributeViews.length; i++)
		{
			var displayObject = this.attributeViews[i];
			displayObject.objectView = null;
			displayObject.objectBlockView = null;
			this.contentGroup.removeChild(displayObject);
		}
		this.attributeViews = null;
	}

	get space(): Object
	{
		return this._space;
	}

	set space(value: Object)
	{
		this._space = value;
		for (var i = 0; i < this.attributeViews.length; i++)
		{
			this.attributeViews[i].space = this._space;
		}
	}

	get blockName(): string
	{
		return this._blockName;
	}

	updateView(): void
	{
		for (var i = 0; i < this.attributeViews.length; i++)
		{
			this.attributeViews[i].updateView();
		}
	}

	getAttributeView(attributeName: String)
	{
		for (var i = 0; i < this.attributeViews.length; i++)
		{
			if (this.attributeViews[i].attributeName == attributeName)
			{
				return this.attributeViews[i];
			}
		}
		return null;
	}

	private onTitleButtonClick()
	{
		// this.currentState = this.currentState == "hide" ? "show" : "hide";
	}
}