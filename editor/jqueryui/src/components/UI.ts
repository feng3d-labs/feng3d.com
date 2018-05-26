/**
 * @author mrdoob / http://mrdoob.com/
 */

namespace ui
{
    interface ElementMap extends HTMLElementEventMap
    {
        /**
         * 值发生变化
         */
        "added": any;

        "removed": any;
    }

    interface OAVBase
    {
        once<K extends keyof ElementMap>(type: K, listener: (event: feng3d.Event<ElementMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof ElementMap>(type: K, data?: ElementMap[K], bubbles?: boolean);
        has<K extends keyof ElementMap>(type: K): boolean;
        on<K extends keyof ElementMap>(type: K, listener: (event: feng3d.Event<ElementMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean);
        off<K extends keyof ElementMap>(type?: K, listener?: (event: feng3d.Event<ElementMap[K]>) => any, thisObject?: any);
    }

    export class Element extends feng3d.EventDispatcher
    {
        dom: HTMLElement;

        get id()
        {
            return this.dom.id;
        }

        set id(id)
        {
            this.dom.id = id;
        }

        get className()
        {
            return this.dom.className;
        }

        set className(name)
        {
            this.dom.className = name;
        }

        get textContent()
        {
            return this.dom.textContent;
        }

        set textContent(value)
        {
            this.dom.textContent = value;
        }

        get visible()
        {
            return this.dom.style.display == "none";
        }

        set visible(v: boolean)
        {
            if (v)
            {
                delete this.dom.style.display;
            } else
            {
                this.dom.style.display = "none";
            }
        }

        private listentypes: string[] = [];

        constructor(dom?: HTMLElement)
        {
            super();
            if (dom)
                this.dom = dom;
        }

        addChild(...args: Element[])
        {
            for (var i = 0; i < args.length; i++)
            {
                var argument = args[i];
                if (argument instanceof Element)
                {
                    this.dom.appendChild(argument.dom);
                    argument.onAdded();
                    argument.dispatch("added");
                } else
                {
                    console.error('UI.Element:', argument, 'is not an instance of UI.Element.');
                }
            }

            return this;
        }

        removeChild(...args: Element[])
        {
            for (var i = 0; i < args.length; i++)
            {
                var argument = args[i];
                if (argument instanceof Element)
                {
                    this.dom.removeChild(argument.dom);
                    argument.onRemoved();
                    argument.dispatch("removed");
                } else
                {
                    console.error('Element:', argument, 'is not an instance of Element.');
                }
            }
            return this;
        }

        clear()
        {
            while (this.dom.children.length)
            {
                this.dom.removeChild(this.dom.lastChild);
            }
        }

        /**
         * 被添加
         */
        onAdded()
        {

        }

        /**
         * 被移除
         */
        onRemoved()
        {

        }

        /**
		 * 键盘按下事件
		 */
        private onMouseKey = (event) =>
        {
            this.dispatch(event.type, { data: event });
        }
    }

    /**
     * 监听一次事件后将会被移除
     * @param type						事件的类型。
     * @param listener					处理事件的侦听器函数。
     * @param thisObject                listener函数作用域
     * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
     */
    // once<K extends keyof HTMLElementEventMap>(type: K, listener: (event: feng3d.Event<HTMLElementEventMap[K]>) => void, thisObject?: any, priority?: number): void
    Element.prototype.once = function (type: string, listener: (event: feng3d.Event<any>) => void, thisObject?: any, priority?: number): void
    {
        this.on(type, listener, thisObject, priority, true)
    }

    /**
     * 添加监听
     * @param type						事件的类型。
     * @param listener					处理事件的侦听器函数。
     * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
     */
    // on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: feng3d.Event<HTMLElementEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any
    var oldElementOn = Element.prototype.on;
    Element.prototype.on = function (type: string, listener: (event: feng3d.Event<any>) => any, thisObject?: any, priority?: number, once?: boolean): any
    {
        oldElementOn.call(this, type, listener, thisObject, priority, once);
        if (this.listentypes.indexOf(type) == -1)
        {
            this.listentypes.push(type);
            this.dom.addEventListener(type, this.onMouseKey);
        }
    }

    /**
     * 移除监听
     * @param dispatcher 派发器
     * @param type						事件的类型。
     * @param listener					要删除的侦听器对象。
     */
    // off<K extends keyof HTMLElementEventMap>(type?: K, listener?: (event: feng3d.Event<HTMLElementEventMap[K]>) => any, thisObject?: any): any
    var oldElementOff = Element.prototype.off;
    Element.prototype.off = function (type?: string, listener?: (event: feng3d.Event<any>) => any, thisObject?: any): any
    {
        oldElementOff.call(this, type, listener, thisObject);
        if (!type)
        {
            this.listentypes.forEach(element =>
            {
                this.dom.removeEventListener(element, this.onMouseKey);
            });
            this.listentypes.length = 0;
        } else if (!this.has(<any>type))
        {
            this.dom.removeEventListener(type, this.onMouseKey);
            this.listentypes.splice(this.listentypes.indexOf(type), 1);
        }
    }

    // properties

    // var properties = ['position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
    //     'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
    //     'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex'];

    // properties.forEach(function (property)
    // {
    //     var method = 'set' + property.substr(0, 1).toUpperCase() + property.substr(1, property.length);

    //     UI.Element.prototype[method] = function ()
    //     {
    //         this.setStyle(property, arguments);
    //         return this;
    //     };
    // });

    // events

    // var events = ['KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change'];

    // events.forEach(function (event)
    // {
    //     var method = 'on' + event;
    //     UI.Element.prototype[method] = function (callback)
    //     {
    //         this.dom.addEventListener(event.toLowerCase(), callback.bind(this), false);
    //         return this;
    //     };
    // });

    // Span

    export class Span extends Element
    {
        dom: HTMLSpanElement

        get text()
        {
            return this.dom.textContent;
        }
        set text(v)
        {
            this.dom.textContent = v;
        }

        constructor()
        {
            super()
            this.dom = document.createElement('span');
        }


    }

    // Div
    export class Div extends Element
    {
        dom: HTMLDivElement;
        constructor()
        {
            super();
            this.dom = document.createElement('div');
        }
    }

    // Row

    export class Row extends Element
    {
        dom: HTMLDivElement;

        constructor()
        {
            super();
            var dom = document.createElement('div');
            dom.className = 'Row';
            this.dom = dom;
        }
    }

    // Panel

    export class Panel extends Element
    {
        dom: HTMLDivElement;
        constructor()
        {
            super();
            var dom = document.createElement('div');
            dom.className = 'Panel';

            this.dom = dom;
        }
    }

    // Text

    export class Text extends Element
    {
        dom: HTMLSpanElement

        constructor(text)
        {
            super();
            var dom = document.createElement('span');
            dom.className = 'Text';
            dom.style.cursor = 'default';
            dom.style.display = 'inline-block';
            dom.style.verticalAlign = 'middle';

            this.dom = dom;
            this.setValue(text);
        }

        getValue()
        {
            return this.dom.textContent;
        }

        setValue(value)
        {
            if (value !== undefined)
            {
                this.dom.textContent = value;
            }
            return this;
        }
    }

    // Input

    export class Input extends Element
    {
        dom: HTMLInputElement;
        constructor(text = "")
        {
            super();
            var dom = document.createElement('input');
            dom.className = 'Input';
            dom.style.padding = '2px';
            dom.style.border = '1px solid transparent';

            dom.addEventListener('keydown', function (event)
            {
                event.stopPropagation();
            }, false);

            this.dom = dom;
            this.value = text;
        }

        get enabled()
        {
            return !this.dom.disabled;
        }

        set enabled(v)
        {
            this.dom.disabled = !v;
        }

        get value()
        {
            return this.dom.value;
        }

        set value(value)
        {
            this.dom.value = value;
        }
    }

    // TextArea

    export class TextArea extends Element
    {
        dom: HTMLTextAreaElement;
        constructor()
        {
            super();
            var dom = document.createElement('textarea');
            dom.className = 'TextArea';
            dom.style.padding = '2px';
            dom.spellcheck = false;
            dom.addEventListener('keydown', function (event)
            {
                event.stopPropagation();
                if (event.keyCode === 9)
                {
                    event.preventDefault();
                    var cursor = dom.selectionStart;
                    dom.value = dom.value.substring(0, cursor) + '\t' + dom.value.substring(cursor);
                    dom.selectionStart = cursor + 1;
                    dom.selectionEnd = dom.selectionStart;
                }

            }, false);
            this.dom = dom;
        }

        getValue()
        {
            return this.dom.value;
        }

        setValue(value)
        {
            this.dom.value = value;
            return this;
        }
    }

    // Select
    export class Select extends Element
    {
        dom: HTMLSelectElement
        constructor()
        {
            super();
            var dom = document.createElement('select');
            dom.className = 'Select';
            dom.style.padding = '2px';
            this.dom = dom;
        }

        setMultiple(boolean)
        {
            this.dom.multiple = boolean;
            return this;
        };

        setOptions(options)
        {
            var selected = this.dom.value;
            while (this.dom.children.length > 0)
            {
                this.dom.removeChild(this.dom.firstChild);
            }

            for (var key in options)
            {
                var option = document.createElement('option');
                option.value = key;
                option.innerHTML = options[key];
                this.dom.appendChild(option);
            }
            this.dom.value = selected;
            return this;
        }

        getValue()
        {
            return this.dom.value;
        }

        setValue(value)
        {
            value = String(value);
            if (this.dom.value !== value)
            {
                this.dom.value = value;
            }
            return this;
        };
    }

    // Checkbox

    export class Checkbox extends Element
    {
        dom: HTMLInputElement
        constructor(boolean = false)
        {
            super();
            var dom = document.createElement('input');
            dom.className = 'Checkbox';
            dom.type = 'checkbox';
            this.dom = dom;
            this.value = boolean;
        }

        get value()
        {
            return this.dom.checked;
        }

        set value(value)
        {
            if (value !== undefined)
            {
                this.dom.checked = value;
            }
        }
    }

    // Color
    export class Color extends Element
    {
        dom: HTMLInputElement
        constructor()
        {
            super();
            var dom = document.createElement('input');
            dom.className = 'Color';
            dom.style.width = '64px';
            dom.style.height = '17px';
            dom.style.border = '0px';
            dom.style.padding = '2px';
            dom.style.backgroundColor = 'transparent';

            try
            {

                dom.type = 'color';
                dom.value = '#ffffff';

            } catch (exception) { }

            this.dom = dom;
        }


        getValue()
        {
            return this.dom.value;
        };

        getHexValue()
        {
            return parseInt(this.dom.value.substr(1), 16);
        }

        setValue(value)
        {
            this.dom.value = value;
            return this;
        };

        setHexValue(hex)
        {
            this.dom.value = '#' + ('000000' + hex.toString(16)).slice(- 6);
            return this;
        }
    }



    // Number

    export class Number extends Element
    {
        dom: HTMLInputElement

        unit: string;
        step: number;
        precision: number;
        max: number;
        min: number;
        value: number;

        constructor(number)
        {
            super();

            var scope = this;

            var dom = document.createElement('input');
            dom.className = 'Number';
            dom.value = '0.00';

            dom.addEventListener('keydown', function (event)
            {
                event.stopPropagation();
                if (event.keyCode === 13) dom.blur();

            }, false);

            this.value = 0;

            this.min = - Infinity;
            this.max = Infinity;

            this.precision = 2;
            this.step = 1;
            this.unit = '';

            this.dom = dom;

            this.setValue(number);

            var changeEvent = document.createEvent('HTMLEvents');
            changeEvent.initEvent('change', true, true);

            var distance = 0;
            var onMouseDownValue = 0;

            var pointer = [0, 0];
            var prevPointer = [0, 0];

            function onMouseDown(event)
            {
                event.preventDefault();
                distance = 0;
                onMouseDownValue = scope.value;
                prevPointer = [event.clientX, event.clientY];

                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('mouseup', onMouseUp, false);
            }

            function onMouseMove(event)
            {
                var currentValue = scope.value;
                pointer = [event.clientX, event.clientY];
                distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);
                var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * scope.step;
                value = Math.min(scope.max, Math.max(scope.min, value));

                if (currentValue !== value)
                {
                    scope.setValue(value);
                    dom.dispatchEvent(changeEvent);
                }
                prevPointer = [event.clientX, event.clientY];
            }

            function onMouseUp(event)
            {
                document.removeEventListener('mousemove', onMouseMove, false);
                document.removeEventListener('mouseup', onMouseUp, false);

                if (Math.abs(distance) < 2)
                {
                    dom.focus();
                    dom.select();
                }
            }

            function onChange(event)
            {
                scope.setValue(dom.value);
            }

            function onFocus(event)
            {
                dom.style.backgroundColor = '';
                dom.style.cursor = '';
            }

            function onBlur(event)
            {
                dom.style.backgroundColor = 'transparent';
                dom.style.cursor = 'col-resize';
            }

            onBlur(null);

            dom.addEventListener('mousedown', onMouseDown, false);
            dom.addEventListener('change', onChange, false);
            dom.addEventListener('focus', onFocus, false);
            dom.addEventListener('blur', onBlur, false);
        }


        getValue()
        {
            return this.value;
        }

        setValue(value)
        {
            if (value !== undefined)
            {
                value = parseFloat(value);

                if (value < this.min) value = this.min;
                if (value > this.max) value = this.max;

                this.value = value;
                this.dom.value = value.toFixed(this.precision);

                if (this.unit !== '') this.dom.value += ' ' + this.unit;
            }
            return this;
        }

        setPrecision(precision)
        {
            this.precision = precision;
            return this;
        };

        setStep(step)
        {
            this.step = step;
            return this;
        };

        setRange(min, max)
        {
            this.min = min;
            this.max = max;
            return this;
        };

        setUnit(unit)
        {
            this.unit = unit;
            return this;
        };

    }

    // Integer

    export class Integer extends Element
    {
        step: number;
        max: number;
        min: number;
        value: number;
        dom: HTMLInputElement

        constructor(number)
        {
            super();

            var scope = this;

            var dom = document.createElement('input');
            dom.className = 'Number';
            dom.value = '0';
            dom.addEventListener('keydown', function (event)
            {
                event.stopPropagation();
            }, false);

            this.value = 0;

            this.min = - Infinity;
            this.max = Infinity;

            this.step = 1;

            this.dom = dom;

            this.setValue(number);

            var changeEvent = document.createEvent('HTMLEvents');
            changeEvent.initEvent('change', true, true);

            var distance = 0;
            var onMouseDownValue = 0;

            var pointer = [0, 0];
            var prevPointer = [0, 0];

            function onMouseDown(event)
            {
                event.preventDefault();
                distance = 0;
                onMouseDownValue = scope.value;
                prevPointer = [event.clientX, event.clientY];
                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('mouseup', onMouseUp, false);
            }

            function onMouseMove(event)
            {
                var currentValue = scope.value;
                pointer = [event.clientX, event.clientY];
                distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);
                var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * scope.step;
                value = Math.min(scope.max, Math.max(scope.min, value)) | 0;

                if (currentValue !== value)
                {
                    scope.setValue(value);
                    dom.dispatchEvent(changeEvent);
                }
                prevPointer = [event.clientX, event.clientY];
            }

            function onMouseUp(event)
            {
                document.removeEventListener('mousemove', onMouseMove, false);
                document.removeEventListener('mouseup', onMouseUp, false);

                if (Math.abs(distance) < 2)
                {
                    dom.focus();
                    dom.select();
                }
            }

            function onChange(event)
            {
                scope.setValue(dom.value);
            }

            function onFocus(event)
            {
                dom.style.backgroundColor = '';
                dom.style.cursor = '';
            }

            function onBlur(event)
            {
                dom.style.backgroundColor = 'transparent';
                dom.style.cursor = 'col-resize';
            }

            onBlur(null);

            dom.addEventListener('mousedown', onMouseDown, false);
            dom.addEventListener('change', onChange, false);
            dom.addEventListener('focus', onFocus, false);
            dom.addEventListener('blur', onBlur, false);
        }

        getValue()
        {
            return this.value;
        };

        setValue(value)
        {
            if (value !== undefined)
            {
                value = parseInt(value);

                this.value = value;
                this.dom.value = value;
            }
            return this;
        };

        setStep(step)
        {
            this.step = parseInt(step);
            return this;
        };

        setRange(min, max)
        {
            this.min = min;
            this.max = max;
            return this;
        };
    }



    // Break
    export class Break extends Element
    {
        dom: HTMLBRElement

        constructor()
        {
            super();

            var dom = document.createElement('br');
            dom.className = 'Break';
            this.dom = dom;
        }
    }


    // HorizontalRule
    export class HorizontalRule extends Element
    {
        dom: HTMLHRElement;
        constructor()
        {
            super();

            var dom = document.createElement('hr');
            dom.className = 'HorizontalRule';

            this.dom = dom;
        }
    }

    // Button
    export class Button extends Element
    {
        dom: HTMLButtonElement;
        constructor(value = "")
        {
            super()

            var dom = document.createElement('button');
            dom.className = 'Button';

            this.dom = dom;
            this.dom.textContent = value;
        }

        setLabel(value)
        {
            this.dom.textContent = value;
            return this;
        };
    }

    export class Image extends Element
    {
        dom: HTMLImageElement;

        constructor(source?: string)
        {
            super();
            var dom = new window["Image"]();
            this.dom = dom;
            this.dom.src = source;
        }

        get source()
        {
            return this.dom.src;
        }

        set source(v)
        {
            this.dom.src = v;
        }
    }

    // Modal
    export class Modal extends Element
    {
        dom: HTMLDivElement;

        container: Panel;

        constructor()
        {
            super();

            var scope = this;

            var dom = document.createElement('div');

            dom.style.position = 'absolute';
            dom.style.width = '100%';
            dom.style.height = '100%';
            dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
            dom.style.display = 'none';
            dom.style.alignItems = 'center';
            dom.style.justifyContent = 'center';
            dom.addEventListener('click', function (event)
            {
                scope.hide();
            });

            this.dom = dom;

            this.container = new ui.Panel();
            this.container.dom.style.width = '200px';
            this.container.dom.style.padding = '20px';
            this.container.dom.style.backgroundColor = '#ffffff';
            this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

            this.addChild(this.container);
        }

        show(content)
        {
            this.container.clear();
            this.container.addChild(content);
            this.dom.style.display = 'flex';
            return this;
        };

        hide()
        {
            this.dom.style.display = 'none';
            return this;
        };
    }
}
