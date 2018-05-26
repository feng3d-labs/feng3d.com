@feng3d.OAVComponent()
class OAVBoolean extends OAVBase
{
	label: ui.Span;
	checkBox: ui.Checkbox;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
	{
		super(attributeViewInfo);

		this.label = new ui.Span();
		this.checkBox = new ui.Checkbox();
		this.addChild(this.label);
		this.addChild(this.checkBox);
	}

	initView()
	{
		super.initView();
		this.checkBox.on("change", this.onChange, this);
	}

	dispose()
	{
		this.checkBox.on("change", this.onChange, this);
	}

	updateView()
	{
		this.checkBox.value = this.attributeValue;
	}

	protected onChange()
	{
		this.attributeValue = this.checkBox.value;
	}
}
