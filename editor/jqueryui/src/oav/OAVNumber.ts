/**
 * 默认对象属性界面
 * @author feng 2016-3-10
 */
@feng3d.OAVComponent()
class OAVNumber extends OAVDefault
{
	fractionDigits = 3;

	attributeValue: number;

	spinner: ui.Spinner;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
	{
		super(attributeViewInfo);

		this.spinner = new ui.Spinner();
		this.addChild(this.spinner);
	}

	/**
	 * 更新界面
	 */
	updateView(): void
	{
		var pow = Math.pow(10, this.fractionDigits);
		var value = Math.round(this.attributeValue * pow) / pow;
		this.text.value = String(value);
	}
}