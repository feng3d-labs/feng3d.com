var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @author mrdoob / http://mrdoob.com/
 */
var ui;
(function (ui) {
    var Element = /** @class */ (function (_super) {
        __extends(Element, _super);
        function Element(dom) {
            var _this = _super.call(this) || this;
            _this.listentypes = [];
            /**
             * 键盘按下事件
             */
            _this.onMouseKey = function (event) {
                _this.dispatch(event.type, { data: event });
            };
            if (dom)
                _this.dom = dom;
            return _this;
        }
        Object.defineProperty(Element.prototype, "id", {
            get: function () {
                return this.dom.id;
            },
            set: function (id) {
                this.dom.id = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "className", {
            get: function () {
                return this.dom.className;
            },
            set: function (name) {
                this.dom.className = name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "textContent", {
            get: function () {
                return this.dom.textContent;
            },
            set: function (value) {
                this.dom.textContent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "visible", {
            get: function () {
                return this.dom.style.display == "none";
            },
            set: function (v) {
                if (v) {
                    delete this.dom.style.display;
                }
                else {
                    this.dom.style.display = "none";
                }
            },
            enumerable: true,
            configurable: true
        });
        Element.prototype.addChild = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                var argument = args[i];
                if (argument instanceof Element) {
                    this.dom.appendChild(argument.dom);
                    argument.onAdded();
                    argument.dispatch("added");
                }
                else {
                    console.error('UI.Element:', argument, 'is not an instance of UI.Element.');
                }
            }
            return this;
        };
        Element.prototype.removeChild = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                var argument = args[i];
                if (argument instanceof Element) {
                    this.dom.removeChild(argument.dom);
                    argument.onRemoved();
                    argument.dispatch("removed");
                }
                else {
                    console.error('Element:', argument, 'is not an instance of Element.');
                }
            }
            return this;
        };
        Element.prototype.clear = function () {
            while (this.dom.children.length) {
                this.dom.removeChild(this.dom.lastChild);
            }
        };
        /**
         * 被添加
         */
        Element.prototype.onAdded = function () {
        };
        /**
         * 被移除
         */
        Element.prototype.onRemoved = function () {
        };
        return Element;
    }(feng3d.EventDispatcher));
    ui.Element = Element;
    /**
     * 监听一次事件后将会被移除
     * @param type						事件的类型。
     * @param listener					处理事件的侦听器函数。
     * @param thisObject                listener函数作用域
     * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
     */
    // once<K extends keyof HTMLElementEventMap>(type: K, listener: (event: feng3d.Event<HTMLElementEventMap[K]>) => void, thisObject?: any, priority?: number): void
    Element.prototype.once = function (type, listener, thisObject, priority) {
        this.on(type, listener, thisObject, priority, true);
    };
    /**
     * 添加监听
     * @param type						事件的类型。
     * @param listener					处理事件的侦听器函数。
     * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
     */
    // on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: feng3d.Event<HTMLElementEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any
    var oldElementOn = Element.prototype.on;
    Element.prototype.on = function (type, listener, thisObject, priority, once) {
        oldElementOn.call(this, type, listener, thisObject, priority, once);
        if (this.listentypes.indexOf(type) == -1) {
            this.listentypes.push(type);
            this.dom.addEventListener(type, this.onMouseKey);
        }
    };
    /**
     * 移除监听
     * @param dispatcher 派发器
     * @param type						事件的类型。
     * @param listener					要删除的侦听器对象。
     */
    // off<K extends keyof HTMLElementEventMap>(type?: K, listener?: (event: feng3d.Event<HTMLElementEventMap[K]>) => any, thisObject?: any): any
    var oldElementOff = Element.prototype.off;
    Element.prototype.off = function (type, listener, thisObject) {
        var _this = this;
        oldElementOff.call(this, type, listener, thisObject);
        if (!type) {
            this.listentypes.forEach(function (element) {
                _this.dom.removeEventListener(element, _this.onMouseKey);
            });
            this.listentypes.length = 0;
        }
        else if (!this.has(type)) {
            this.dom.removeEventListener(type, this.onMouseKey);
            this.listentypes.splice(this.listentypes.indexOf(type), 1);
        }
    };
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
    var Span = /** @class */ (function (_super) {
        __extends(Span, _super);
        function Span() {
            var _this = _super.call(this) || this;
            _this.dom = document.createElement('span');
            return _this;
        }
        Object.defineProperty(Span.prototype, "text", {
            get: function () {
                return this.dom.textContent;
            },
            set: function (v) {
                this.dom.textContent = v;
            },
            enumerable: true,
            configurable: true
        });
        return Span;
    }(Element));
    ui.Span = Span;
    // Div
    var Div = /** @class */ (function (_super) {
        __extends(Div, _super);
        function Div() {
            var _this = _super.call(this) || this;
            _this.dom = document.createElement('div');
            return _this;
        }
        return Div;
    }(Element));
    ui.Div = Div;
    // Row
    var Row = /** @class */ (function (_super) {
        __extends(Row, _super);
        function Row() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('div');
            dom.className = 'Row';
            _this.dom = dom;
            return _this;
        }
        return Row;
    }(Element));
    ui.Row = Row;
    // Panel
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('div');
            dom.className = 'Panel';
            _this.dom = dom;
            return _this;
        }
        return Panel;
    }(Element));
    ui.Panel = Panel;
    // Text
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text(text) {
            var _this = _super.call(this) || this;
            var dom = document.createElement('span');
            dom.className = 'Text';
            dom.style.cursor = 'default';
            dom.style.display = 'inline-block';
            dom.style.verticalAlign = 'middle';
            _this.dom = dom;
            _this.setValue(text);
            return _this;
        }
        Text.prototype.getValue = function () {
            return this.dom.textContent;
        };
        Text.prototype.setValue = function (value) {
            if (value !== undefined) {
                this.dom.textContent = value;
            }
            return this;
        };
        return Text;
    }(Element));
    ui.Text = Text;
    // Input
    var Input = /** @class */ (function (_super) {
        __extends(Input, _super);
        function Input(text) {
            if (text === void 0) { text = ""; }
            var _this = _super.call(this) || this;
            var dom = document.createElement('input');
            dom.className = 'Input';
            dom.style.padding = '2px';
            dom.style.border = '1px solid transparent';
            dom.addEventListener('keydown', function (event) {
                event.stopPropagation();
            }, false);
            _this.dom = dom;
            _this.value = text;
            return _this;
        }
        Object.defineProperty(Input.prototype, "enabled", {
            get: function () {
                return !this.dom.disabled;
            },
            set: function (v) {
                this.dom.disabled = !v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "value", {
            get: function () {
                return this.dom.value;
            },
            set: function (value) {
                this.dom.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return Input;
    }(Element));
    ui.Input = Input;
    // TextArea
    var TextArea = /** @class */ (function (_super) {
        __extends(TextArea, _super);
        function TextArea() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('textarea');
            dom.className = 'TextArea';
            dom.style.padding = '2px';
            dom.spellcheck = false;
            dom.addEventListener('keydown', function (event) {
                event.stopPropagation();
                if (event.keyCode === 9) {
                    event.preventDefault();
                    var cursor = dom.selectionStart;
                    dom.value = dom.value.substring(0, cursor) + '\t' + dom.value.substring(cursor);
                    dom.selectionStart = cursor + 1;
                    dom.selectionEnd = dom.selectionStart;
                }
            }, false);
            _this.dom = dom;
            return _this;
        }
        TextArea.prototype.getValue = function () {
            return this.dom.value;
        };
        TextArea.prototype.setValue = function (value) {
            this.dom.value = value;
            return this;
        };
        return TextArea;
    }(Element));
    ui.TextArea = TextArea;
    // Select
    var Select = /** @class */ (function (_super) {
        __extends(Select, _super);
        function Select() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('select');
            dom.className = 'Select';
            dom.style.padding = '2px';
            _this.dom = dom;
            return _this;
        }
        Select.prototype.setMultiple = function (boolean) {
            this.dom.multiple = boolean;
            return this;
        };
        ;
        Select.prototype.setOptions = function (options) {
            var selected = this.dom.value;
            while (this.dom.children.length > 0) {
                this.dom.removeChild(this.dom.firstChild);
            }
            for (var key in options) {
                var option = document.createElement('option');
                option.value = key;
                option.innerHTML = options[key];
                this.dom.appendChild(option);
            }
            this.dom.value = selected;
            return this;
        };
        Select.prototype.getValue = function () {
            return this.dom.value;
        };
        Select.prototype.setValue = function (value) {
            value = String(value);
            if (this.dom.value !== value) {
                this.dom.value = value;
            }
            return this;
        };
        ;
        return Select;
    }(Element));
    ui.Select = Select;
    // Checkbox
    var Checkbox = /** @class */ (function (_super) {
        __extends(Checkbox, _super);
        function Checkbox(boolean) {
            if (boolean === void 0) { boolean = false; }
            var _this = _super.call(this) || this;
            var dom = document.createElement('input');
            dom.className = 'Checkbox';
            dom.type = 'checkbox';
            _this.dom = dom;
            _this.value = boolean;
            return _this;
        }
        Object.defineProperty(Checkbox.prototype, "value", {
            get: function () {
                return this.dom.checked;
            },
            set: function (value) {
                if (value !== undefined) {
                    this.dom.checked = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Checkbox;
    }(Element));
    ui.Checkbox = Checkbox;
    // Color
    var Color = /** @class */ (function (_super) {
        __extends(Color, _super);
        function Color() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('input');
            dom.className = 'Color';
            dom.style.width = '64px';
            dom.style.height = '17px';
            dom.style.border = '0px';
            dom.style.padding = '2px';
            dom.style.backgroundColor = 'transparent';
            try {
                dom.type = 'color';
                dom.value = '#ffffff';
            }
            catch (exception) { }
            _this.dom = dom;
            return _this;
        }
        Color.prototype.getValue = function () {
            return this.dom.value;
        };
        ;
        Color.prototype.getHexValue = function () {
            return parseInt(this.dom.value.substr(1), 16);
        };
        Color.prototype.setValue = function (value) {
            this.dom.value = value;
            return this;
        };
        ;
        Color.prototype.setHexValue = function (hex) {
            this.dom.value = '#' + ('000000' + hex.toString(16)).slice(-6);
            return this;
        };
        return Color;
    }(Element));
    ui.Color = Color;
    // Number
    var Number = /** @class */ (function (_super) {
        __extends(Number, _super);
        function Number(number) {
            var _this = _super.call(this) || this;
            var scope = _this;
            var dom = document.createElement('input');
            dom.className = 'Number';
            dom.value = '0.00';
            dom.addEventListener('keydown', function (event) {
                event.stopPropagation();
                if (event.keyCode === 13)
                    dom.blur();
            }, false);
            _this.value = 0;
            _this.min = -Infinity;
            _this.max = Infinity;
            _this.precision = 2;
            _this.step = 1;
            _this.unit = '';
            _this.dom = dom;
            _this.setValue(number);
            var changeEvent = document.createEvent('HTMLEvents');
            changeEvent.initEvent('change', true, true);
            var distance = 0;
            var onMouseDownValue = 0;
            var pointer = [0, 0];
            var prevPointer = [0, 0];
            function onMouseDown(event) {
                event.preventDefault();
                distance = 0;
                onMouseDownValue = scope.value;
                prevPointer = [event.clientX, event.clientY];
                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('mouseup', onMouseUp, false);
            }
            function onMouseMove(event) {
                var currentValue = scope.value;
                pointer = [event.clientX, event.clientY];
                distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);
                var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * scope.step;
                value = Math.min(scope.max, Math.max(scope.min, value));
                if (currentValue !== value) {
                    scope.setValue(value);
                    dom.dispatchEvent(changeEvent);
                }
                prevPointer = [event.clientX, event.clientY];
            }
            function onMouseUp(event) {
                document.removeEventListener('mousemove', onMouseMove, false);
                document.removeEventListener('mouseup', onMouseUp, false);
                if (Math.abs(distance) < 2) {
                    dom.focus();
                    dom.select();
                }
            }
            function onChange(event) {
                scope.setValue(dom.value);
            }
            function onFocus(event) {
                dom.style.backgroundColor = '';
                dom.style.cursor = '';
            }
            function onBlur(event) {
                dom.style.backgroundColor = 'transparent';
                dom.style.cursor = 'col-resize';
            }
            onBlur(null);
            dom.addEventListener('mousedown', onMouseDown, false);
            dom.addEventListener('change', onChange, false);
            dom.addEventListener('focus', onFocus, false);
            dom.addEventListener('blur', onBlur, false);
            return _this;
        }
        Number.prototype.getValue = function () {
            return this.value;
        };
        Number.prototype.setValue = function (value) {
            if (value !== undefined) {
                value = parseFloat(value);
                if (value < this.min)
                    value = this.min;
                if (value > this.max)
                    value = this.max;
                this.value = value;
                this.dom.value = value.toFixed(this.precision);
                if (this.unit !== '')
                    this.dom.value += ' ' + this.unit;
            }
            return this;
        };
        Number.prototype.setPrecision = function (precision) {
            this.precision = precision;
            return this;
        };
        ;
        Number.prototype.setStep = function (step) {
            this.step = step;
            return this;
        };
        ;
        Number.prototype.setRange = function (min, max) {
            this.min = min;
            this.max = max;
            return this;
        };
        ;
        Number.prototype.setUnit = function (unit) {
            this.unit = unit;
            return this;
        };
        ;
        return Number;
    }(Element));
    ui.Number = Number;
    // Integer
    var Integer = /** @class */ (function (_super) {
        __extends(Integer, _super);
        function Integer(number) {
            var _this = _super.call(this) || this;
            var scope = _this;
            var dom = document.createElement('input');
            dom.className = 'Number';
            dom.value = '0';
            dom.addEventListener('keydown', function (event) {
                event.stopPropagation();
            }, false);
            _this.value = 0;
            _this.min = -Infinity;
            _this.max = Infinity;
            _this.step = 1;
            _this.dom = dom;
            _this.setValue(number);
            var changeEvent = document.createEvent('HTMLEvents');
            changeEvent.initEvent('change', true, true);
            var distance = 0;
            var onMouseDownValue = 0;
            var pointer = [0, 0];
            var prevPointer = [0, 0];
            function onMouseDown(event) {
                event.preventDefault();
                distance = 0;
                onMouseDownValue = scope.value;
                prevPointer = [event.clientX, event.clientY];
                document.addEventListener('mousemove', onMouseMove, false);
                document.addEventListener('mouseup', onMouseUp, false);
            }
            function onMouseMove(event) {
                var currentValue = scope.value;
                pointer = [event.clientX, event.clientY];
                distance += (pointer[0] - prevPointer[0]) - (pointer[1] - prevPointer[1]);
                var value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 50)) * scope.step;
                value = Math.min(scope.max, Math.max(scope.min, value)) | 0;
                if (currentValue !== value) {
                    scope.setValue(value);
                    dom.dispatchEvent(changeEvent);
                }
                prevPointer = [event.clientX, event.clientY];
            }
            function onMouseUp(event) {
                document.removeEventListener('mousemove', onMouseMove, false);
                document.removeEventListener('mouseup', onMouseUp, false);
                if (Math.abs(distance) < 2) {
                    dom.focus();
                    dom.select();
                }
            }
            function onChange(event) {
                scope.setValue(dom.value);
            }
            function onFocus(event) {
                dom.style.backgroundColor = '';
                dom.style.cursor = '';
            }
            function onBlur(event) {
                dom.style.backgroundColor = 'transparent';
                dom.style.cursor = 'col-resize';
            }
            onBlur(null);
            dom.addEventListener('mousedown', onMouseDown, false);
            dom.addEventListener('change', onChange, false);
            dom.addEventListener('focus', onFocus, false);
            dom.addEventListener('blur', onBlur, false);
            return _this;
        }
        Integer.prototype.getValue = function () {
            return this.value;
        };
        ;
        Integer.prototype.setValue = function (value) {
            if (value !== undefined) {
                value = parseInt(value);
                this.value = value;
                this.dom.value = value;
            }
            return this;
        };
        ;
        Integer.prototype.setStep = function (step) {
            this.step = parseInt(step);
            return this;
        };
        ;
        Integer.prototype.setRange = function (min, max) {
            this.min = min;
            this.max = max;
            return this;
        };
        ;
        return Integer;
    }(Element));
    ui.Integer = Integer;
    // Break
    var Break = /** @class */ (function (_super) {
        __extends(Break, _super);
        function Break() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('br');
            dom.className = 'Break';
            _this.dom = dom;
            return _this;
        }
        return Break;
    }(Element));
    ui.Break = Break;
    // HorizontalRule
    var HorizontalRule = /** @class */ (function (_super) {
        __extends(HorizontalRule, _super);
        function HorizontalRule() {
            var _this = _super.call(this) || this;
            var dom = document.createElement('hr');
            dom.className = 'HorizontalRule';
            _this.dom = dom;
            return _this;
        }
        return HorizontalRule;
    }(Element));
    ui.HorizontalRule = HorizontalRule;
    // Button
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(value) {
            if (value === void 0) { value = ""; }
            var _this = _super.call(this) || this;
            var dom = document.createElement('button');
            dom.className = 'Button';
            _this.dom = dom;
            _this.dom.textContent = value;
            return _this;
        }
        Button.prototype.setLabel = function (value) {
            this.dom.textContent = value;
            return this;
        };
        ;
        return Button;
    }(Element));
    ui.Button = Button;
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image(source) {
            var _this = _super.call(this) || this;
            var dom = new window["Image"]();
            _this.dom = dom;
            _this.dom.src = source;
            return _this;
        }
        Object.defineProperty(Image.prototype, "source", {
            get: function () {
                return this.dom.src;
            },
            set: function (v) {
                this.dom.src = v;
            },
            enumerable: true,
            configurable: true
        });
        return Image;
    }(Element));
    ui.Image = Image;
    // Modal
    var Modal = /** @class */ (function (_super) {
        __extends(Modal, _super);
        function Modal() {
            var _this = _super.call(this) || this;
            var scope = _this;
            var dom = document.createElement('div');
            dom.style.position = 'absolute';
            dom.style.width = '100%';
            dom.style.height = '100%';
            dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
            dom.style.display = 'none';
            dom.style.alignItems = 'center';
            dom.style.justifyContent = 'center';
            dom.addEventListener('click', function (event) {
                scope.hide();
            });
            _this.dom = dom;
            _this.container = new ui.Panel();
            _this.container.dom.style.width = '200px';
            _this.container.dom.style.padding = '20px';
            _this.container.dom.style.backgroundColor = '#ffffff';
            _this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';
            _this.addChild(_this.container);
            return _this;
        }
        Modal.prototype.show = function (content) {
            this.container.clear();
            this.container.addChild(content);
            this.dom.style.display = 'flex';
            return this;
        };
        ;
        Modal.prototype.hide = function () {
            this.dom.style.display = 'none';
            return this;
        };
        ;
        return Modal;
    }(Element));
    ui.Modal = Modal;
})(ui || (ui = {}));
var ui;
(function (ui) {
    var Spinner = /** @class */ (function (_super) {
        __extends(Spinner, _super);
        function Spinner() {
            var _this = _super.call(this) || this;
            var dom = document.createElement("input");
            _this.dom = dom;
            return _this;
        }
        Spinner.prototype.onAdded = function () {
            _super.prototype.onAdded.call(this);
            $(this.dom).spinner();
        };
        return Spinner;
    }(ui.Element));
    ui.Spinner = Spinner;
    var Datepicker = /** @class */ (function (_super) {
        __extends(Datepicker, _super);
        function Datepicker() {
            var _this = _super.call(this) || this;
            var dom = document.createElement("input");
            dom.type = "text";
            _this.dom = dom;
            return _this;
            // <input type="text" id = "datepicker" >
        }
        Datepicker.prototype.onAdded = function () {
            var _this = this;
            _super.prototype.onAdded.call(this);
            $(this.dom).datepicker().change(function () {
                _this.dispatch("change");
            });
        };
        Object.defineProperty(Datepicker.prototype, "value", {
            get: function () {
                return $(this.dom).datepicker("getDate");
            },
            set: function (v) {
                $(this.dom).datepicker("setDate", v);
            },
            enumerable: true,
            configurable: true
        });
        return Datepicker;
    }(ui.Element));
    ui.Datepicker = Datepicker;
})(ui || (ui = {}));
var OAVBase = /** @class */ (function (_super) {
    __extends(OAVBase, _super);
    function OAVBase(attributeViewInfo) {
        var _this = _super.call(this) || this;
        _this._space = attributeViewInfo.owner;
        _this._attributeName = attributeViewInfo.name;
        _this._attributeType = attributeViewInfo.type;
        _this.attributeViewInfo = attributeViewInfo;
        if (_this.attributeViewInfo.componentParam) {
            for (var key in _this.attributeViewInfo.componentParam) {
                if (_this.attributeViewInfo.componentParam.hasOwnProperty(key)) {
                    _this[key] = _this.attributeViewInfo.componentParam[key];
                }
            }
        }
        return _this;
    }
    Object.defineProperty(OAVBase.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            this.dispose();
            this.initView();
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    OAVBase.prototype.onAdded = function () {
        _super.prototype.onAdded.call(this);
        this.initView();
        this.updateView();
    };
    /**
     * 初始化
     */
    OAVBase.prototype.initView = function () {
        if (this.label)
            this.label.text = this._attributeName;
    };
    /**
     * 销毁
     */
    OAVBase.prototype.dispose = function () {
    };
    /**
     * 更新
     */
    OAVBase.prototype.updateView = function () {
    };
    Object.defineProperty(OAVBase.prototype, "attributeName", {
        get: function () {
            return this._attributeName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAVBase.prototype, "attributeValue", {
        get: function () {
            return this._space[this._attributeName];
        },
        set: function (value) {
            if (this._space[this._attributeName] != value) {
                this._space[this._attributeName] = value;
                this.dispatch("valuechanged", { space: this._space, attributeName: this.attributeName, attributeValue: this.attributeValue }, true);
            }
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    return OAVBase;
}(ui.Div));
/**
 * 默认对象属性界面
 * @author feng 2016-3-10
 */
var OAVDefault = /** @class */ (function (_super) {
    __extends(OAVDefault, _super);
    function OAVDefault(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.label = new ui.Span();
        _this.text = new ui.Input();
        _this.addChild(_this.label);
        _this.addChild(_this.text);
        return _this;
    }
    Object.defineProperty(OAVDefault.prototype, "textEnabled", {
        set: function (v) {
            this.text.enabled = v;
        },
        enumerable: true,
        configurable: true
    });
    OAVDefault.prototype.initView = function () {
        // this.text.percentWidth = 100;
        this.label.text = this._attributeName;
        this.text.on("focus", this.ontxtfocusin, this);
        this.text.on("blur", this.ontxtfocusout, this);
        this.text.on("change", this.onTextChange, this);
        feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
    };
    OAVDefault.prototype.dispose = function () {
        feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        this.text.off("focus", this.ontxtfocusin, this);
        this.text.off("blur", this.ontxtfocusout, this);
        this.text.off("change", this.onTextChange, this);
    };
    OAVDefault.prototype.ontxtfocusin = function () {
        this._textfocusintxt = true;
    };
    OAVDefault.prototype.ontxtfocusout = function () {
        this._textfocusintxt = false;
    };
    /**
     * 更新界面
     */
    OAVDefault.prototype.updateView = function () {
        // this.text.enabled = this.attributeViewInfo.writable;
        var value = this.attributeValue;
        if (this.attributeValue === undefined) {
            this.text.value = String(this.attributeValue);
        }
        else if (!(this.attributeValue instanceof Object)) {
            this.text.value = String(this.attributeValue);
        }
        else {
            this.text.enabled = false;
            var valuename = this.attributeValue["name"] || "";
            this.text.value = valuename + " (" + this.attributeValue.constructor.name + ")";
            this.once("dblclick", this.onDoubleClick, this);
        }
    };
    OAVDefault.prototype.onDoubleClick = function () {
    };
    OAVDefault.prototype.onTextChange = function () {
        if (this._textfocusintxt) {
            switch (this._attributeType) {
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
                    throw "\u65E0\u6CD5\u5904\u7406\u7C7B\u578B" + this._attributeType + "!";
            }
        }
    };
    OAVDefault = __decorate([
        feng3d.OAVComponent()
    ], OAVDefault);
    return OAVDefault;
}(OAVBase));
/**
 * 默认对象属性块界面
 * @author feng 2016-3-22
 */
var OBVDefault = /** @class */ (function (_super) {
    __extends(OBVDefault, _super);
    /**
     * @inheritDoc
     */
    function OBVDefault(blockViewInfo) {
        var _this = _super.call(this) || this;
        _this._space = blockViewInfo.owner;
        _this._blockName = blockViewInfo.name;
        _this.itemList = blockViewInfo.itemList;
        _this.group = new ui.Div();
        _this.titleGroup = new ui.Div();
        _this.titleButton = new ui.Button();
        _this.contentGroup = new ui.Div();
        _this.addChild(_this.group);
        _this.addChild(_this.titleGroup);
        _this.addChild(_this.titleButton);
        _this.addChild(_this.contentGroup);
        _this.initView();
        _this.titleButton.on("click", _this.onTitleButtonClick, _this);
        return _this;
    }
    OBVDefault.prototype.initView = function () {
        if (this._blockName != null && this._blockName.length > 0) {
            // this.addChildAt(this.border, 0);
            this.group.addChild(this.titleGroup);
        }
        else {
            // this.removeChild(this.border);
            // 			this.group.removeChild(this.titleGroup);
        }
        this.attributeViews = [];
        var objectAttributeInfos = this.itemList;
        for (var i = 0; i < objectAttributeInfos.length; i++) {
            var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
            // displayObject.percentWidth = 100;
            displayObject.objectView = this.objectView;
            displayObject.objectBlockView = this;
            this.contentGroup.addChild(displayObject);
            this.attributeViews.push(displayObject);
        }
    };
    OBVDefault.prototype.dispose = function () {
        this.titleButton.off("click", this.onTitleButtonClick, this);
        for (var i = 0; i < this.attributeViews.length; i++) {
            var displayObject = this.attributeViews[i];
            displayObject.objectView = null;
            displayObject.objectBlockView = null;
            this.contentGroup.removeChild(displayObject);
        }
        this.attributeViews = null;
    };
    Object.defineProperty(OBVDefault.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            for (var i = 0; i < this.attributeViews.length; i++) {
                this.attributeViews[i].space = this._space;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBVDefault.prototype, "blockName", {
        get: function () {
            return this._blockName;
        },
        enumerable: true,
        configurable: true
    });
    OBVDefault.prototype.updateView = function () {
        for (var i = 0; i < this.attributeViews.length; i++) {
            this.attributeViews[i].updateView();
        }
    };
    OBVDefault.prototype.getAttributeView = function (attributeName) {
        for (var i = 0; i < this.attributeViews.length; i++) {
            if (this.attributeViews[i].attributeName == attributeName) {
                return this.attributeViews[i];
            }
        }
        return null;
    };
    OBVDefault.prototype.onTitleButtonClick = function () {
        // this.currentState = this.currentState == "hide" ? "show" : "hide";
    };
    OBVDefault = __decorate([
        feng3d.OBVComponent()
    ], OBVDefault);
    return OBVDefault;
}(ui.Div));
/**
 * 默认基础对象界面
 * @author feng 2016-3-11
 */
var OVBaseDefault = /** @class */ (function (_super) {
    __extends(OVBaseDefault, _super);
    function OVBaseDefault(objectViewInfo) {
        var _this = _super.call(this) || this;
        _this.label = new ui.Span();
        _this.image = new ui.Image();
        _this.addChild(_this.label);
        _this.addChild(_this.image);
        _this.updateView();
        return _this;
    }
    Object.defineProperty(OVBaseDefault.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    OVBaseDefault.prototype.getAttributeView = function (attributeName) {
        return null;
    };
    OVBaseDefault.prototype.getblockView = function (blockName) {
        return null;
    };
    /**
     * 更新界面
     */
    OVBaseDefault.prototype.updateView = function () {
        this.image.visible = false;
        this.label.visible = true;
        var value = this._space;
        if (typeof value == "string" && value.indexOf("data:") == 0) {
            this.image.visible = true;
            this.label.visible = false;
            this.image.source = value;
        }
        else {
            var string = String(value);
            if (string.length > 1000)
                string = string.substr(0, 1000) + "\n.......";
            this.label.text = string;
        }
    };
    OVBaseDefault = __decorate([
        feng3d.OVComponent()
    ], OVBaseDefault);
    return OVBaseDefault;
}(ui.Div));
/**
 * 默认使用块的对象界面
 * @author feng 2016-3-22
 */
var OVDefault = /** @class */ (function (_super) {
    __extends(OVDefault, _super);
    /**
     * 对象界面数据
     */
    function OVDefault(objectViewInfo) {
        var _this = _super.call(this) || this;
        _this._objectViewInfo = objectViewInfo;
        _this._space = objectViewInfo.owner;
        _this.group = new ui.Div();
        _this.addChild(_this.group);
        _this.initview();
        _this.updateView();
        return _this;
    }
    OVDefault.prototype.initview = function () {
        this.blockViews = [];
        var objectBlockInfos = this._objectViewInfo.objectBlockInfos;
        for (var i = 0; i < objectBlockInfos.length; i++) {
            var displayObject = feng3d.objectview.getBlockView(objectBlockInfos[i]);
            displayObject.percentWidth = 100;
            displayObject.objectView = this;
            this.group.addChild(displayObject);
            this.blockViews.push(displayObject);
        }
    };
    OVDefault.prototype.dispose = function () {
        for (var i = 0; i < this.blockViews.length; i++) {
            var displayObject = this.blockViews[i];
            displayObject.objectView = null;
            this.group.removeChild(displayObject);
        }
        this.blockViews = null;
    };
    Object.defineProperty(OVDefault.prototype, "space", {
        get: function () {
            return this._space;
        },
        set: function (value) {
            this._space = value;
            this.dispose();
            this.initview();
            this.updateView();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新界面
     */
    OVDefault.prototype.updateView = function () {
        for (var i = 0; i < this.blockViews.length; i++) {
            this.blockViews[i].updateView();
        }
    };
    OVDefault.prototype.getblockView = function (blockName) {
        for (var i = 0; i < this.blockViews.length; i++) {
            if (this.blockViews[i].blockName == blockName) {
                return this.blockViews[i];
            }
        }
        return null;
    };
    OVDefault.prototype.getAttributeView = function (attributeName) {
        for (var i = 0; i < this.blockViews.length; i++) {
            var attributeView = this.blockViews[i].getAttributeView(attributeName);
            if (attributeView != null) {
                return attributeView;
            }
        }
        return null;
    };
    OVDefault = __decorate([
        feng3d.OVComponent()
    ], OVDefault);
    return OVDefault;
}(ui.Div));
var OAVBoolean = /** @class */ (function (_super) {
    __extends(OAVBoolean, _super);
    function OAVBoolean(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.label = new ui.Span();
        _this.checkBox = new ui.Checkbox();
        _this.addChild(_this.label);
        _this.addChild(_this.checkBox);
        return _this;
    }
    OAVBoolean.prototype.initView = function () {
        _super.prototype.initView.call(this);
        this.checkBox.on("change", this.onChange, this);
    };
    OAVBoolean.prototype.dispose = function () {
        this.checkBox.on("change", this.onChange, this);
    };
    OAVBoolean.prototype.updateView = function () {
        this.checkBox.value = this.attributeValue;
    };
    OAVBoolean.prototype.onChange = function () {
        this.attributeValue = this.checkBox.value;
    };
    OAVBoolean = __decorate([
        feng3d.OAVComponent()
    ], OAVBoolean);
    return OAVBoolean;
}(OAVBase));
/**
 * 默认对象属性界面
 * @author feng 2016-3-10
 */
var OAVNumber = /** @class */ (function (_super) {
    __extends(OAVNumber, _super);
    function OAVNumber(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.fractionDigits = 3;
        _this.spinner = new ui.Spinner();
        _this.addChild(_this.spinner);
        return _this;
    }
    /**
     * 更新界面
     */
    OAVNumber.prototype.updateView = function () {
        var pow = Math.pow(10, this.fractionDigits);
        var value = Math.round(this.attributeValue * pow) / pow;
        this.text.value = String(value);
    };
    OAVNumber = __decorate([
        feng3d.OAVComponent()
    ], OAVNumber);
    return OAVNumber;
}(OAVDefault));
var OAVDatepicker = /** @class */ (function (_super) {
    __extends(OAVDatepicker, _super);
    function OAVDatepicker(attributeViewInfo) {
        var _this = _super.call(this, attributeViewInfo) || this;
        _this.label = new ui.Span();
        _this.datepicker = new ui.Datepicker();
        _this.addChild(_this.label);
        _this.addChild(_this.datepicker);
        return _this;
    }
    OAVDatepicker.prototype.initView = function () {
        _super.prototype.initView.call(this);
        this.datepicker.on("change", this.onChange, this);
    };
    OAVDatepicker.prototype.dispose = function () {
        this.datepicker.on("change", this.onChange, this);
    };
    OAVDatepicker.prototype.updateView = function () {
        this.datepicker.value = this.attributeValue;
    };
    OAVDatepicker.prototype.onChange = function () {
        this.attributeValue = this.datepicker.value;
    };
    OAVDatepicker = __decorate([
        feng3d.OAVComponent()
    ], OAVDatepicker);
    return OAVDatepicker;
}(OAVBase));
// $("body").append(`<input id="autocomplete" title="type &quot;a&quot;">`);
//
feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
feng3d.objectview.defaultObjectViewClass = "OVDefault";
feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
feng3d.objectview.setDefaultTypeAttributeView("Boolean", { component: "OAVBoolean" });
feng3d.objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
feng3d.objectview.setDefaultTypeAttributeView("Date", { component: "OAVDatepicker" });
$("body").ready(function () {
    $("body").append("<input id=\"autocomplete\">");
    // $("body").append(`<input id="autocomplete">`).ready(function ()
    // {
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    $("#autocomplete").autocomplete({
        source: availableTags
    });
    // });
    var stage = new ui.Element(document.body);
    var view = feng3d.objectview.getObjectView({
        a: 1, b: false, c: "abcd",
        date: new Date(),
    });
    stage.addChild(view);
});
//# sourceMappingURL=app.js.map