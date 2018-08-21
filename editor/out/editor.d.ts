declare namespace editor {
    var utils: Utils;
    class Utils {
        /**
         * 获取所有类
         */
        getAllClasss(root: Window, rootpath: "", depth?: number): void;
    }
}
declare namespace editor {
    /**
     * 常用正则表示式
     */
    var regExps: RegExps;
    /**
     * 常用正则表示式
     */
    class RegExps {
        /**
         * json文件
         */
        json: RegExp;
        /**
         * 图片
         */
        image: RegExp;
        /**
         * 声音
         */
        audio: RegExp;
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
declare namespace editor {
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
        private updateStats;
    }
}
declare function require(module: string): any;
declare var __dirname: string;
declare namespace editor {
    var fs: EditorAssets1;
    class EditorAssets1 extends feng3d.ReadWriteAssets {
        constructor(readWriteFS?: feng3d.ReadWriteFS);
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
        upgradeProject(callback: () => void): void;
        selectFile(callback: (file: FileList) => void): void;
        /**
         * 导出项目
         */
        exportProject(callback: (err: Error, data: Blob) => void): void;
        /**
         * 导入项目
         */
        importProject(file: File, callback: () => void): void;
    }
}
declare namespace editor {
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
declare namespace editor {
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
        gameobject?: feng3d.GameObject;
        animationclip?: feng3d.AnimationClip;
        material?: feng3d.Material;
        geometry?: feng3d.Geometry;
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
        /**
         * 声音路径
         */
        audio?: string;
        /**
         * 立方体纹理
         */
        texturecube?: feng3d.TextureCube;
    }
}
declare namespace editor {
    class Editorshortcut {
        private preMousePoint;
        private selectedObjectsHistory;
        private dragSceneMousePoint;
        private dragSceneCameraGlobalMatrix3D;
        private rotateSceneCenter;
        private rotateSceneCameraGlobalMatrix3D;
        private rotateSceneMousePoint;
        constructor();
        private onGameobjectMoveTool;
        private onGameobjectRotationTool;
        private onGameobjectScaleTool;
        private onSceneCameraForwardBackMouseMoveStart;
        private onSceneCameraForwardBackMouseMove;
        private onSelectGameObject;
        private onDeleteSeletedGameObject;
        private onDragSceneStart;
        private onDragScene;
        private onFpsViewStart;
        private onFpsViewStop;
        private updateFpsView;
        private onMouseRotateSceneStart;
        private onMouseRotateScene;
        private onLookToSelectedGameObject;
        private onMouseWheelMoveSceneCamera;
    }
    class SceneControlConfig {
        mouseWheelMoveStep: number;
        lookDistance: number;
        sceneCameraForwardBackwardStep: number;
    }
    var sceneControlConfig: SceneControlConfig;
}
declare namespace editor {
    class Feng3dView extends eui.Component implements eui.UIComponent {
        fullbutton: eui.Button;
        private canvas;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onResize;
    }
}
declare namespace editor {
    class CameraPreview extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        private canvas;
        private previewEngine;
        camera: feng3d.Camera;
        private _camera;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onResize;
        private onDataChange;
        private onframe;
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
    private onnameeditChanged;
}
declare namespace editor {
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
        private onMouseMove;
        private _findSplit;
        private onMouseDown;
        private onMouseUp;
    }
}
declare namespace editor {
    var maskview: Maskview;
    class Maskview {
        mask(displayObject: egret.DisplayObject, onMaskClick?: () => void): void;
    }
}
declare namespace editor {
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
    private init;
    private updateview;
    private onClick;
    private onlistChange;
}
declare namespace editor {
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
        private onTitleButtonClick;
    }
}
declare namespace editor {
    class ColorPicker extends eui.Component implements eui.UIComponent {
        picker: eui.Rect;
        value: feng3d.Color3;
        private _value;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onClick;
    }
}
declare namespace editor {
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
        private onDisclosureButtonClick;
        private updateView;
    }
}
declare namespace editor {
    class MenuItemRenderer extends eui.ItemRenderer {
        data: MenuItem;
        menuUI: MenuUI;
        selectedRect: eui.Rect;
        protected dataChanged(): void;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private updateView;
        private onItemMouseDown;
        private onItemMouseOver;
        private onItemMouseOut;
        private onsubMenuUIRemovedFromeStage;
    }
}
declare namespace editor {
    class TreeNode {
        /**
         * 标签
         */
        label: string;
        /**
         * 目录深度
         */
        depth: number;
        /**
         * 是否打开
         */
        isOpen: boolean;
        /**
         * 是否选中
         */
        selected: boolean;
        /**
         * 父节点
         */
        parent: TreeNode;
        /**
         * 子节点列表
         */
        children: TreeNode[];
        constructor(obj?: gPartial<TreeNode>);
        /**
         * 销毁
         */
        destroy(): void;
        private selectedchange;
    }
    interface TreeEventMap {
        added: TreeNode;
        removed: TreeNode;
        changed: TreeNode;
        openChanged: TreeNode;
    }
    interface Tree {
        once<K extends keyof TreeEventMap>(type: K, listener: (event: feng3d.Event<TreeEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeEventMap>(type: K, data?: TreeEventMap[K], bubbles?: boolean): feng3d.Event<TreeEventMap[K]>;
        has<K extends keyof TreeEventMap>(type: K): boolean;
        on<K extends keyof TreeEventMap>(type: K, listener: (event: feng3d.Event<TreeEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeEventMap>(type?: K, listener?: (event: feng3d.Event<TreeEventMap[K]>) => any, thisObject?: any): any;
    }
    class Tree extends feng3d.EventDispatcher {
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
        private isopenchanged;
    }
    function treeMap<T extends TreeNode>(treeNode: T, callback: (node: T, parent: T) => void): void;
}
declare namespace editor {
    class Vector3DView extends eui.Component implements eui.UIComponent {
        group: eui.Group;
        xTextInput: eui.TextInput;
        yTextInput: eui.TextInput;
        zTextInput: eui.TextInput;
        wGroup: eui.Group;
        wTextInput: eui.TextInput;
        vm: feng3d.Vector3 | feng3d.Vector4;
        private _vm;
        constructor();
        showw: any;
        private _showw;
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private addItemEventListener;
        private removeItemEventListener;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        updateView(): void;
        private onTextChange;
    }
}
declare namespace editor {
    class ComponentView extends eui.Component {
        component: feng3d.Components;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        componentIcon: eui.Image;
        helpBtn: eui.Button;
        operationBtn: eui.Button;
        scriptView: feng3d.IObjectView;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.Components);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete;
        private onDeleteButton;
        private onAddToStage;
        private onRemovedFromStage;
        private updateEnableCB;
        private onEnableCBChange;
        private initScriptView;
        private removeScriptView;
        private onOperationBtnClick;
        private onHelpBtnClick;
        private onScriptChanged;
    }
}
declare namespace editor {
    class ParticleComponentView extends eui.Component {
        component: feng3d.ParticleComponent;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        scriptView: feng3d.IObjectView;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.ParticleComponent);
        /**
         * 更新界面
         */
        updateView(): void;
        private onComplete;
        private onAddToStage;
        private onRemovedFromStage;
        private updateEnableCB;
        private onEnableCBChange;
    }
}
declare namespace editor {
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
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private updateView;
        remove(): void;
    }
}
declare namespace editor {
    var toolTip: ToolTip;
    interface ITipView extends egret.DisplayObject {
        value: any;
    }
    class ToolTip {
        /**
         * 默认 提示界面
         */
        defaultTipview: () => typeof TipString;
        /**
         * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
         */
        tipviewmap: Map<any, new () => ITipView>;
        private tipmap;
        private tipView;
        register(displayObject: egret.DisplayObject, tip: any): void;
        unregister(displayObject: egret.DisplayObject): void;
        private ischeck;
        private _ischeck;
        private onMouseMove;
        private removeTipview;
    }
}
declare namespace editor {
    /**
     * String 提示框
     */
    class TipString extends eui.Component implements eui.UIComponent {
        txtLab: eui.Label;
        constructor();
        value: string;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private valuechanged;
    }
}
declare namespace editor {
    /**
     * 默认基础对象界面
     */
    class OVBaseDefault extends eui.Component implements feng3d.IObjectView {
        label: eui.Label;
        image: eui.Image;
        private _space;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
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
declare namespace editor {
    /**
     * 默认使用块的对象界面
     */
    class OVDefault extends eui.Component implements feng3d.IObjectView {
        private _space;
        private _objectViewInfo;
        private blockViews;
        group: eui.Group;
        /**
         * 对象界面数据
         */
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initview(): void;
        dispose(): void;
        space: Object;
        /**
         * 更新界面
         */
        updateView(): void;
        getblockView(blockName: string): feng3d.IObjectBlockView;
        getAttributeView(attributeName: string): feng3d.IObjectAttributeView;
    }
}
declare namespace editor {
    class OVTransform extends eui.Component implements feng3d.IObjectView {
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
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private addItemEventListener;
        private removeItemEventListener;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
        space: feng3d.Transform;
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
        /**
         * 更新界面
         */
        updateView(): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性块界面
     */
    class OBVDefault extends eui.Component implements feng3d.IObjectBlockView {
        private _space;
        private _blockName;
        private attributeViews;
        private itemList;
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Button;
        contentGroup: eui.Group;
        border: eui.Rect;
        objectView: feng3d.IObjectView;
        /**
         * @inheritDoc
         */
        constructor(blockViewInfo: feng3d.BlockViewInfo);
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        initView(): void;
        dispose(): void;
        space: Object;
        readonly blockName: string;
        updateView(): void;
        getAttributeView(attributeName: String): feng3d.IObjectAttributeView;
        private onTitleButtonClick;
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
declare namespace editor {
    class OAVBase extends eui.Component implements feng3d.IObjectAttributeView {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected attributeViewInfo: feng3d.AttributeViewInfo;
        labelLab: eui.Label;
        /**
         * 对象属性界面
         */
        objectView: feng3d.IObjectView;
        /**
         * 对象属性块界面
         */
        objectBlockView: feng3d.IObjectBlockView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: any;
        private label;
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
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVDefault extends OAVBase {
        labelLab: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        dragparam: {
            accepttype: keyof DragData;
            datatype: string;
        };
        private _textEnabled;
        textEnabled: boolean;
        initView(): void;
        dispose(): void;
        private _textfocusintxt;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
        private onTextChange;
    }
}
declare namespace editor {
    class OAVBoolean extends OAVBase {
        checkBox: eui.CheckBox;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVNumber extends OAVDefault {
        /**
         * 步长，精度
         */
        step: number;
        /**
         * 键盘上下方向键步长
         */
        stepDownup: number;
        /**
         * 移动一个像素时增加的步长数量
         */
        stepScale: number;
        attributeValue: number;
        initView(): void;
        dispose(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private mouseDownPosition;
        private mouseDownValue;
        private onMouseDown;
        private onStageMouseMove;
        private onStageMouseUp;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
        private onWindowKeyDown;
    }
}
declare namespace editor {
    class OAVVector3D extends OAVBase {
        labelLab: eui.Label;
        vector3DView: editor.Vector3DView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
    }
}
declare namespace editor {
    class OAVArray extends OAVBase {
        group: eui.Group;
        titleGroup: eui.Group;
        titleButton: eui.Rect;
        contentGroup: eui.Group;
        sizeTxt: eui.TextInput;
        private attributeViews;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: Object;
        readonly attributeName: string;
        attributeValue: any[];
        initView(): void;
        dispose(): void;
        private onTitleButtonClick;
        private onsizeTxtfocusout;
    }
    class OAVArrayItem extends OAVDefault {
        constructor(arr: any[], index: number, componentParam: Object);
        initView(): void;
    }
}
declare namespace editor {
    class OAVEnum extends OAVBase {
        labelLab: eui.Label;
        combobox: ComboBox;
        private list;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        enumClass: any;
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onComboxChange;
    }
}
declare namespace editor {
    class OAVComponentList extends OAVBase {
        protected _space: feng3d.GameObject;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        private onAddComponentButtonClick;
        space: feng3d.GameObject;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        private addComponentView;
        /**
         * 更新界面
         */
        updateView(): void;
        private removedComponentView;
        private onaddedcompont;
        private onremovedComponent;
    }
}
declare namespace editor {
    class OAVFunction extends OAVBase {
        labelLab: eui.Label;
        button: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected click(event: egret.Event): void;
    }
}
declare namespace editor {
    class OAVColorPicker extends OAVBase {
        labelLab: eui.Label;
        colorPicker: editor.ColorPicker;
        input: eui.TextInput;
        attributeValue: feng3d.Color3 | feng3d.Color4;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        protected onChange(event: egret.Event): void;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
    }
}
declare namespace editor {
    class OAVMaterialName extends OAVBase {
        tileIcon: eui.Image;
        nameLabel: eui.Label;
        operationBtn: eui.Button;
        helpBtn: eui.Button;
        shaderComboBox: ComboBox;
        group: eui.Group;
        space: feng3d.Material;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onShaderComboBoxChange;
    }
}
declare namespace editor {
    class OAVObjectView extends OAVBase {
        group: eui.Group;
        views: feng3d.IObjectView[];
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        updateView(): void;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare namespace editor {
    class OAVGameObjectName extends OAVBase {
        nameInput: eui.TextInput;
        visibleCB: eui.CheckBox;
        mouseEnabledCB: eui.CheckBox;
        space: feng3d.GameObject;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onVisibleCBClick;
        private onMouseEnabledCBClick;
        private _textfocusintxt;
        private ontxtfocusin;
        private ontxtfocusout;
        private onTextChange;
    }
}
declare namespace editor {
    /**
     * 挑选（拾取）OAV界面
     */
    class OAVPick extends OAVBase {
        labelLab: eui.Label;
        text: eui.Label;
        pickBtn: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private ontxtClick;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
    }
}
declare namespace editor {
    /**
     * 挑选（拾取）OAV界面
     */
    class OAVTexture2D extends OAVBase {
        image: eui.Image;
        img_border: eui.Image;
        pickBtn: eui.Button;
        labelLab: eui.Label;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private ontxtClick;
        /**
         * 更新界面
         */
        updateView(): void;
        private onDoubleClick;
    }
}
declare namespace editor {
    class OAVParticleComponentList extends OAVBase {
        protected _space: feng3d.ParticleSystem;
        group: eui.Group;
        addComponentButton: eui.Button;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        private onAddComponentButtonClick;
        space: feng3d.ParticleSystem;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        private addComponentView;
        /**
         * 更新界面
         */
        updateView(): void;
        private removedComponentView;
    }
}
declare namespace editor {
    /**
     * 属性面板（检查器）
     */
    class InspectorView extends eui.Component implements eui.UIComponent {
        backButton: eui.Button;
        group: eui.Group;
        private view;
        private viewData;
        private viewDataList;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onSelectedObjectsChanged;
        updateView(): void;
        showData(data: any, removeBack?: boolean): void;
        onBackButton(): void;
    }
}
declare namespace editor {
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
        private setdargSource;
        private onclick;
        dataChanged(): void;
        private onrightclick;
    }
}
declare namespace editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        addButton: eui.Button;
        list: eui.List;
        private listData;
        /**
         * 选中节点
         */
        private selectedNode;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private invalidHierarchy;
        private updateHierarchyTree;
        private onListbackClick;
        private onListClick;
        private onListRightClick;
    }
}
declare namespace feng3d {
    interface Feng3dEventMap {
        /**
         * 资源显示文件夹发生变化
         */
        "assets.showFloderChanged": {
            oldpath: string;
            newpath: string;
        };
        /**
         * 删除文件
         */
        "assets.deletefile": {
            path: string;
        };
    }
}
declare namespace editor {
    var editorAssets: EditorAssets;
    class EditorAssets {
        assetsPath: string;
        /**
         * 显示文件夹
         */
        showFloder: string;
        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent;
        files: {
            [path: string]: AssetsFile;
        };
        initproject(callback: () => void): void;
        /**
         * 获取文件
         * @param path 文件路径
         */
        getFile(path: string): AssetsFile;
        /**
         * 删除文件
         * @param path 文件路径
         */
        deletefile(path: string, callback?: () => void, includeRoot?: boolean): void;
        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void): void;
        /**
         * 保存场景到文件
         * @param path 场景路径
         * @param scene 保存的场景
         */
        saveScene(path: string, scene: feng3d.Scene3D, callback?: (err: Error) => void): void;
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
        popupmenu(assetsFile: AssetsFile, othermenus?: {
            rename?: MenuItem;
        }): void;
        /**
         * 获取一个新路径
         */
        getnewpath(path: string, callback: (newpath: string) => void): void;
        saveObject(object: feng3d.GameObject | feng3d.AnimationClip | feng3d.Material | feng3d.Geometry, filename: string, override?: boolean, callback?: (file: AssetsFile) => void): void;
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        filter(fn: (assetsFile: AssetsFile) => boolean): AssetsFile[];
        /**
         *
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetsFiles 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetsFile[]) => void, assetsFiles?: AssetsFile[]): void;
        runProjectScript(callback?: () => void): void;
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetsFile 文件
         */
        private parserMenu;
        private showFloderChanged;
    }
    var codeeditoWin: Window;
}
declare namespace editor {
    type AssetsDataType = ArrayBuffer | string | feng3d.Material | feng3d.GameObject | feng3d.AnimationClip | feng3d.Geometry | feng3d.Texture2D | feng3d.TextureCube;
    class AssetsFile {
        /**
         * 路径
         */
        path: string;
        /**
         * 是否文件夹
         */
        isDirectory: boolean;
        /**
         * 图标名称或者路径
         */
        image: string;
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
        extension: feng3d.AssetExtension;
        /**
         * 是否选中
         */
        selected: boolean;
        /**
         * 缓存下来的数据 避免从文件再次加载解析数据
         */
        cacheData: AssetsDataType;
        constructor(path: string, data?: AssetsDataType);
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
        moveToDir(destdirpath: string, callback?: (file: AssetsFile) => void): void;
        /**
         * 移动文件（夹）
         * @param oldpath 老路径
         * @param newpath 新路径
         * @param callback 回调函数
         */
        move(oldpath: string, newpath: string, callback?: (file: AssetsFile) => void): void;
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
        addfile(filename: string, content: AssetsDataType, override?: boolean, callback?: (file: AssetsFile) => void): void;
        /**
         * 新增文件从ArrayBuffer
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        addfileFromArrayBuffer(filename: string, arraybuffer: ArrayBuffer, override?: boolean, callback?: (e: Error, file: AssetsFile) => void): void;
        /**
         * 保存数据到文件
         * @param create 如果文件不存在，是否新建文件
         * @param callback 回调函数
         */
        save(create?: boolean, callback?: (err: Error) => void): void;
        /**
         * 获取ArrayBuffer数据
         * @param callback 回调函数
         */
        getArrayBuffer(callback: (arraybuffer: ArrayBuffer) => void): void;
        /**
         * 获取一个新的不重名子文件名称
         */
        private getnewname;
        /**
         * 获取脚本类名称
         * @param callback 回调函数
         */
        getScriptClassName(callback: (scriptClassName: string) => void): string;
    }
}
declare namespace editor {
    class AssetsFileItemRenderer extends eui.ItemRenderer {
        icon: eui.Image;
        renameInput: RenameTextInput;
        data: AssetsFile;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private ondoubleclick;
        private onclick;
        private onrightclick;
    }
}
declare namespace editor {
    var assetsTree: AssetsTree;
    class AssetsTree {
        nodes: {
            [path: string]: AssetsTreeNode;
        };
        constructor();
        getNode(path: string): AssetsTreeNode;
        private onShowFloderChanged;
    }
    class AssetsTreeNode extends TreeNode {
        path: string;
        /**
         * 文件夹是否打开
         */
        isOpen: boolean;
        readonly label: string;
        readonly parent: AssetsTreeNode;
        readonly assetsFile: AssetsFile;
        children: AssetsTreeNode[];
        constructor(path: string);
        private openChanged;
    }
}
declare namespace editor {
    class AssetsTreeItemRenderer extends TreeItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        renameInput: RenameTextInput;
        data: AssetsTreeNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private onclick;
        private onrightclick;
    }
}
declare namespace editor {
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
        private onComplete;
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private initlist;
        private update;
        invalidateAssetstree(): void;
        private updateAssetsTree;
        private updateShowFloder;
        private onfilter;
        private selectedfilechanged;
        private onfilelistclick;
        private onfilelistrightclick;
        private onfloderpathTxtLink;
    }
}
declare namespace editor {
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
declare namespace editor {
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
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onMainMenu;
        private onHelpButtonClick;
        private onButtonClick;
        private updateview;
    }
    var runwin: Window;
}
declare namespace editor {
    class MainView extends eui.Component implements eui.UIComponent {
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
    }
}
declare namespace editor {
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
declare namespace editor {
    class LoadingUI extends egret.Sprite {
        constructor();
        private textField;
        private createView;
        setProgress(current: number, total: number): void;
    }
}
declare namespace editor {
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
        private onConfigComplete;
        private isThemeLoadEnd;
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        private onThemeLoadComplete;
        private isResourceLoadEnd;
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onResourceLoadComplete;
        private createScene;
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError;
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError;
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress;
    }
}
declare namespace editor {
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
declare namespace editor {
    interface EditorUI {
        stage: egret.Stage;
        assetsview: AssetsView;
        mainview: MainView;
        tooltipLayer: eui.UILayer;
        maskLayer: eui.UILayer;
        popupLayer: eui.UILayer;
        /**
         * 属性面板
         */
        inspectorView: InspectorView;
    }
    var editorui: EditorUI;
}
declare namespace editor {
    /**
     * 编辑器数据
     */
    var editorData: EditorData;
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
        SCALE = 2
    }
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
        readonly selectedObjects: (feng3d.GameObject | AssetsFile)[];
        private _selectedObjects;
        clearSelectedObjects(): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(...objs: (feng3d.GameObject | AssetsFile)[]): void;
        /**
         * 使用的控制工具类型
         */
        toolType: MRSToolType;
        private _toolType;
        /**
         * 选中游戏对象列表
         */
        readonly selectedGameObjects: feng3d.GameObject[];
        private _selectedGameObjects;
        private _selectedGameObjectsInvalid;
        /**
         * 坐标原点是否在质心
         */
        isBaryCenter: boolean;
        private _isBaryCenter;
        /**
         * 是否使用世界坐标
         */
        isWoldCoordinate: boolean;
        private _isWoldCoordinate;
        /**
         * 变换对象
         */
        readonly transformGameObject: feng3d.GameObject;
        private _transformGameObject;
        private _transformGameObjectInvalid;
        readonly transformBox: feng3d.Box;
        private _transformBox;
        private _transformBoxInvalid;
        /**
         * 获取 受 MRSTool 控制的Transform列表
         */
        readonly mrsTransforms: feng3d.Transform[];
        /**
         * 选中游戏对象列表
         */
        readonly selectedAssetsFile: (feng3d.GameObject | AssetsFile)[];
        private _selectedAssetsFileInvalid;
        private _selectedAssetsFile;
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        getEditorAssetsPath(url: string): string;
    }
}
declare namespace editor {
    class MRSToolTarget {
        private _controllerTargets;
        private _startScaleVec;
        private _showGameObject;
        private _controllerToolTransfrom;
        private _controllerTool;
        private _startTransformDic;
        showGameObject: feng3d.Transform;
        controllerTool: feng3d.Transform;
        controllerTargets: feng3d.Transform[];
        constructor();
        private onShowObjectTransformChanged;
        private updateControllerImage;
        /**
         * 开始移动
         */
        startTranslation(): void;
        translation(addPos: feng3d.Vector3): void;
        stopTranslation(): void;
        startRotate(): void;
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        rotate1(angle: number, normal: feng3d.Vector3): void;
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        rotate2(angle1: number, normal1: feng3d.Vector3, angle2: number, normal2: feng3d.Vector3): void;
        stopRote(): void;
        startScale(): void;
        doScale(scale: feng3d.Vector3): void;
        stopScale(): void;
        private getTransformData;
        private rotateRotation;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MToolModel: editor.MToolModel;
    }
}
declare namespace editor {
    /**
     * 移动工具模型组件
     */
    class MToolModel extends feng3d.Component {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
        zAxis: CoordinateAxis;
        yzPlane: CoordinatePlane;
        xzPlane: CoordinatePlane;
        xyPlane: CoordinatePlane;
        oCube: CoordinateCube;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateAxis extends feng3d.Component {
        private isinit;
        private segmentMaterial;
        private material;
        private xArrow;
        readonly color: feng3d.Color4;
        private selectedColor;
        private length;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
    class CoordinateCube extends feng3d.Component {
        private isinit;
        private colorMaterial;
        private oCube;
        color: feng3d.Color4;
        selectedColor: feng3d.Color4;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
    class CoordinatePlane extends feng3d.Component {
        private isinit;
        private colorMaterial;
        private segmentGeometry;
        color: feng3d.Color4;
        borderColor: feng3d.Color4;
        selectedColor: feng3d.Color4;
        private selectedborderColor;
        readonly width: number;
        private _width;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        RToolModel: editor.RToolModel;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SectorGameObject: editor.SectorGameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateRotationFreeAxis: editor.CoordinateRotationFreeAxis;
    }
}
declare namespace editor {
    /**
     * 旋转工具模型组件
     */
    class RToolModel extends feng3d.Component {
        xAxis: CoordinateRotationAxis;
        yAxis: CoordinateRotationAxis;
        zAxis: CoordinateRotationAxis;
        freeAxis: CoordinateRotationFreeAxis;
        cameraAxis: CoordinateRotationAxis;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateRotationAxis extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private torusGeometry;
        private sector;
        radius: number;
        readonly color: feng3d.Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        /**
         * 过滤法线显示某一面线条
         */
        filterNormal: feng3d.Vector3;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
        update(): void;
        showSector(startPos: feng3d.Vector3, endPos: feng3d.Vector3): void;
        hideSector(): void;
    }
    /**
     * 扇形对象
     */
    class SectorGameObject extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private geometry;
        private borderColor;
        radius: number;
        private _start;
        private _end;
        /**
         * 构建3D对象
         */
        init(gameObject: feng3d.GameObject): void;
        update(start?: number, end?: number): void;
    }
    class CoordinateRotationFreeAxis extends feng3d.Component {
        private isinit;
        private segmentGeometry;
        private sector;
        private radius;
        color: feng3d.Color4;
        private backColor;
        private selectedColor;
        selected: boolean;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
        update(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SToolModel: editor.SToolModel;
    }
}
declare namespace editor {
    /**
     * 缩放工具模型组件
     */
    class SToolModel extends feng3d.Component {
        xCube: CoordinateScaleCube;
        yCube: CoordinateScaleCube;
        zCube: CoordinateScaleCube;
        oCube: CoordinateCube;
        init(gameObject: feng3d.GameObject): void;
        private initModels;
    }
    class CoordinateScaleCube extends feng3d.Component {
        private isinit;
        private coordinateCube;
        private segmentGeometry;
        readonly color: feng3d.Color4;
        private selectedColor;
        private length;
        selected: boolean;
        scaleValue: number;
        init(gameObject: feng3d.GameObject): void;
        update(): void;
    }
}
declare namespace editor {
    class MRSToolBase extends feng3d.Component {
        private _selectedItem;
        private _toolModel;
        protected ismouseDown: boolean;
        protected movePlane3D: feng3d.Plane3D;
        protected startSceneTransform: feng3d.Matrix4x4;
        protected _gameobjectControllerTarget: MRSToolTarget;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        protected toolModel: feng3d.Component;
        selectedItem: CoordinateRotationFreeAxis | CoordinateAxis | CoordinatePlane | CoordinateCube | CoordinateRotationAxis | CoordinateScaleCube;
        gameobjectControllerTarget: MRSToolTarget;
        protected updateToolModel(): void;
        protected onMouseDown(): void;
        protected onMouseUp(): void;
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        protected getLocalMousePlaneCross(): feng3d.Vector3;
        protected getMousePlaneCross(): feng3d.Vector3;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MTool: editor.MTool;
    }
}
declare namespace editor {
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
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        RTool: editor.RTool;
    }
}
declare namespace editor {
    class RTool extends MRSToolBase {
        protected toolModel: RToolModel;
        private startPlanePos;
        private stepPlaneCross;
        private startMousePos;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
        protected updateToolModel(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        STool: editor.STool;
    }
}
declare namespace editor {
    class STool extends MRSToolBase {
        protected toolModel: SToolModel;
        private startMousePos;
        /**
         * 用于判断是否改变了XYZ
         */
        private changeXYZ;
        private startPlanePos;
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        private onMouseMove;
        protected onMouseUp(): void;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        MRSTool: editor.MRSTool;
    }
}
declare namespace editor {
    /**
     * 位移旋转缩放工具
     */
    class MRSTool extends feng3d.Component {
        private mTool;
        private rTool;
        private sTool;
        private _currentTool;
        private controllerTarget;
        private mrsToolObject;
        init(gameObject: feng3d.GameObject): void;
        dispose(): void;
        private onSelectedGameObjectChange;
        private onToolTypeChange;
        private currentTool;
    }
}
declare namespace editor {
    class HierarchyNode extends TreeNode {
        isOpen: boolean;
        /**
         * 游戏对象
         */
        gameobject: feng3d.GameObject;
        /**
         * 父节点
         */
        parent: HierarchyNode;
        /**
         * 子节点列表
         */
        children: HierarchyNode[];
        constructor(obj: gPartial<HierarchyNode>);
        /**
         * 销毁
         */
        destroy(): void;
        private update;
    }
}
declare namespace editor {
    /**
     * 层级树
     */
    var hierarchyTree: HierarchyTree;
    /**
     * 层级树
     */
    class HierarchyTree extends Tree {
        rootnode: HierarchyNode;
        private selectedGameObjects;
        constructor();
        /**
         * 获取选中节点
         */
        getSelectedNode(): HierarchyNode;
        init(gameobject: feng3d.GameObject): void;
        delete(gameobject: feng3d.GameObject): void;
        add(gameobject: feng3d.GameObject): HierarchyNode;
        remove(gameobject: feng3d.GameObject): void;
        /**
         * 获取节点
         */
        getNode(gameObject: feng3d.GameObject): HierarchyNode;
        private onSelectedGameObjectChanged;
    }
}
declare namespace feng3d {
    interface Feng3dEventMap {
        "editor.selectedObjectsChanged": any;
        "editor.isBaryCenterChanged": any;
        "editor.isWoldCoordinateChanged": any;
        "editor.toolTypeChanged": any;
    }
}
declare namespace editor {
    class Hierarchy {
        rootGameObject: feng3d.GameObject;
        private _rootGameObject;
        constructor();
        private ongameobjectadded;
        private ongameobjectremoved;
        addGameoObjectFromAsset(path: string, parent?: feng3d.GameObject): void;
    }
    var hierarchy: Hierarchy;
}
declare namespace feng3d {
    interface ComponentMap {
        SceneRotateTool: editor.SceneRotateTool;
    }
}
declare namespace editor {
    class SceneRotateTool extends feng3d.Component {
        showInInspector: boolean;
        serializable: boolean;
        init(gameObject: feng3d.GameObject): void;
        private onLoaded;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        GroundGrid: editor.GroundGrid;
    }
}
declare namespace editor {
    /**
     * 地面网格
     */
    class GroundGrid extends feng3d.Component {
        private num;
        init(gameObject: feng3d.GameObject): void;
    }
}
declare namespace editor {
    var engine: feng3d.Engine;
    var editorCamera: feng3d.Camera;
    var editorScene: feng3d.Scene3D;
    var editorComponent: EditorComponent;
    class EditorEngine extends feng3d.Engine {
        scene: feng3d.Scene3D;
        readonly camera: feng3d.Camera;
        private _scene;
        wireframeColor: feng3d.Color4;
        /**
         * 绘制场景
         */
        render(): void;
    }
    /**
    * 编辑器3D入口
    */
    class Main3D {
        constructor();
        private init;
        private onEditorCameraRotate;
    }
    function creatNewScene(): feng3d.Scene3D;
}
declare namespace feng3d {
    interface ComponentMap {
        EditorComponent: editor.EditorComponent;
    }
}
declare namespace editor {
    class EditorComponent extends feng3d.Component {
        scene: feng3d.Scene3D;
        private _scene;
        init(gameobject: feng3d.GameObject): void;
        /**
         * 销毁
         */
        dispose(): void;
        private onAddComponentToScene;
        private onRemoveComponentFromScene;
        private addLightIcon;
        private removeLightIcon;
        private directionLightIconMap;
        private pointLightIconMap;
        private spotLightIconMap;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Navigation: editor.Navigation;
    }
}
declare namespace editor {
    /**
     * 导航组件，提供生成导航网格功能
     */
    class Navigation extends feng3d.Component {
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
        init(gameobject: feng3d.GameObject): void;
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
        private debugShowLines1;
        private debugShowLines;
        /**
         * 获取所有独立边
         */
        private getAllSingleLine;
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
declare namespace editor {
    /**
     * 编辑器脚本
     */
    class EditorScript extends feng3d.ScriptComponent {
        flag: feng3d.ScriptFlag;
    }
}
declare namespace editor {
    class MouseRayTestScript extends EditorScript {
        init(gameObject: feng3d.GameObject): void;
        private onclick;
        update(): void;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare namespace editor {
    class DirectionLightIcon extends EditorScript {
        light: feng3d.DirectionalLight;
        private _light;
        private lightIcon;
        private lightLines;
        private textureMaterial;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class PointLightIcon extends EditorScript {
        light: feng3d.PointLight;
        private _light;
        private lightIcon;
        private lightLines;
        private lightpoints;
        private textureMaterial;
        private segmentGeometry;
        private pointGeometry;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class SpotLightIcon extends EditorScript {
        light: feng3d.SpotLight;
        private _light;
        private lightIcon;
        private lightLines;
        private lightpoints;
        private textureMaterial;
        private segmentGeometry;
        private pointGeometry;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    var threejsLoader: {
        load: typeof load;
    };
    function load(url: string | File | ArrayBuffer, onParseComplete?: (group: any) => void): void;
}
declare namespace editor {
    var mainMenu: MenuItem[];
    /**
     * 层级界面创建3D对象列表数据
     */
    var createObjectConfig: MenuItem[];
    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    function getCreateComponentMenu(gameobject: feng3d.GameObject): MenuItem[];
    /**
     * 获取创建粒子系统组件菜单
     * @param particleSystem 粒子系统
     */
    function getCreateParticleComponentMenu(particleSystem: feng3d.ParticleSystem): MenuItem[];
}
declare namespace editor {
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
    stateCommand?: undefined;
} | {
    key: string;
    stateCommand: string;
    when: string;
    command?: undefined;
})[];
declare namespace editor {
    interface EditorEventMap {
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: feng3d.Vector3;
    }
    var editorDispatcher: feng3d.IEventDispatcher<EditorEventMap>;
}
declare namespace editor {
    var editorData: EditorData;
    /**
     * feng3d的版本号
     */
    var revision: string;
    /**
     * 编辑器
     */
    class Editor extends eui.UILayer {
        private mainView;
        constructor();
        private init;
        private initMainView;
        private onresize;
        private initproject;
        private _onAddToStage;
    }
}
