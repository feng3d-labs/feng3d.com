/**
 * 默认对象属性界面
 * @author feng 2016-3-10
 */
@feng3d.OAVComponent()
class OAVDefault extends OAVBase
{
	public label: ui.Span;
	public text: ui.Input;

	constructor(attributeViewInfo: feng3d.AttributeViewInfo)
	{
		super(attributeViewInfo);

		this.label = new ui.Span();
		this.text = new ui.Input();

		this.addChild(this.label);
		this.addChild(this.text);
	}

	set textEnabled(v: boolean)
	{
		this.text.enabled = v;
	}

	initView()
	{
		// this.text.percentWidth = 100;
		this.label.text = this._attributeName;

		this.text

		this.text.on("focus", this.ontxtfocusin, this);
		this.text.on("blur", this.ontxtfocusout, this);
		this.text.on("change", this.onTextChange, this);

		feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
	}

	dispose()
	{
		feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);

		this.text.off("focus", this.ontxtfocusin, this);
		this.text.off("blur", this.ontxtfocusout, this);
		this.text.off("change", this.onTextChange, this);
	}

	private _textfocusintxt: boolean;
	private ontxtfocusin()
	{
		this._textfocusintxt = true;
	}

	private ontxtfocusout()
	{
		this._textfocusintxt = false;
	}

	/**
	 * 更新界面
	 */
	updateView(): void
	{
		// this.text.enabled = this.attributeViewInfo.writable;
		var value = this.attributeValue;
		if (this.attributeValue === undefined)
		{
			this.text.value = String(this.attributeValue);
		} else if (!(this.attributeValue instanceof Object))
		{
			this.text.value = String(this.attributeValue);
		} else
		{
			this.text.enabled = false;
			var valuename = this.attributeValue["name"] || "";
			this.text.value = valuename + " (" + this.attributeValue.constructor.name + ")";

			this.once("dblclick", this.onDoubleClick, this);
		}
	}

	private onDoubleClick()
	{

	}

	private onTextChange()
	{
		if (this._textfocusintxt)
		{
			switch (this._attributeType)
			{
				case "String":
					this.attributeValue = this.text.value;
					break;
				case "number":
					var num = Number(this.text.value);
					num = isNaN(num) ? 0 : num;
					this.attributeValue = num;
					break;
				case "Boolean":
					this.attributeValue = Boolean(this.text.value);
					break;
				default:
					throw `无法处理类型${this._attributeType}!`;
			}
		}
	}
}