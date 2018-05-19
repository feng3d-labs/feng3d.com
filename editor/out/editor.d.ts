declare namespace feng3d.editor {
    var utils: Utils;
    class Utils {
        /**
         * 获取所有类
         */
        getAllClasss(root: Window, rootpath: "", depth?: number): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 常用正则表示式
     */
    var regExps: RegExps;
    /**
     * 常用正则表示式
     */
    class RegExps {
        /**
         * 图片
         */
        image: RegExp;
        /**
         * 命名空间
         */
        namespace: RegExp;
        /**
         * 导出类
         */
        exportClass: RegExp;
        /**
         * 脚本中的类
         */
        scriptClass: RegExp;
    }
}
declare namespace feng3d.editor {
    /**
     * Created by 黑暗之神KDS on 2017/2/17.
     */
    /**
     * 文件对象
     * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
     * -- 其他端支持绝对路径
     * Created by kds on 2017/1/21 0021.
     */
    class FileObject {
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        static isLegalName(fileName: string): boolean;
        /**
         * 构造函数
         *  -- 当存在path且isGetFileInfo==true的时候会自动探索基本信息
         *       -- 是否存在
         *       -- 文件大小
         *       -- 创建日期
         *       -- 最近一次的修改日期
         * @param path 路径 文件夹 kds\\test  文件 kds\\test\\file.js
         * @param onComplete 探查该文件完毕后的回调 onComplete([object FileObject])
         * @param thisPtr 执行域
         * @param onError 当错误时返回 onError([object FileObject])
         * @param isGetFileInfo 初始就获取下该文件的基本信息
         */
        constructor(path: string, onComplete: Function, thisPtr: any, onError: Function, isGetFileInfo: boolean);
        /**
         * 文件/文件夹是否存在 基本探索过后才可知道是否存在
         */
        readonly exists: boolean;
        private _exists;
        /**
         * 文件尺寸
         */
        readonly size: number;
        private _size;
        /**
         * 是否是文件夹
         */
        readonly isDirectory: boolean;
        private _isDirectory;
        /**
         * 创建日期
         */
        readonly createDate: Date;
        private _createDate;
        /**
         * 上次修改日期
         */
        readonly lastModifyDate: Date;
        private _lastModifyDate;
        /**
         * 路径
         * -- WEB端是相对路径
         * -- 其他端支持绝对路径 file:///xxx/yyy
         */
        readonly path: string;
        private _path;
        /**
         * 文件或文件夹名 xxx.ks
         */
        readonly fileName: string;
        /**
         * 不包含格式的文件名称 如 xxx.ks就是xxx
         */
        readonly fileNameWithoutExt: string;
        /**
         * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
         */
        readonly location: string;
        /**
         * 绝对路径
         * -- WEB端的是 http://xxxx
         * -- 其他端的是 file:///xxxx
         */
        readonly fullPath: string;
        /**
         * 格式
         */
        readonly extension: string;
        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        getDirectoryListing(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createDirectory(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        createFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        saveFile(content: string | ArrayBuffer, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        rename(newName: string, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        move(newPath: string, onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        delete(onComplete: Function, onError: Function, thisPtr: any): void;
        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        open(onFin: Function, onError: Function): void;
        /**
         * 更新状态
         * @param callback 回调函数
         */
        private updateStats(path, callback, onComplete?, onError?);
    }
}
declare namespace feng3d.editor {
    var fs: EditorAssets1;
    class EditorAssets1 extends ReadWriteAssets {
        constructor(readWriteFS?: ReadWriteFS);
        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        hasProject(projectname: string, callback: (has: boolean) => void): void;
        /**
         * 获取项目列表
         * @param callback 回调函数
         */
        getProjectList(callback: (err: Error, projects: string[]) => void): void;
        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        initproject(projectname: string, callback: () => void): void;
        /**
         * 创建项目
         */
        createproject(projectname: string, callback: () => void): void;
        selectFile(callback: (file: FileList) => void): void;
        /**
         * 导出项目
         */
        exportProject(callback: (err: Error, data: Blob) => void): void;
        /**
         * 导入项目
         */
        importProject(file: File, callback: () => void): void;
        /**
         * 获取文件绝对路径
         */
        getAbsolutePath(path: string, callback: (err: Error | null, absolutePath: string | null) => void): void;
    }
}
declare namespace feng3d.editor {
    class EditorCache {
        /**
         * 保存最后一次打开的项目路径
         */
        projectname: string;
        constructor();
        save(): void;
    }
    var editorcache: EditorCache;
}
declare namespace feng3d.editor {
    var drag: Drag;
    class Drag {
        register(displayObject: egret.DisplayObject, setdargSource: (dragSource: DragData) => void, accepttypes: (keyof DragData)[], onDragDrop?: (dragSource: DragData) => void): void;
        unregister(displayObject: egret.DisplayObject): void;
        /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
        refreshAcceptables(): void;
    }
    /**
     * 拖拽数据
     */
    interface DragData {
        gameobject?: GameObject;
        animationclip?: AnimationClip;
        material?: Material;
        geometry?: Geometry;
        file_gameobject?: string;
        /**
         * 脚本路径
         */
        file_script?: string;
        /**
         * 文件路径
         */
        file?: string;
        /**
         * 图片路径
         */
        image?: string;
    }
}
declare namespace feng3d.editor {
    var editorshortcut: Editorshortcut;
    class Editorshortcut {
        init(): void;
    }
    class SceneControlConfig {
        mouseWheelMoveStep: number;
        lookDistance: number;
        sceneCameraForwardBackwardStep: number;
    }
    var sceneControlConfig: SceneControlConfig;
}
declare namespace feng3d.editor {
    class Feng3dView extends eui.Component implements eui.UIComponent {
        fullbutton: eui.Button;
        private canvas;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onResize();
    }
}
declare namespace feng3d.editor {
    class CameraPreview extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        private canvas;
        private previewEngine;
        camera: Camera;
        private _camera;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onResize();
        private onDataChange();
        private onframe();
    }
}
declare var defaultTextFiled: egret.TextField;
declare function lostFocus(display: egret.DisplayObject): void;
/**
 * 重命名组件
 */
declare class RenameTextInput extends eui.Component implements eui.UIComponent {
    nameeditTxt: eui.TextInput;
    nameLabel: eui.Label;
    callback: () => void;
    /**
     * 显示文本
     */
    text: string;
    textAlign: string;
    constructor();
    /**
     * 启动编辑
     */
    edit(callback?: () => void): void;
    /**
     * 取消编辑
     */
    cancelEdit(): void;
    private onnameeditChanged();
}
declare namespace feng3d.editor {
    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    class SplitGroup extends eui.Group {
        private _onMouseMovethis;
        private _onMouseDownthis;
        private _onMouseUpthis;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onMouseMove(e);
        private _findSplit(stageX, stageY);
        private onMouseDown(e);
        private onMouseUp(e);
    }
}
declare namespace feng3d.editor {
    var maskview: Maskview;
    class Maskview {
        mask(displayObject: egret.DisplayObject, onMaskClick?: () => void): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    var popupview: Popupview;
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    class Popupview {
        popup<T>(object: T, closecallback?: (object: T) => void, param?: {
            width?: number;
            height?: number;
        }): void;
    }
}
/**
 * 下拉列表
 */
declare class ComboBox extends eui.Component implements eui.UIComponent {
    label: eui.Label;
    list: eui.List;
    /**
     * 数据
     */
    dataProvider: {
        label: string;
        value: any;
    }[];
    /**
     * 选中数据
     */
    data: {
        label: string;
        value: any;
    };
    _data: {
        label: string;
        value: any;
    };
    constructor();
    $onAddToStage(stage: egret.Stage, nestLevel: number): void;
    $onRemoveFromStage(): void;
    private init();
    private updateview();
    private onClick();
    private onlistChange();
}
declare namespace feng3d.editor {
    class Accordion extends eui.Component implements eui.UIComponent {
        titleGroup: eui.Group;
        titleLabel: eui.Label;
        contentGroup: eui.Group;
        /**
         * 标签名称
         */
        titleName: string;
        private components;
        constructor();
        addContent(component: eui.Component): void;
        protected onComplete(): void;
        protected onAddedToStage(): void;
        protected onRemovedFromStage(): void;
        private onTitleButtonClick();
    }
}
declare namespace feng3d.editor {
    class ColorPicker extends eui.Component implements eui.UIComponent {
        picker: eui.Rect;
        value: Color3;
        private _value;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onClick();
    }
}
declare namespace feng3d.editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子节点相对父节点的缩进值，以像素为单位。默认17。
         */
        indentation: number;
        data: TreeNode;
        private watchers;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onDisclosureButtonClick();
        private updateView();
    }
}
declare namespace feng3d.editor {
    class MenuItemRenderer extends eui.ItemRenderer {
        data: MenuItem;
        menuUI: MenuUI;
        selectedRect: eui.Rect;
        protected dataChanged(): void;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private updateView();
        private onItemMouseDown(event);
        private onItemMouseOver();
        private onItemMouseOut();
        private onsubMenuUIRemovedFromeStage(e);
    }
}
declare namespace feng3d.editor {
    class TreeNode {
        label?: string;
        depth?: number;
        isOpen?: boolean;
        selected?: boolean;
        /**
         * 父节点
         */
        parent?: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
        constructor(obj?: Partial<TreeNode>);
        /**
         * 销毁
         */
        destroy(): void;
    }
    interface TreeEventMap {
        added: TreeNode;
        removed: TreeNode;
        changed: TreeNode;
        openChanged: TreeNode;
    }
    interface Tree {
        once<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeEventMap>(type: K, data?: TreeEventMap[K], bubbles?: boolean): any;
        has<K extends keyof TreeEventMap>(type: K): boolean;
        on<K extends keyof TreeEventMap>(type: K, listener: (event: TreeEventMap[K]) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeEventMap>(type?: K, listener?: (event: TreeEventMap[K]) => any, thisObject?: any): any;
    }
    class Tree extends EventDispatcher {
        _rootnode: TreeNode;
        rootnode: TreeNode;
        /**
         * 判断是否包含节点
         */
        contain(node: TreeNode, rootnode?: TreeNode): boolean;
        addNode(node: TreeNode, parentnode?: TreeNode): void;
        removeNode(node: TreeNode): void;
        destroy(node: TreeNode): void;
        updateChildrenDepth(node: TreeNode): void;
        getShowNodes(node?: TreeNode): TreeNode[];
        private isopenchanged(host, property, oldvalue);
    }
    function treeMap<T extends TreeNode>(treeNode: T, callback: (node: T, parent: T) => void): void;
}
declare namespace feng3d.editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        wGroup: eui.Group;
        wTextInput: eui.TextInput;
        vm: Vector3;
        private _vm;
        constructor();
        showw: any;
        private _showw;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private addItemEventListener(input);
        private removeItemEventListener(input);
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        updateView(): void;
        private onTextChange(event);
    }
}
declare namespace feng3d.editor {
    class ComponentView extends eui.Component {
        component: Component;
        componentView: IObjectView;
        accordion: feng3d.editor.Accordion;
        enabledCB: eui.CheckBox;
        componentIcon: eui.Image;
        helpBtn: eui.Button;
        operationBtn: eui.Button;
        script: Script;
        scriptView: IObjectView;
        /**
         * 对象界面数据
         */
        constructor(component: Component);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete();
        private onDeleteButton(event);
        private onAddToStage();
        private onRemovedFromStage();
        private updateEnableCB();
        private onEnableCBChange();
        private initScriptView();
        private removeScriptView();
        private saveScriptData();
        private onOperationBtnClick();
        private onHelpBtnClick();
        private onScriptChanged();
    }
}
declare namespace feng3d.editor {
    /**
     * 菜单
     */
    var menu: Menu;
    type MenuItem = {
        /**
         * 显示标签
         */
        label?: string;
        accelerator?: string;
        role?: string;
        type?: 'separator';
        /**
         * 点击事件
         */
        click?: () => void;
        /**
         * 子菜单
         */
        submenu?: MenuItem[];
    };
    class Menu {
        popup(menu: MenuItem[], mousex?: number, mousey?: number, width?: number): void;
    }
    class MenuUI extends eui.List {
        subMenuUI: MenuUI;
        private _subMenuUI;
        private parentMenuUI;
        readonly topMenu: MenuUI;
        constructor();
        static create(menu: MenuItem[], mousex?: number, mousey?: number, width?: number): MenuUI;
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private updateView();
        remove(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 默认基础对象界面
     * @author feng 2016-3-11
     */
    class OVBaseDefault extends eui.Component implements IObjectView {
        label: eui.Label;
        image: eui.Image;
        private _space;
        constructor(objectViewInfo: ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        space: Object;
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace feng3d {
    interface IObjectView extends eui.Component {
    }
    interface IObjectBlockView extends eui.Component {
    }
    interface IObjectAttributeView extends eui.Component {
    }
}
declare namespace feng3d.editor {
    /**
     * 默认使用块的对象界面
     * @author feng 2016-3-22
     */
    class OVDefault extends eui.Component implements IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initview(): void;
        dispose(): void;
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        getblockView(blockName: string): IObjectBlockView;
        getAttributeView(attributeName: string): IObjectAttributeView;
    }
}
declare namespace feng3d.editor {
    class OVTransform extends eui.Component implements IObjectView {
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        rxTextInput: eui.TextInput;
        ryTextInput: eui.TextInput;
        rzTextInput: eui.TextInput;
        sxTextInput: eui.TextInput;
        syTextInput: eui.TextInput;
        szTextInput: eui.TextInput;
        private _space;
        private _objectViewInfo;
        constructor(objectViewInfo: ObjectViewInfo);
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private addItemEventListener(input);
        private removeItemEventListener(input);
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        private onTextChange(event);
        space: Transform;
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 默认对象属性块界面
     * @author feng 2016-3-22
     */
    class OBVDefault extends eui.Component implements IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        objectView: IObjectView;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: BlockViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initView(): void;
        dispose(): void;
        space: Object;
        readonly blockName: string;
        updateView(): void;
        getAttributeView(attributeName: String): IObjectAttributeView;
        private onTitleButtonClick();
    }
}
declare namespace feng3d {
    class ObjectViewEvent extends egret.Event {
        static VALUE_CHANGE: string;
        space: any;
        attributeName: string;
        attributeValue: any;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        toString(): string;
    }
}
declare namespace feng3d.editor {
    class OAVBase extends eui.Component implements feng3d.IObjectAttributeView {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected attributeViewInfo: AttributeViewInfo;
        label: eui.Label;
        /**
         * 对象属性界面
         */
        objectView: IObjectView;
        /**
         * 对象属性块界面
         */
        objectBlockView: IObjectBlockView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: any;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        /**
         * 初始化
         */
        initView(): void;
        /**
         * 销毁
         */
        dispose(): void;
        /**
         * 更新
         */
        updateView(): void;
        readonly attributeName: string;
        attributeValue: any;
    }
}
declare namespace feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class OAVDefault extends OAVBase {
        label: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: AttributeViewInfo);
        dragparam: {
            accepttype: keyof DragData;
            datatype: string;
        };
        private _textEnabled;
        textEnabled: boolean;
        initView(): void;
        dispose(): void;
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick();
        private onTextChange();
    }
}
declare namespace feng3d.editor {
    class BooleanAttrView extends OAVBase {
        label: eui.Label;
        checkBox: eui.CheckBox;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 默认对象属性界面
     * @author feng 2016-3-10
     */
    class OAVNumber extends OAVDefault {
        fractionDigits: number;
        attributeValue: number;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace feng3d.editor {
    class OAVVector3D extends OAVBase {
        label: eui.Label;
        vector3DView: feng3d.editor.Vector3DView;
        constructor(attributeViewInfo: AttributeViewInfo);
        initView(): void;
        dispose(): void;
    }
}
declare namespace feng3d.editor {
    class OAVArray extends OAVBase {
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Rect;
        contentGroup: eui.Group;
        sizeTxt: eui.TextInput;
        private attributeViews;
        constructor(attributeViewInfo: AttributeViewInfo);
        space: Object;
        readonly attributeName: string;
        attributeValue: any[];
        initView(): void;
        dispose(): void;
        private onTitleButtonClick();
        private onsizeTxtfocusout();
    }
    class OAVArrayItem extends OAVDefault {
        constructor(arr: any[], index: number, componentParam: Object);
        initView(): void;
    }
}
declare namespace feng3d.editor {
    class OAVEnum extends OAVBase {
        label: eui.Label;
        combobox: ComboBox;
        private list;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        enumClass: any;
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onComboxChange();
    }
}
declare namespace feng3d.editor {
    class OAVComponentList extends OAVBase {
        private accordions;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: AttributeViewInfo);
        private onAddComponentButtonClick();
        space: any;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        private addComponentView(component);
        /**
         * 更新界面
         */
        updateView(): void;
        private removedComponentView(component);
        private onaddedcompont(event);
        private onremovedComponent(event);
    }
}
declare namespace feng3d.editor {
    class OAVFunction extends OAVBase {
        label: eui.Label;
        button: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected click(event: egret.Event): void;
    }
}
declare namespace feng3d.editor {
    class OAVColorPicker extends OAVBase {
        label: eui.Label;
        colorPicker: feng3d.editor.ColorPicker;
        input: eui.TextInput;
        attributeValue: Color3 | Color4;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        private onTextChange();
    }
}
declare namespace feng3d.editor {
    class OAVMaterialName extends OAVBase {
        tileIcon: eui.Image;
        nameLabel: eui.Label;
        operationBtn: eui.Button;
        helpBtn: eui.Button;
        shaderComboBox: ComboBox;
        group: eui.Group;
        space: Material;
        constructor(attributeViewInfo: AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onShaderComboBoxChange();
    }
}
declare namespace feng3d.editor {
    class OAVObjectView extends OAVBase {
        group: eui.Group;
        view: eui.Component;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        updateView(): void;
    }
}
declare namespace feng3d.editor {
    class OAVGameObjectName extends OAVBase {
        nameInput: eui.TextInput;
        visibleCB: eui.CheckBox;
        mouseEnabledCB: eui.CheckBox;
        space: GameObject;
        constructor(attributeViewInfo: AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onVisibleCBClick();
        private onMouseEnabledCBClick();
        private _textfocusintxt;
        private ontxtfocusin();
        private ontxtfocusout();
        private onTextChange();
    }
}
declare namespace feng3d.editor {
    /**
     * 挑选（拾取）OAV界面
     * @author feng 2016-3-10
     */
    class OAVPick extends OAVBase {
        label: eui.Label;
        text: eui.Label;
        pickBtn: eui.Button;
        constructor(attributeViewInfo: AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private ontxtClick();
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick();
    }
}
declare namespace feng3d.editor {
    /**
     * 挑选（拾取）OAV界面
     * @author feng 2016-3-10
     */
    class OAVTexture2D extends OAVBase {
        image: eui.Image;
        img_border: eui.Image;
        pickBtn: eui.Button;
        label: eui.Label;
        constructor(attributeViewInfo: AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private ontxtClick();
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick();
    }
}
declare namespace feng3d.editor {
    /**
     * 属性面板（检查器）
     * @author feng     2017-03-20
     */
    class InspectorView extends eui.Component implements eui.UIComponent {
        backButton: eui.Button;
        group: eui.Group;
        private view;
        viewData: any;
        viewDataList: any[];
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onDataChange();
        updateView(): void;
        showData(data: any, removeBack?: boolean): void;
        onBackButton(): void;
    }
}
declare namespace feng3d.editor {
    class HierarchyTreeItemRenderer extends TreeItemRenderer {
        renameInput: RenameTextInput;
        /**
         * 上一个选中项
         */
        static preSelectedItem: HierarchyTreeItemRenderer;
        data: HierarchyNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private setdargSource(dragSource);
        private onclick();
        dataChanged(): void;
        private onrightclick(e);
        private onnameLabelclick();
    }
}
declare namespace feng3d.editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        addButton: eui.Button;
        list: eui.List;
        private listData;
        /**
         * 选中节点
         */
        private selectedNode;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private invalidHierarchy();
        private updateHierarchyTree();
        private onListbackClick();
        private onListClick(e);
        private onListRightClick(e);
    }
}
declare namespace feng3d.editor {
    interface AssetsEventMap {
        changed: any;
        openChanged: any;
    }
    var assetsDispather: IEventDispatcher<AssetsEventMap>;
    var editorAssets: EditorAssets;
    class EditorAssets {
        /**
         * 项目名称
         */
        projectname: string;
        assetsPath: string;
        showFloder: string;
        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent;
        initproject(path: string, callback: () => void): void;
        /**
         * 获取文件
         * @param path 文件路径
         */
        getFile(path: string): AssetsFile;
        /**
         * 删除文件
         * @param path 文件路径
         */
        deletefile(path: string, callback?: (assetsFile: AssetsFile) => void, includeRoot?: boolean): void;
        readScene(path: string, callback: (err: Error, scene: Scene3D) => void): void;
        /**
         * 保存场景到文件
         * @param path 场景路径
         * @param scene 保存的场景
         */
        saveScene(path: string, scene: Scene3D, callback?: (err: Error) => void): void;
        /**
        * 移动文件
        * @param path 移动的文件路径
        * @param destdirpath   目标文件夹
        * @param callback      完成回调
        */
        movefile(path: string, destdirpath: string, callback?: () => void): void;
        getparentdir(path: string): string;
        /**
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsFile): void;
        /**
         * 获取一个新路径
         */
        getnewpath(path: string, callback: (newpath: string) => void): void;
        saveObject(object: GameObject | AnimationClip | Material | Geometry, filename: string, override?: boolean, callback?: (file: AssetsFile) => void): void;
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean, next?: (assetsFile: AssetsFile) => boolean): AssetsFile[];
        inputFiles(files: File[] | FileList): void;
        runProjectScript(callback?: () => void): void;
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetsFile 文件
         */
        private parserMenu(menuconfig, file);
    }
}
declare namespace feng3d.editor {
    enum AssetExtension {
        folder = "folder",
        material = "material",
        geometry = "geometry",
        gameobject = "gameobject",
        anim = "anim",
        shader = "shader",
        png = "png",
        jpg = "jpg",
        jpeg = "jpeg",
        gif = "gif",
        ts = "ts",
        js = "js",
        txt = "txt",
        json = "json",
        scene = "scene",
    }
    class AssetsFile extends TreeNode {
        /**
         * 路径
         */
        path: string;
        /**
         * 创建时间
         */
        birthtime: number;
        /**
         * 修改时间
         */
        mtime: number;
        /**
         * 是否文件夹
         */
        isDirectory: boolean;
        /**
         * 文件尺寸
         */
        size: number;
        /**
         * 父节点
         */
        parent: AssetsFile;
        /**
         * 子节点列表
         */
        children: AssetsFile[];
        /**
         * 目录深度
         */
        depth: number;
        /**
         * 文件夹是否打开
         */
        isOpen: boolean;
        /**
         * 图标名称或者路径
         */
        image: egret.Texture | string;
        /**
         * 文件夹名称
         */
        name: string;
        /**
         * 显示标签
         */
        label: string;
        /**
         * 扩展名
         */
        extension: AssetExtension;
        /**
         * 是否选中
         */
        selected: boolean;
        /**
         * 当前打开文件夹
         */
        currentOpenDirectory: boolean;
        /**
         * 缓存下来的数据 避免从文件再次加载解析数据
         */
        cacheData: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry;
        constructor(fileinfo: FileInfo, data?: string | ArrayBuffer | Uint8Array | Material | GameObject | AnimationClip | Geometry);
        pathChanged(): void;
        /**
         * 获取属性显示数据
         * @param callback 获取属性面板显示数据回调
         */
        showInspectorData(callback: (showdata: Object) => void): void;
        /**
         * 获取文件数据
         * @param callback 获取文件数据回调
         */
        getData(callback: (data: any) => void): void;
        /**
         * 设置拖拽数据
         * @param dragsource 拖拽数据
         */
        setDragSource(dragsource: DragData): void;
        /**
         * 初始化子文件
         */
        initChildren(depth: number, callback: () => void): void;
        /**
         * 根据相对路径获取子文件
         * @param path 相对路径
         */
        getFile(path: string | string[]): AssetsFile;
        removeChild(file: AssetsFile): void;
        /**
         * 从父节点移除
         */
        remove(): void;
        /**
         * 移除所有子节点
         */
        removeChildren(): void;
        /**
         * 销毁
         */
        destroy(): void;
        /**
         * 添加到父节点
         * @param parent 父节点
         */
        addto(parent: AssetsFile): void;
        /**
         * 删除文件（夹）
         */
        deleteFile(callback?: (assetsFile: AssetsFile) => void, includeRoot?: boolean): void;
        /**
         * 重命名
         * @param newname 新文件名称
         * @param callback 重命名完成回调
         */
        rename(newname: string, callback?: (file: AssetsFile) => void): void;
        /**
         * 移动文件（夹）到指定文件夹
         * @param destdirpath 目标文件夹路径
         * @param callback 移动文件完成回调
         */
        move(destdirpath: string, callback?: (file: AssetsFile) => void): void;
        /**
         * 新增子文件夹
         * @param newfoldername 新增文件夹名称
         * @param callback      完成回调
         */
        addfolder(newfoldername: string, callback?: (file: AssetsFile) => void): void;
        /**
         * 新增文件
         * @param filename 新增文件名称
         * @param content 文件内容
         * @param callback 完成回调
         */
        addfile(filename: string, content: string | ArrayBuffer | Material | GameObject | AnimationClip | Geometry, override?: boolean, callback?: (file: AssetsFile) => void): void;
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean, next?: (assetsFile: AssetsFile) => boolean): this[];
        /**
         * 获取一个新的不重名子文件名称
         */
        private getnewchildname(childname);
        /**
         * 获取脚本类名称
         * @param callback 回调函数
         */
        getScriptClassName(callback: (scriptClassName: string) => void): string;
        private openChanged();
    }
}
declare namespace feng3d.editor {
    class AssetsFileItemRenderer extends eui.ItemRenderer {
        icon: eui.Image;
        renameInput: RenameTextInput;
        data: AssetsFile;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private ondoubleclick();
        private onclick();
        private onrightclick(e);
        private onnameLabelclick();
    }
}
declare namespace feng3d.editor {
    class AssetsTreeItemRenderer extends TreeItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        renameInput: RenameTextInput;
        data: AssetsFile;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private onclick();
        private onrightclick(e);
        private onnameLabelclick();
    }
}
declare namespace feng3d.editor {
    class AssetsView extends eui.Component implements eui.UIComponent {
        treelist: eui.List;
        floderpathTxt: eui.Label;
        includeTxt: eui.TextInput;
        excludeTxt: eui.TextInput;
        filelistgroup: eui.Group;
        filelist: eui.List;
        filepathLabel: eui.Label;
        private _assetstreeInvalid;
        private listData;
        private filelistData;
        private fileDrag;
        private selectfile;
        constructor();
        private onComplete();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private initlist();
        update(): void;
        private invalidateAssetstree();
        updateAssetsTree(): void;
        updateShowFloder(host?: any, property?: string, oldvalue?: any): void;
        private onfilter();
        private selectedfilechanged();
        private selectfile_nameChanged();
        private onfilelistclick(e);
        private onfilelistrightclick(e);
        private onfloderpathTxtLink(evt);
    }
}
declare namespace feng3d.editor {
    var assetsFileTemplates: AssetsFileTemplates;
    class AssetsFileTemplates {
        /**
         *
         * @param scriptName 脚本名称（类名）
         */
        getNewScript(scriptName: any): string;
        /**
         *
         * @param shadername shader名称
         */
        getNewShader(shadername: string): string;
    }
}
declare namespace feng3d.editor {
    class TopView extends eui.Component implements eui.UIComponent {
        topGroup: eui.Group;
        mainButton: eui.Button;
        moveButton: eui.ToggleButton;
        rotateButton: eui.ToggleButton;
        scaleButton: eui.ToggleButton;
        worldButton: eui.ToggleButton;
        centerButton: eui.ToggleButton;
        helpButton: eui.Button;
        settingButton: eui.Button;
        qrcodeButton: eui.Button;
        playBtn: eui.Button;
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
        private onMainMenu(item);
        private onHelpButtonClick();
        private onButtonClick(event);
        private updateview();
    }
}
declare namespace feng3d.editor {
    class MainView extends eui.Component implements eui.UIComponent {
        constructor();
        private onComplete();
        private onAddedToStage();
        private onRemovedFromStage();
    }
}
declare namespace feng3d.editor {
    class AssetAdapter implements eui.IAssetAdapter {
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        getAsset(source: string, compFunc: Function, thisObject: any): void;
    }
}
declare namespace feng3d.editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView();
        setProgress(current: number, total: number): void;
    }
}
declare namespace feng3d.editor {
    class MainUI extends eui.UILayer {
        onComplete: () => void;
        constructor(onComplete?: () => void);
        /**
         * 加载进度界面
         * loading process interface
         */
        private loadingView;
        protected createChildren(): void;
        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        private onConfigComplete(event);
        private isThemeLoadEnd;
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        private onThemeLoadComplete();
        private isResourceLoadEnd;
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onResourceLoadComplete(event);
        private createScene();
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event);
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError(event);
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress(event);
    }
}
declare namespace feng3d.editor {
    class ThemeAdapter implements eui.IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}
declare namespace feng3d.editor {
    interface EditorUI {
        stage: egret.Stage;
        assetsview: AssetsView;
        mainview: MainView;
        maskLayer: eui.UILayer;
        popupLayer: eui.UILayer;
        /**
         * 属性面板
         */
        inspectorView: InspectorView;
    }
    var editorui: EditorUI;
}
declare namespace feng3d.editor {
    /**
     * 编辑器数据
     */
    var editorData: EditorData;
    /**
     * 编辑器数据
     */
    class EditorData {
        /**
         * 2D UI舞台
         */
        stage: egret.Stage;
        /**
         * 选中对象，游戏对象与资源文件列表
         * 选中对象时尽量使用 selectObject 方法设置选中对象
         */
        selectedObjects: (GameObject | AssetsFile)[];
        /**
         * 位移旋转缩放工具对象
         */
        mrsToolObject: GameObject;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(...objs: (GameObject | AssetsFile)[]): void;
        /**
         * 选中游戏对象列表
         */
        readonly selectedGameObjects: GameObject[];
        /**
         * 第一个选中游戏对象
         */
        readonly firstSelectedGameObject: GameObject;
        /**
         * 获取 受 MRSTool 控制的Transform列表
         */
        readonly mrsTransforms: Transform[];
        /**
         * 选中游戏对象列表
         */
        readonly selectedAssetsFile: AssetsFile[];
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetsPath(url: string): string;
    }
}
declare namespace feng3d.editor {
    class MRSToolTarget {
        private _controllerTargets;
        private _startScaleVec;
        private _showGameObject;
        private _controllerToolTransfrom;
        private _controllerTool;
        private _startTransformDic;
        showGameObject: Transform;
        controllerTool: Transform;
        controllerTargets: Transform[];
        constructor();
        private onShowObjectTransformChanged(event);
        private updateControllerImage();
        /**
         * 开始移动
         */
        startTranslation(): void;
        translation(addPos: Vector3): void;
        stopTranslation(): void;
        startRotate(): void;
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: Vector3): void;
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: Vector3, angle2: number, normal2: Vector3): void;
        stopRote(): void;
        startScale(): void;
        doScale(scale: Vector3): void;
        stopScale(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 移动工具模型组件
     */
    class MToolModel extends Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateAxis extends Component {
        private segmentMaterial;
        private material;
        private xArrow;
        readonly color: Color4;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        private update();
    }
    class CoordinateCube extends Component {
        private colorMaterial;
        private oCube;
        color: Color4;
        selectedColor: Color4;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        update(): void;
    }
    class CoordinatePlane extends Component {
        private colorMaterial;
        private segmentGeometry;
        color: Color4;
        borderColor: Color4;
        selectedColor: Color4;
        private selectedborderColor;
        readonly width: number;
        private _width;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        update(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 旋转工具模型组件
     */
    class RToolModel extends Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateRotationAxis extends Component {
        private segmentGeometry;
        private torusGeometry;
        private sector;
        radius: number;
        readonly color: Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: Vector3;
        private _filterNormal;
        init(gameObject: GameObject): void;
        private initModels();
        update(): void;
        showSector(startPos: Vector3, endPos: Vector3): void;
        hideSector(): void;
    }
    /**
     * 扇形对象
     */
    class SectorGameObject extends Component {
        private segmentGeometry;
        private geometry;
        private borderColor;
        radius: number;
        private _start;
        private _end;
        /**
         * 构建3D对象
         */
        init(gameObject: GameObject): void;
        update(start?: number, end?: number): void;
    }
    class CoordinateRotationFreeAxis extends Component {
        private segmentGeometry;
        private sector;
        private radius;
        color: Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        private _selected;
        init(gameObject: GameObject): void;
        private initModels();
        update(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 缩放工具模型组件
     */
    class SToolModel extends Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        init(gameObject: GameObject): void;
        private initModels();
    }
    class CoordinateScaleCube extends Component {
        private coordinateCube;
        private segmentGeometry;
        readonly color: Color4;
        private selectedColor;
        private length;
        selected: boolean;
        private _selected;
        scaleValue: number;
        private _scale;
        init(gameObject: GameObject): void;
        update(): void;
    }
}
declare namespace feng3d.editor {
    class MRSToolBase extends Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: Plane3D;
        protected startSceneTransform: Matrix4x4;
        protected _gameobjectControllerTarget: MRSToolTarget;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected toolModel: Component;
        selectedItem: CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateRotationAxis | CoordinateRotationFreeAxis | CoordinateScaleCube;
        gameobjectControllerTarget: MRSToolTarget;
        protected updateToolModel(): void;
        protected onMouseDown(): void;
        protected onMouseUp(): void;
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross(): Vector3;
        protected getMousePlaneCross(): Vector3;
    }
}
declare namespace feng3d.editor {
    /**
     * 位移工具
     */
    class MTool extends MRSToolBase {
        protected toolModel: MToolModel;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        private startPos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: Event<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d.editor {
    class RTool extends MRSToolBase {
        protected toolModel: RToolModel;
        private startPlanePos;
        private stepPlaneCross;
        private startMousePos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: Event<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d.editor {
    class STool extends MRSToolBase {
        protected toolModel: SToolModel;
        private startMousePos;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        init(gameObject: GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: Event<any>): void;
        private onMouseMove();
        protected onMouseUp(): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 游戏对象控制器类型
     */
    enum MRSToolType {
        /**
         * 移动
         */
        MOVE = 0,
        /**
         * 旋转
         */
        ROTATION = 1,
        /**
         * 缩放
         */
        SCALE = 2,
    }
    /**
     * 控制器数据
     */
    class MRSToolData {
        /**
         * 使用的控制工具类型
         */
        toolType: MRSToolType;
        /**
         * 是否使用世界坐标
         */
        isWoldCoordinate: boolean;
        /**
         * 坐标原点是否在质心
         */
        isBaryCenter: boolean;
    }
    /**
     * 控制器数据
     */
    var mrsTool: MRSToolData;
    /**
     * 位移旋转缩放工具
     */
    class MRSTool extends Component {
        private mTool;
        private rTool;
        private sTool;
        private _currentTool;
        private controllerTarget;
        private mrsToolObject;
        init(gameObject: GameObject): void;
        dispose(): void;
        private onSelectedGameObjectChange();
        private onToolTypeChange();
        private currentTool;
    }
}
declare namespace feng3d.editor {
    class HierarchyNode extends TreeNode {
        label?: string;
        depth?: number;
        isOpen: boolean;
        /**
         * 是否选中
         */
        selected?: boolean;
        /**
         * 游戏对象
         */
        gameobject: GameObject;
        /**
         * 父节点
         */
        parent?: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
        constructor(obj: Partial<HierarchyNode>);
        /**
         * 销毁
         */
        destroy(): void;
        private update();
        private onSelectedGameObjectChanged();
    }
}
declare namespace feng3d.editor {
    class HierarchyTree extends Tree {
        rootnode: HierarchyNode;
        /**
         * 获取选中节点
         */
        getSelectedNode(): HierarchyNode;
        init(gameobject: GameObject): void;
        delete(gameobject: GameObject): void;
        add(gameobject: GameObject): HierarchyNode;
        remove(gameobject: GameObject): void;
        /**
         * 获取节点
         */
        getNode(gameObject: GameObject): HierarchyNode;
    }
    var hierarchyTree: HierarchyTree;
}
declare namespace feng3d.editor {
    class Hierarchy {
        rootGameObject: GameObject;
        private _rootGameObject;
        constructor();
        private ongameobjectadded(event);
        private ongameobjectremoved(event);
        addGameoObjectFromAsset(path: string, parent?: GameObject): void;
    }
    var hierarchy: Hierarchy;
}
declare namespace feng3d.editor {
    class SceneRotateTool extends Component {
        showInInspector: boolean;
        serializable: boolean;
        init(gameObject: GameObject): void;
    }
}
declare namespace feng3d.editor {
    /**
     * 地面网格
     * @author feng 2016-10-29
     */
    class GroundGrid extends Component {
        private num;
        init(gameObject: GameObject): void;
    }
}
declare namespace feng3d.editor {
    var engine: Engine;
    var editorCamera: Camera;
    class EditorEngine extends Engine {
        scene: Scene3D;
        readonly camera: Camera;
        private _scene;
    }
    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    class Main3D {
        constructor();
        private init();
        private onEditorCameraRotate(e);
    }
    function creatNewScene(): Scene3D;
}
declare namespace feng3d.editor {
    class EditorComponent extends Component {
        serializable: boolean;
        showInInspector: boolean;
        scene: Scene3D;
        init(gameobject: GameObject): void;
        /**
         * 销毁
         */
        dispose(): void;
        private onAddedToScene();
        private onRemovedFromScene();
        private onAddComponentToScene(event);
        private onRemoveComponentFromScene(event);
        private addLightIcon(light);
        private removeLightIcon(light);
    }
}
declare namespace feng3d.editor {
    /**
     * 导航组件，提供生成导航网格功能
     */
    class Navigation extends Component {
        /**
         * 距离边缘半径
         */
        agentRadius: number;
        /**
         * 允许行走高度
         */
        agentHeight: number;
        /**
         * 允许行走坡度
         */
        maxSlope: number;
        init(gameobject: GameObject): void;
        private _navobject;
        /**
         * 清楚oav网格模型
         */
        clear(): void;
        /**
         * 计算导航网格数据
         */
        bake(): void;
    }
}
declare namespace feng3d {
    class ThreeBSP {
        tree: ThreeBSPNode;
        constructor(geometry?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        } | ThreeBSPNode);
        toGeometry(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 相减
         * @param other
         */
        subtract(other: ThreeBSP): ThreeBSP;
        /**
         * 相加
         * @param other
         */
        union(other: ThreeBSP): ThreeBSP;
        /**
         * 相交
         * @param other
         */
        intersect(other: ThreeBSP): ThreeBSP;
    }
    /**
     * 顶点
     */
    class ThreeBSPVertex {
        /**
         * 坐标
         */
        position: Vector3;
        /**
         * uv
         */
        uv: Vector2;
        /**
         * 法线
         */
        normal: Vector3;
        constructor(position: Vector3, normal: Vector3, uv: Vector2);
        /**
         * 克隆
         */
        clone(): ThreeBSPVertex;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        lerp(v: ThreeBSPVertex, alpha: number): this;
        interpolate(v: ThreeBSPVertex, alpha: number): ThreeBSPVertex;
    }
    /**
     * 多边形
     */
    class ThreeBSPPolygon {
        /**
         * 多边形所在面w值
         */
        w: number;
        /**
         * 法线
         */
        normal: Vector3;
        /**
         * 顶点列表
         */
        vertices: ThreeBSPVertex[];
        constructor(vertices?: ThreeBSPVertex[]);
        /**
         * 获取多边形几何体数据
         * @param data
         */
        getGeometryData(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
        }): {
            positions: number[];
            uvs: number[];
            normals: number[];
        };
        /**
         * 计算法线与w值
         */
        calculateProperties(): this;
        /**
         * 克隆
         */
        clone(): ThreeBSPPolygon;
        /**
         * 翻转多边形
         */
        invert(): this;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        classifyVertex(vertex: ThreeBSPVertex): number;
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        classifySide(polygon: ThreeBSPPolygon): number;
        /**
         * 切割多边形
         * @param poly
         */
        tessellate(poly: ThreeBSPPolygon): ThreeBSPPolygon[];
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        subdivide(polygon: ThreeBSPPolygon, coplanar_front: ThreeBSPPolygon[], coplanar_back: ThreeBSPPolygon[], front: ThreeBSPPolygon[], back: ThreeBSPPolygon[]): void;
    }
    /**
     * 节点
     */
    class ThreeBSPNode {
        /**
         * 多边形列表
         */
        polygons: ThreeBSPPolygon[];
        /**
         * 切割面
         */
        divider: ThreeBSPPolygon;
        front: ThreeBSPNode;
        back: ThreeBSPNode;
        constructor(data?: {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        });
        /**
         * 获取几何体数据
         */
        getGeometryData(): {
            positions: number[];
            uvs: number[];
            normals: number[];
            indices: number[];
        };
        /**
         * 克隆
         */
        clone(): ThreeBSPNode;
        /**
         * 构建树节点
         * @param polygons 多边形列表
         */
        build(polygons: ThreeBSPPolygon[]): this;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        isConvex(polys: ThreeBSPPolygon[]): boolean;
        /**
         * 所有多边形
         */
        allPolygons(): ThreeBSPPolygon[];
        /**
         * 翻转
         */
        invert(): this;
        /**
         * 裁剪多边形
         * @param polygons
         */
        clipPolygons(polygons: ThreeBSPPolygon[]): ThreeBSPPolygon[];
        clipTo(node: ThreeBSPNode): this;
    }
}
declare namespace feng3d {
}
declare namespace navigation {
    class NavigationProcess {
        private data;
        constructor(geometry: {
            positions: number[];
            indices: number[];
        });
        checkMaxSlope(maxSlope: number): void;
        checkAgentRadius(agentRadius: number): void;
        checkAgentHeight(agentHeight: number): void;
        getGeometry(): {
            positions: number[];
            indices: number[];
        };
        private debugShowLines1(line0s, length);
        private debugShowLines(lines);
        /**
         * 获取所有独立边
         */
        private getAllSingleLine();
    }
}
declare var segmentGeometry: feng3d.SegmentGeometry;
declare var debugSegment: feng3d.GameObject;
declare var pointGeometry: feng3d.PointGeometry;
declare var debugPoint: feng3d.GameObject;
declare function createSegment(): void;
declare namespace egret {
    type MouseEvent = egret.TouchEvent;
    var MouseEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: string;
        /** 鼠标弹起 */
        MOUSE_UP: string;
        /** 鼠标移动 */
        MOUSE_MOVE: string;
        /** 鼠标单击 */
        CLICK: string;
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键点击 */
        RIGHT_CLICK: "rightclick";
        /** 双击 */
        DOUBLE_CLICK: "dblclick";
    };
    var mouseEventEnvironment: () => void;
}
declare namespace feng3d.editor {
    /**
     * 编辑器脚本
     */
    class EditorScript extends ScriptComponent {
        showInInspector: boolean;
        serializable: boolean;
        flag: ScriptFlag;
    }
}
declare namespace feng3d.editor {
    class MouseRayTestScript extends EditorScript {
        init(gameObject: GameObject): void;
        private onclick();
        update(): void;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare namespace feng3d.editor {
    class DirectionLightIcon extends EditorScript {
        private lightIcon;
        private lightLines;
        private textureMaterial;
        private directionalLight;
        init(gameObject: GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
    }
}
declare namespace feng3d.editor {
    class PointLightIcon extends EditorScript {
        showInInspector: boolean;
        serializable: boolean;
        private lightIcon;
        private lightLines;
        private lightLines1;
        private lightpoints;
        private textureMaterial;
        private pointLight;
        private segmentGeometry;
        private pointGeometry;
        init(gameObject: GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
    }
}
declare namespace feng3d.editor {
    var threejsLoader: {
        load: (url: string | ArrayBuffer | File, onParseComplete?: (group: any) => void) => void;
    };
}
declare namespace feng3d.editor {
    var mainMenu: MenuItem[];
    /**
     * 层级界面创建3D对象列表数据
     */
    var createObjectConfig: MenuItem[];
    var needcreateComponentGameObject: GameObject;
    /**
     * 层级界面创建3D对象列表数据
     */
    var createComponentConfig: MenuItem[];
}
declare namespace feng3d.editor {
}
/**
 * 快捷键配置
 */
declare var shortcutConfig: ({
    key: string;
    command: string;
    stateCommand: string;
    when: string;
} | {
    key: string;
    command: string;
    when: string;
} | {
    key: string;
    stateCommand: string;
    when: string;
})[];
declare namespace feng3d.editor {
    interface EditorEventMap {
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: Vector3;
    }
    var editorDispatcher: IEventDispatcher<EditorEventMap>;
}
declare namespace feng3d.editor {
    var editorData: EditorData;
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    class Editor extends eui.UILayer {
        private mainView;
        constructor();
        private init();
        private initMainView();
        private onresize();
        private initproject(callback);
        private _onAddToStage();
    }
}
