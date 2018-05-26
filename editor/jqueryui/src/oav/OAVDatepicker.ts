@feng3d.OAVComponent()
class OAVDatepicker extends OAVBase
{
	label: ui.Span;
	datepicker: ui.Datepicker;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
	{
		super(attributeViewInfo);

		this.label = new ui.Span();
		this.datepicker = new ui.Datepicker();
		this.addChild(this.label);
		this.addChild(this.datepicker);
	}

	initView()
	{
		super.initView();
		this.datepicker.on("change", this.onChange, this);
	}

	dispose()
	{
		this.datepicker.on("change", this.onChange, this);
	}

	updateView()
	{
		this.datepicker.value = this.attributeValue;
	}

	protected onChange()
	{
		this.attributeValue = this.datepicker.value;
	}
}
