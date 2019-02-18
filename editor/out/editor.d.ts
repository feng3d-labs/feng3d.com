/// <reference path="../libs/monaco-editor/monaco.d.ts" />
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
    /**
     * 编辑器文件系统
     */
    var editorFS: EditorFS;
    /**
     * 编辑器文件系统
     */
    class EditorFS extends feng3d.ReadWriteAssetsFS {
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
        file_gameobject?: feng3d.GameObject;
        /**
         * 脚本路径
         */
        file_script?: feng3d.ScriptFile;
        /**
         * 文件
         */
        assetsFiles?: AssetsNode[];
        /**
         * 声音路径
         */
        audio?: feng3d.AudioFile;
        /**
         * 纹理
         */
        texture2d?: feng3d.Texture2D;
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
        private areaSelectStartPosition;
        private onAreaSelectStart;
        private onAreaSelect;
        private onAreaSelectEnd;
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
        backRect: eui.Rect;
        private canvas;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private inMouseMove;
        private onMouseMove;
        private onGlobalMouseMove;
        private onResize;
    }
}
declare namespace editor {
    class CameraPreview extends eui.Component {
        group: eui.Group;
        private saveParent;
        private canvas;
        private previewEngine;
        camera: feng3d.Camera;
        private _camera;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        private initView;
        private onResize;
        private onDataChange;
        private onframe;
    }
}
declare namespace editor {
    /**
     * 粒子特效控制器
     */
    class ParticleEffectController extends eui.Component {
        pauseBtn: eui.Button;
        stopBtn: eui.Button;
        speedInput: eui.TextInput;
        timeInput: eui.TextInput;
        particlesInput: eui.TextInput;
        private saveParent;
        private particleSystems;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onClick;
        private onEnterFrame;
        private initView;
        private updateView;
        private readonly isParticlePlaying;
        private onDataChange;
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
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private onMouseMove;
        private _findSplit;
        private onMouseDown;
        private onMouseUp;
    }
}
declare class TabViewButton extends eui.Button implements eui.UIComponent {
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
}
declare class TabView extends eui.Component implements eui.UIComponent {
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
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
        popupObject<T>(object: T, closecallback?: (object: T) => void, x?: number, y?: number, width?: number, height?: number): void;
        popupView(view: eui.Component, closecallback?: () => void, x?: number, y?: number, width?: number, height?: number): void;
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
        removeContent(component: eui.Component): void;
        protected onComplete(): void;
        protected onAddedToStage(): void;
        protected onRemovedFromStage(): void;
        private onTitleButtonClick;
    }
}
declare namespace editor {
    class ColorPicker extends eui.Component implements eui.UIComponent {
        picker: eui.Rect;
        value: feng3d.Color4 | feng3d.Color3;
        private _value;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onClick;
        private onPickerViewChanged;
    }
}
declare namespace editor {
    class TreeItemRenderer extends eui.ItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        /**
         * 子结点相对父结点的缩进值，以像素为单位。默认17。
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
    interface TreeNodeMap {
        added: TreeNode;
        removed: TreeNode;
        openChanged: TreeNode;
    }
    interface TreeNode {
        once<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TreeNodeMap>(type: K, data?: TreeNodeMap[K], bubbles?: boolean): feng3d.Event<TreeNodeMap[K]>;
        has<K extends keyof TreeNodeMap>(type: K): boolean;
        on<K extends keyof TreeNodeMap>(type: K, listener: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TreeNodeMap>(type?: K, listener?: (event: feng3d.Event<TreeNodeMap[K]>) => any, thisObject?: any): any;
    }
    class TreeNode extends feng3d.EventDispatcher {
        /**
         * 标签
         */
        label: string;
        /**
         * 目录深度
         */
        readonly depth: number;
        /**
         * 是否打开
         */
        isOpen: boolean;
        /**
         * 是否选中
         */
        selected: boolean;
        /**
         * 父结点
         */
        parent: TreeNode;
        /**
         * 子结点列表
         */
        children: TreeNode[];
        constructor(obj?: gPartial<TreeNode>);
        /**
         * 销毁
         */
        destroy(): void;
        /**
         * 判断是否包含结点
         */
        contain(node: TreeNode): boolean;
        addChild(node: TreeNode): void;
        remove(): void;
        getShowNodes(): TreeNode[];
        openParents(): void;
        private openChanged;
    }
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
        private onRefreshView;
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
        component: feng3d.ParticleModule;
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        /**
         * 对象界面数据
         */
        constructor(component: feng3d.ParticleModule);
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
        popup(menu: MenuItem[], parm?: {
            mousex?: number;
            mousey?: number;
            width?: number;
        }): void;
        popupEnum(enumDefinition: Object, currentValue: any, selectCallBack: (v: any) => void, parm?: {
            mousex?: number;
            mousey?: number;
            width?: number;
        }): void;
    }
    class MenuUI extends eui.List {
        subMenuUI: MenuUI;
        private _subMenuUI;
        private parentMenuUI;
        readonly topMenu: MenuUI;
        constructor();
        static create(menu: MenuItem[], parm?: {
            mousex?: number;
            mousey?: number;
            width?: number;
        }): MenuUI;
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
        private onMouseOver;
        private onMouseOut;
        private removeTipview;
    }
}
declare namespace editor {
    /**
     */
    class ColorPickerView extends eui.Component {
        group0: eui.Group;
        image0: eui.Image;
        pos0: eui.Group;
        group1: eui.Group;
        image1: eui.Image;
        pos1: eui.Group;
        txtR: eui.TextInput;
        txtG: eui.TextInput;
        txtB: eui.TextInput;
        groupA: eui.Group;
        txtA: eui.TextInput;
        txtColor: eui.TextInput;
        color: feng3d.Color3 | feng3d.Color4;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private _mouseDownGroup;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private _textfocusintxt;
        protected ontxtfocusin(e: egret.Event): void;
        protected ontxtfocusout(e: egret.Event): void;
        private onTextChange;
        private onColorChanged;
        private basecolor;
        private rw;
        private rh;
        private ratio;
        private updateView;
        private _groupAParent;
    }
    var colorPickerView: ColorPickerView;
}
declare namespace editor {
    var areaSelectRect: AreaSelectRect;
    /**
     * 区域选择框
     */
    class AreaSelectRect extends eui.Rect {
        fillAlpha: number;
        fillColor: number;
        /**
         * 显示
         * @param start 起始位置
         * @param end 结束位置
         */
        show(start: {
            x: number;
            y: number;
        }, end: {
            x: number;
            y: number;
        }): void;
        /**
         * 隐藏
         */
        hide(): void;
    }
}
declare namespace editor {
    /**
     * 最大最小曲线界面
     */
    class MinMaxCurveView extends eui.Component {
        minMaxCurve: feng3d.MinMaxCurve;
        constantGroup: eui.Group;
        constantTextInput: eui.TextInput;
        curveGroup: eui.Group;
        curveImage: eui.Image;
        randomBetweenTwoConstantsGroup: eui.Group;
        minValueTextInput: eui.TextInput;
        maxValueTextInput: eui.TextInput;
        modeBtn: eui.Button;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private onReSize;
        private _onMinMaxCurveChanged;
        private onClick;
        private onPickerViewChanged;
        private _onRightClick;
    }
}
declare namespace editor {
    var minMaxCurveEditor: MinMaxCurveEditor;
    class MinMaxCurveEditor extends eui.Component {
        minMaxCurve: feng3d.MinMaxCurve;
        viewGroup: eui.Group;
        curveImage: eui.Image;
        curveGroup: eui.Group;
        multiplierInput: eui.TextInput;
        y_0: eui.Label;
        y_1: eui.Label;
        y_2: eui.Label;
        y_3: eui.Label;
        x_0: eui.Label;
        x_1: eui.Label;
        x_2: eui.Label;
        x_3: eui.Label;
        x_4: eui.Label;
        x_5: eui.Label;
        x_6: eui.Label;
        x_7: eui.Label;
        x_8: eui.Label;
        x_9: eui.Label;
        x_10: eui.Label;
        samplesOperationBtn: eui.Button;
        samplesGroup: eui.Group;
        sample_0: eui.Image;
        sample_1: eui.Image;
        sample_2: eui.Image;
        sample_3: eui.Image;
        sample_4: eui.Image;
        sample_5: eui.Image;
        sample_6: eui.Image;
        sample_7: eui.Image;
        private timeline;
        private timeline1;
        private curveRect;
        private canvasRect;
        private editKey;
        private editorControlkey;
        private editTimeline;
        private editing;
        private mousedownxy;
        private selectedKey;
        private selectTimeline;
        private curveColor;
        private backColor;
        private fillTwoCurvesColor;
        private range;
        private imageUtil;
        /**
         * 点绘制尺寸
         */
        private pointSize;
        /**
         * 控制柄长度
         */
        private controllerLength;
        private yLabels;
        private xLabels;
        private sampleImages;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private updateXYLabels;
        private updateSampleImages;
        private onSampleClick;
        /**
         * 绘制曲线关键点
         * @param animationCurve
         */
        private drawCurveKeys;
        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time
         * @param value
         */
        private curveToUIPos;
        /**
         * UI上坐标转换为曲线上坐标
         * @param x
         * @param y
         */
        private uiToCurvePos;
        private getKeyUIPos;
        private getKeyLeftControlUIPos;
        private getKeyRightControlUIPos;
        /**
         * 绘制选中的关键点
         */
        private drawSelectedKey;
        private drawGrid;
        private _onMinMaxCurveChanged;
        private _onReSize;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
        private findControlKey;
        private ondblclick;
    }
}
declare namespace editor {
    class MinMaxCurveVector3View extends eui.Component {
        minMaxCurveVector3: feng3d.MinMaxCurveVector3;
        xMinMaxCurveView: editor.MinMaxCurveView;
        yMinMaxCurveView: editor.MinMaxCurveView;
        zMinMaxCurveView: editor.MinMaxCurveView;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private _onMinMaxCurveVector3Changed;
        private _onchanged;
    }
}
declare namespace editor {
    /**
     * 最大最小颜色渐变界面
     */
    class MinMaxGradientView extends eui.Component {
        minMaxGradient: feng3d.MinMaxGradient;
        colorGroup0: eui.Group;
        colorImage0: eui.Image;
        secondGroup: eui.Group;
        colorGroup1: eui.Group;
        colorImage1: eui.Image;
        modeBtn: eui.Button;
        private secondGroupParent;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private onReSize;
        private _onMinMaxGradientChanged;
        private activeColorGroup;
        private onClick;
        private onPickerViewChanged;
        private _onRightClick;
    }
}
declare namespace editor {
    var gradientEditor: GradientEditor;
    class GradientEditor extends eui.Component {
        gradient: feng3d.Gradient;
        modeCB: ComboBox;
        controllerGroup: eui.Group;
        alphaLineGroup: eui.Group;
        colorImage: eui.Image;
        colorLineGroup: eui.Group;
        colorGroup: eui.Group;
        colorPicker: editor.ColorPicker;
        alphaGroup: eui.Group;
        alphaLabel: eui.Label;
        alphaSlide: eui.HSlider;
        alphaInput: eui.TextInput;
        locationLabel: eui.Label;
        locationInput: eui.TextInput;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
        private _alphaSprite;
        private _colorSprite;
        private _parentGroup;
        private _loactionNumberTextInputBinder;
        private _alphaNumberSliderTextInputBinder;
        private _selectedValue;
        private _drawAlphaGraphics;
        private _drawColorGraphics;
        private _onAlphaChanged;
        private _onLocationChanged;
        private _onReSize;
        private _onModeCBChange;
        private _onColorPickerChange;
        private _onGradientChanged;
        private _onMouseDownLineGroup;
        private _removedTemp;
        private _onMouseDown;
        private _onAlphaColorMouseMove;
        private _onAlphaColorMouseUp;
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
declare namespace eui {
    interface Component {
        addBinder(...binders: editor.UIBinder[]): void;
    }
}
declare namespace editor {
    interface UIBinder {
        init(v: Partial<this>): this;
        dispose(): void;
    }
    interface TextInputBinderEventMap {
        valueChanged: any;
    }
    interface TextInputBinder {
        once<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof TextInputBinderEventMap>(type: K, data?: TextInputBinderEventMap[K], bubbles?: boolean): feng3d.Event<TextInputBinderEventMap[K]>;
        has<K extends keyof TextInputBinderEventMap>(type: K): boolean;
        on<K extends keyof TextInputBinderEventMap>(type: K, listener: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof TextInputBinderEventMap>(type?: K, listener?: (event: feng3d.Event<TextInputBinderEventMap[K]>) => any, thisObject?: any): any;
    }
    class TextInputBinder extends feng3d.EventDispatcher implements UIBinder {
        space: any;
        /**
         * 绑定属性名称
         */
        attribute: string;
        textInput: eui.TextInput;
        /**
         * 是否可编辑
         */
        editable: boolean;
        /**
         * 绑定属性值转换为文本
         */
        toText: (v: any) => any;
        /**
         * 文本转换为绑定属性值
         */
        toValue: (v: any) => any;
        init(v: Partial<this>): this;
        dispose(): void;
        protected initView(): void;
        protected onValueChanged(): void;
        protected updateView(): void;
        protected onTextChange(): void;
        private _textfocusintxt;
        protected ontxtfocusin(): void;
        protected ontxtfocusout(): void;
    }
}
declare namespace editor {
    class NumberTextInputBinder extends TextInputBinder {
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
        /**
         * 控制器
         */
        controller: egret.DisplayObject;
        /**
         * 最小值
         */
        minValue: number;
        /**
         * 最小值
         */
        maxValue: number;
        toText: (v: any) => string;
        toValue: (v: any) => number;
        initView(): void;
        dispose(): void;
        protected onValueChanged(): void;
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
    class NumberSliderTextInputBinder extends NumberTextInputBinder {
        slider: eui.HSlider;
        initView(): void;
        dispose(): void;
        protected updateView(): void;
        private _onSliderChanged;
    }
}
declare namespace editor {
    class TerrainView extends eui.Component {
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        updateView(): void;
    }
}
declare namespace editor {
    class OVTerrain extends TerrainView implements feng3d.IObjectView {
        space: Object;
        private _objectViewInfo;
        constructor(objectViewInfo: feng3d.ObjectViewInfo);
        getAttributeView(attributeName: String): any;
        getblockView(blockName: String): any;
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
    }
}
declare namespace editor {
    class OAVBase extends eui.Component implements feng3d.IObjectAttributeView {
        protected _space: any;
        protected _attributeName: string;
        protected _attributeType: string;
        protected _attributeViewInfo: feng3d.AttributeViewInfo;
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
    class OAVNumber extends OAVBase {
        labelLab: eui.Label;
        text: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
    }
}
declare namespace editor {
    class OAVString extends OAVBase {
        txtInput: eui.TextInput;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
    }
}
declare namespace editor {
    /**
     * 默认对象属性界面
     */
    class OAVMultiText extends OAVBase {
        txtLab: eui.Label;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
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
    class OAVImage extends OAVBase {
        image: eui.Image;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        onResize(): void;
    }
}
declare namespace editor {
    class OAVCubeMap extends OAVBase {
        px: eui.Image;
        py: eui.Image;
        pz: eui.Image;
        nx: eui.Image;
        ny: eui.Image;
        nz: eui.Image;
        pxGroup: eui.Group;
        pxBtn: eui.Button;
        pyGroup: eui.Group;
        pyBtn: eui.Button;
        pzGroup: eui.Group;
        pzBtn: eui.Button;
        nxGroup: eui.Group;
        nxBtn: eui.Button;
        nyGroup: eui.Group;
        nyBtn: eui.Button;
        nzGroup: eui.Group;
        nzBtn: eui.Button;
        private images;
        private btns;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        private updateImage;
        private onImageClick;
        private dispatchValueChange;
        dispose(): void;
        updateView(): void;
        onResize(): void;
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
        private onAddCompont;
        private onRemoveComponent;
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
        private onRefreshView;
    }
}
declare namespace editor {
    class OAVAccordionObjectView extends OAVBase {
        componentView: feng3d.IObjectView;
        accordion: editor.Accordion;
        enabledCB: eui.CheckBox;
        /**
         * 对象界面数据
         */
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        /**
         * 更新界面
         */
        updateView(): void;
        initView(): void;
        dispose(): void;
        private updateEnableCB;
        private onEnableCBChange;
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
        private onPickBtnClick;
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
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        space: feng3d.ParticleSystem;
        readonly attributeName: string;
        attributeValue: Object;
        initView(): void;
        dispose(): void;
        /**
         * 更新界面
         */
        updateView(): void;
        private addComponentView;
        private removedComponentView;
    }
}
declare namespace editor {
    class OAVFeng3dPreView extends OAVBase {
        image: eui.Image;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        private preMousePos;
        private onMouseDown;
        private onMouseMove;
        private cameraRotation;
        private onDrawObject;
        private onMouseUp;
        updateView(): void;
        onResize(): void;
    }
}
declare namespace editor {
    class OAVMinMaxCurve extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveView: editor.MinMaxCurveView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    class OAVMinMaxCurveVector3 extends OAVBase {
        labelLab: eui.Label;
        minMaxCurveVector3View: editor.MinMaxCurveVector3View;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    class OAVMinMaxGradient extends OAVBase {
        labelLab: eui.Label;
        minMaxGradientView: editor.MinMaxGradientView;
        constructor(attributeViewInfo: feng3d.AttributeViewInfo);
        initView(): void;
        dispose(): void;
        updateView(): void;
        private onChange;
    }
}
declare namespace editor {
    /**
     * 属性面板（检查器）
     */
    class InspectorView extends eui.Component implements eui.UIComponent {
        typeLab: eui.Label;
        backButton: eui.Button;
        group: eui.Group;
        constructor();
        showData(data: any, removeBack?: boolean): void;
        updateView(): void;
        /**
         * 保存显示数据
         */
        saveShowData(callback?: () => void): void;
        private _view;
        private _viewData;
        private _viewDataList;
        private _dataChanged;
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onSelectedObjectsChanged;
        private updateShowData;
        private onValueChanged;
        private onBackButton;
    }
}
declare namespace editor {
    var inspectorMultiObject: InspectorMultiObject;
    /**
     * 检查器多对象
     *
     * 处理多个对象在检查器中显示问题
     */
    class InspectorMultiObject {
        convertInspectorObject(objects: any[]): any;
    }
}
declare namespace editor {
    class HierarchyTreeItemRenderer extends TreeItemRenderer {
        data: HierarchyNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        private setdargSource;
        private onclick;
        private onDoubleClick;
        private onrightclick;
    }
}
declare namespace editor {
    class HierarchyView extends eui.Component implements eui.UIComponent {
        hierachyScroller: eui.Scroller;
        list: eui.List;
        private listData;
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
        private onRootNodeChanged;
        private onRootNode;
        private offRootNode;
        private invalidHierarchy;
        private updateHierarchyTree;
        private onListClick;
        private onListRightClick;
    }
}
declare namespace editor {
    var editorAssets: EditorAssets;
    class EditorAssets {
        /**
         * 资源ID字典
         */
        private _assetsIDMap;
        /**
         * 显示文件夹
         */
        showFloder: AssetsNode;
        /**
         * 项目资源id树形结构
         */
        rootFile: AssetsNode;
        constructor();
        /**
         * 初始化项目
         * @param callback
         */
        initproject(callback: () => void): void;
        readScene(path: string, callback: (err: Error, scene: feng3d.Scene3D) => void): void;
        /**
         * 根据资源编号获取文件
         *
         * @param assetsId 文件路径
         */
        getAssetsByID(assetsId: string): AssetsNode;
        /**
         * 根据路径获取资源
         *
         * @param assetsPath 资源路径
         */
        getAssetsByPath(assetsPath: string): AssetsNode;
        /**
         * 删除资源
         *
         * @param assetsFile 资源
         */
        deleteAssets(assetsFile: AssetsNode, callback?: (err: Error) => void): void;
        /**
         * 保存项目
         * @param callback 完成回调
         */
        saveProject(callback?: (err: Error) => void): void;
        /**
         * 保存资源
         *
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        saveAssets(assetsFile: AssetsNode, callback?: () => void): void;
        /**
         * 移动资源
         *
         * @param assetsFile 资源文件
         * @param newPath 新路径
         * @param callback 回调函数，当文件系统中文件全部移动完成后调用
         */
        moveAssets(assetsFile: AssetsNode, newPath: string, callback?: (err?: Error) => void): void;
        /**
         * 获取脚本列表
         */
        getScripts(): feng3d.ScriptFile[];
        /**
         * 获取指定类型资源
         * @param type 资源类型
         */
        getAssetsByType<T extends feng3d.Feng3dAssets>(type: feng3d.Constructor<T>): AssetsNode[];
        /**
         * 新增文件夹
         *
         * @param folderName 文件夹名称
         */
        createFolder(parentAssets: AssetsNode, folderName: string): AssetsNode;
        /**
         * 新增资源
         *
         * @param feng3dAssets
         */
        createAssets(parentAssets: AssetsNode, fileName: string, feng3dAssets: feng3d.Feng3dAssets): AssetsNode;
        /**
         * 弹出文件菜单
         */
        popupmenu(assetsFile: AssetsNode): void;
        /**
         * 保存对象
         *
         * @param object 对象
         * @param callback
         */
        saveObject(object: feng3d.Feng3dAssets, callback?: (file: AssetsNode) => void): void;
        /**
         *
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetsFiles 生成资源文件列表（不用赋值，函数递归时使用）
         */
        inputFiles(files: File[], callback?: (files: AssetsNode[]) => void, assetsFiles?: AssetsNode[]): void;
        runProjectScript(callback?: () => void): void;
        /**
         * 上次执行的项目脚本
         */
        private _preProjectJsContent;
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetsFile 文件
         */
        private parserMenu;
        private showFloderChanged;
        private onParsed;
    }
}
declare namespace editor {
    class AssetsFileItemRenderer extends eui.ItemRenderer {
        icon: eui.Image;
        data: AssetsNode;
        itemSelected: boolean;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private ondoubleclick;
        private onclick;
        private onrightclick;
        private selectedfilechanged;
    }
}
declare namespace editor {
    /**
     * 资源元数据
     */
    class AssetsMeta {
        /**
         * 资源编号
         */
        guid: string;
        /**
         * 是否为文件夹资源
         */
        folderAsset: boolean;
        type: string;
    }
}
declare namespace editor {
    interface AssetsFileEventMap extends TreeNodeMap {
        /**
         * 加载完成
         */
        loaded: any;
    }
    interface AssetsNode {
        once<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof AssetsFileEventMap>(type: K, data?: AssetsFileEventMap[K], bubbles?: boolean): feng3d.Event<AssetsFileEventMap[K]>;
        has<K extends keyof AssetsFileEventMap>(type: K): boolean;
        on<K extends keyof AssetsFileEventMap>(type: K, listener: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any, priority?: number, once?: boolean): any;
        off<K extends keyof AssetsFileEventMap>(type?: K, listener?: (event: feng3d.Event<AssetsFileEventMap[K]>) => any, thisObject?: any): any;
    }
    class AssetsNode extends TreeNode {
        /**
         * 编号
         */
        readonly id: string;
        private _id;
        /**
         * 是否文件夹
         */
        isDirectory: boolean;
        /**
         * 图标名称或者路径
         */
        image: string;
        /**
         * 显示标签
         */
        label: string;
        children: AssetsNode[];
        parent: AssetsNode;
        feng3dAssets: feng3d.Feng3dAssets;
        /**
         * 元标签，用于描述资源类型等信息
         */
        meta: AssetsMeta;
        /**
         * 是否已加载
         */
        isLoaded: boolean;
        /**
         * 是否加载中
         */
        private isLoading;
        /**
         * 构建
         *
         * @param id 编号
         * @param path 路径
         */
        constructor(id: string, path: string, isDirectory: boolean);
        /**
         * 加载元标签文件
         *
         * @param callback 加载完成回调
         */
        loadMeta(callback?: () => void): void;
        /**
         * 加载
         *
         * @param callback 加载完成回调
         */
        load(callback?: () => void): void;
        /**
         * 更新缩略图
         */
        updateImage(): void;
        /**
         * 删除
         */
        delete(): void;
        /**
         * 获取文件夹列表
         *
         * @param includeClose 是否包含关闭的文件夹
         */
        getFolderList(includeClose?: boolean): AssetsNode[];
        /**
         * 获取文件列表
         */
        getFileList(): AssetsNode[];
        /**
         * 获取新子文件名称
         *
         * @param childName 基础名称
         */
        getNewChildFileName(childName: string): string;
        /**
         * 获取新子文件路径
         *
         * @param basename 基础名称
         */
        getNewChildPath(basename: string): string;
        /**
         * 新增文件从ArrayBuffer
         *
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        addfileFromArrayBuffer(filename: string, arraybuffer: ArrayBuffer, override?: boolean, callback?: (e: Error, file: AssetsNode) => void): void;
        /**
         * 导出
         */
        export(): void;
    }
}
declare namespace editor {
    class AssetsTreeItemRenderer extends TreeItemRenderer {
        contentGroup: eui.Group;
        disclosureButton: eui.ToggleButton;
        data: AssetsNode;
        constructor();
        $onAddToStage(stage: egret.Stage, nestLevel: number): void;
        $onRemoveFromStage(): void;
        dataChanged(): void;
        private showFloderChanged;
        private onclick;
        private onrightclick;
    }
}
declare namespace editor {
    class AssetsView extends eui.Component implements eui.UIComponent {
        assetsTreeScroller: eui.Scroller;
        assetsTreeList: eui.List;
        floderpathTxt: eui.Label;
        includeTxt: eui.TextInput;
        excludeTxt: eui.TextInput;
        filelistgroup: eui.Group;
        floderScroller: eui.Scroller;
        filelist: eui.List;
        filepathLabel: eui.Label;
        private _assetstreeInvalid;
        private listData;
        private filelistData;
        private fileDrag;
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
        private areaSelectStartPosition;
        private onMouseDown;
        private onMouseMove;
        private onMouseUp;
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
    class NavigationView extends eui.Component {
        constructor();
        private onComplete;
        private onAddedToStage;
        private onRemovedFromStage;
    }
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
        popupLayer: eui.UILayer;
        /**
         * 属性面板
         */
        inspectorView: InspectorView;
        /**
         * 3D视图
         */
        feng3dView: Feng3dView;
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
        readonly selectedObjects: (feng3d.GameObject | AssetsNode)[];
        private _selectedObjects;
        clearSelectedObjects(): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectObject(object: (feng3d.GameObject | AssetsNode)): void;
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        selectMultiObject(objs: (feng3d.GameObject | AssetsNode)[]): void;
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
         * 选中游戏对象列表
         */
        readonly selectedAssetsFile: AssetsNode[];
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
    var mrsToolTarget: MRSToolTarget;
    class MRSToolTarget {
        private _controllerTargets;
        private _startScaleVec;
        private _controllerTool;
        private _startTransformDic;
        private _position;
        private _rotation;
        controllerTool: feng3d.Transform;
        controllerTargets: feng3d.Transform[];
        constructor();
        private onSelectedGameObjectChange;
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
declare namespace feng3d {
    interface ComponentMap {
        CoordinateAxis: editor.CoordinateAxis;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinatePlane: editor.CoordinatePlane;
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
declare namespace feng3d {
    interface ComponentMap {
        CoordinateRotationAxis: editor.CoordinateRotationAxis;
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
declare namespace feng3d {
    interface ComponentMap {
        CoordinateCube: editor.CoordinateCube;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        CoordinateScaleCube: editor.CoordinateScaleCube;
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
        init(gameObject: feng3d.GameObject): void;
        protected onAddedToScene(): void;
        protected onRemovedFromScene(): void;
        protected onItemMouseDown(event: feng3d.Event<any>): void;
        protected toolModel: feng3d.Component;
        selectedItem: CoordinateAxis | CoordinatePlane | CoordinateRotationFreeAxis | CoordinateRotationAxis | CoordinateCube | CoordinateScaleCube;
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
         * 父结点
         */
        parent: HierarchyNode;
        /**
         * 子结点列表
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
    var hierarchy: Hierarchy;
    class Hierarchy {
        rootnode: HierarchyNode;
        rootGameObject: feng3d.GameObject;
        constructor();
        /**
         * 获取选中结点
         */
        getSelectedNode(): HierarchyNode;
        /**
         * 获取结点
         */
        getNode(gameObject: feng3d.GameObject): HierarchyNode;
        delete(gameobject: feng3d.GameObject): void;
        addGameoObjectFromAsset(gameobject: feng3d.GameObject, parent?: feng3d.GameObject): void;
        private _selectedGameObjects;
        private rootGameObjectChanged;
        private onSelectedGameObjectChanged;
        private ongameobjectadded;
        private ongameobjectremoved;
        private init;
        private add;
        private remove;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        SceneRotateTool: editor.SceneRotateTool;
    }
}
declare namespace editor {
    class SceneRotateTool extends feng3d.Component {
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
        private onAddChild;
        private onRemoveChild;
        private onAddComponent;
        private onRemoveComponent;
        private addComponent;
        private removeComponent;
        private directionLightIconMap;
        private pointLightIconMap;
        private spotLightIconMap;
        private cameraIconMap;
    }
}
declare namespace editor {
    var feng3dScreenShot: Feng3dScreenShot;
    /**
     * feng3d缩略图工具
     */
    class Feng3dScreenShot {
        engine: feng3d.Engine;
        scene: feng3d.Scene3D;
        camera: feng3d.Camera;
        defaultGeometry: feng3d.SphereGeometry;
        defaultMaterial: feng3d.Material;
        constructor();
        /**
         * 绘制立方体贴图
         * @param textureCube 立方体贴图
         */
        drawTextureCube(textureCube: feng3d.TextureCube): string;
        /**
         * 绘制材质
         * @param material 材质
         */
        drawMaterial(material: feng3d.Material, cameraRotation?: feng3d.Vector3): this;
        /**
         * 绘制材质
         * @param geometry 材质
         */
        drawGeometry(geometry: feng3d.Geometrys, cameraRotation?: feng3d.Vector3): this;
        /**
         * 绘制游戏对象
         * @param gameObject 游戏对象
         */
        drawGameObject(gameObject: feng3d.GameObject, cameraRotation?: feng3d.Vector3): this;
        /**
         * 转换为DataURL
         */
        toDataURL(): string;
        updateCameraPosition(): void;
        private currentObject;
        private materialObject;
        private geometryObject;
        private _drawGameObject;
    }
}
declare namespace feng3d {
    interface ComponentMap {
        Navigation: editor.Navigation;
    }
}
declare namespace editor {
    /**
     * 导航代理
     */
    class NavigationAgent {
        /**
         * 距离边缘半径
         */
        radius: number;
        /**
         * 允许行走高度
         */
        height: number;
        /**
         * 允许爬上的阶梯高度
         */
        stepHeight: number;
        /**
         * 允许行走坡度
         */
        maxSlope: number;
    }
    /**
     * 导航组件，提供生成导航网格功能
     */
    class Navigation extends feng3d.Component {
        agent: NavigationAgent;
        private _navobject;
        private _recastnavigation;
        private _allowedVoxelsPointGeometry;
        private _rejectivedVoxelsPointGeometry;
        private _debugVoxelsPointGeometry;
        init(gameobject: feng3d.GameObject): void;
        /**
         * 清楚oav网格模型
         */
        clear(): void;
        /**
         * 计算导航网格数据
         */
        bake(): void;
        /**
         * 获取参与导航的几何体列表
         * @param gameobject
         * @param geometrys
         */
        private _getNavGeometrys;
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
     * 结点
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
         * 构建树结点
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
declare namespace editor {
    /**
     * 重铸导航
     *
     *  将接收的网格模型转换为导航网格数据
     *
     * #### 设计思路
     * 1. 将接收到的网格模型的所有三角形栅格化为体素保存到三维数组内
     * 1. 遍历所有体素计算出可行走体素
     * 1. 构建可行走轮廓
     * 1. 构建可行走（导航）网格
     *
     * #### 参考
     * @see https://github.com/recastnavigation/recastnavigation
     */
    class Recastnavigation {
        /**
         * 包围盒
         */
        private _aabb;
        /**
         * 体素尺寸
         */
        private _voxelSize;
        /**
         * X 轴上 体素数量
         */
        private _numX;
        /**
         * Y 轴上 体素数量
         */
        private _numY;
        /**
         * Z 轴上 体素数量
         */
        private _numZ;
        /**
         * 体素三维数组
         */
        private _voxels;
        /**
         * 导航代理
         */
        private _agent;
        /**
         * 用于体素区分是否同属一个三角形
         */
        private _triangleId;
        /**
         * 执行重铸导航
         */
        doRecastnavigation(mesh: {
            positions: number[];
            indices: number[];
        }, agent?: NavigationAgent, voxelSize?: feng3d.Vector3): void;
        /**
         * 获取体素列表
         */
        getVoxels(): Voxel[];
        /**
         * 栅格化网格
         */
        private _voxelizationMesh;
        /**
         * 栅格化三角形
         * @param p0 三角形第一个顶点
         * @param p1 三角形第二个顶点
         * @param p2 三角形第三个顶点
         */
        private _voxelizationTriangle;
        /**
         * 应用代理进行计算出可行走体素
         */
        private _applyAgent;
        /**
         * 筛选出允许行走坡度的体素
         */
        private _applyAgentMaxSlope;
        private _applyAgentHeight;
        private _applyAgentRadius;
        private _calculateContour;
        private _checkContourVoxel;
        private _isVoxelFlagDefault;
    }
    /**
     * 体素
     */
    interface Voxel {
        x: number;
        y: number;
        z: number;
        normal: feng3d.Vector3;
        triangleId: number;
        flag: VoxelFlag;
    }
    enum VoxelFlag {
        Default = 0,
        DontMaxSlope = 1,
        DontHeight = 2,
        IsContour = 4
    }
}
declare namespace egret {
}
declare namespace egret {
    type MouseEvent = egret.TouchEvent;
    var MouseEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
        /** 鼠标按下 */
        MOUSE_DOWN: "mousedown";
        /** 鼠标弹起 */
        MOUSE_UP: "mouseup";
        /** 鼠标移动 */
        MOUSE_MOVE: "mousemove";
        /** 鼠标单击 */
        CLICK: "click";
        /** 鼠标中键按下 */
        MIDDLE_MOUSE_DOWN: "middlemousedown";
        /** 鼠标中键弹起 */
        MIDDLE_MOUSE_UP: "middlemouseup";
        /** 鼠标中键点击 */
        MIDDLE_Click: "middleclick";
        /** 鼠标移出 */
        MOUSE_OUT: "mouseout";
        /** 鼠标移入 */
        MOUSE_OVER: "mouseover";
        /** 右键按下 */
        RIGHT_MOUSE_DOWN: "rightmousedown";
        /** 鼠标右键弹起 */
        RIGHT_MOUSE_UP: "rightmouseup";
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
    class EditorScript extends feng3d.Behaviour {
        flag: feng3d.RunEnvironment;
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
declare namespace feng3d {
    interface ComponentMap {
        DirectionLightIcon: editor.DirectionLightIcon;
    }
}
declare namespace editor {
    class DirectionLightIcon extends EditorScript {
        __class__: "editor.DirectionLightIcon";
        light: feng3d.DirectionalLight;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _textureMaterial;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class PointLightIcon extends EditorScript {
        light: feng3d.PointLight;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _textureMaterial;
        private _segmentGeometry;
        private _pointGeometry;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class SpotLightIcon extends EditorScript {
        light: feng3d.SpotLight;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _textureMaterial;
        private _segmentGeometry;
        private _pointGeometry;
        private onLightChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class CameraIcon extends EditorScript {
        camera: feng3d.Camera;
        init(gameObject: feng3d.GameObject): void;
        initicon(): void;
        update(): void;
        dispose(): void;
        private _lightIcon;
        private _lightLines;
        private _lightpoints;
        private _segmentGeometry;
        private _pointGeometry;
        private _lensChanged;
        private onCameraChanged;
        private onLensChanged;
        private onScenetransformChanged;
        private onMousedown;
    }
}
declare namespace editor {
    class ThreejsLoader {
        load(url: string, completed?: (gameobject: feng3d.GameObject) => void): void;
    }
    var threejsLoader: ThreejsLoader;
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
declare namespace feng3d {
    interface Feng3dEventMap {
        "editor.selectedObjectsChanged": any;
        "editor.isBaryCenterChanged": any;
        "editor.isWoldCoordinateChanged": any;
        "editor.toolTypeChanged": any;
        "editor.allLoaded": any;
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
            id: string;
        };
        /**
         * 旋转场景摄像机
         */
        editorCameraRotate: feng3d.Vector3;
    }
}
declare namespace editor {
    var scriptCompiler: ScriptCompiler;
    class ScriptCompiler {
        tslibs: {
            path: string;
            code: string;
        }[];
        private tslist;
        _script: feng3d.StringFile;
        constructor();
        edit(script: feng3d.StringFile): void;
        compile(callback?: (result: string) => void): any;
        getScripts(): feng3d.ScriptFile[];
        private transpileModule;
        /**
         * ts 文件排序
         */
        private tssort;
    }
}
declare var codeeditoWin: Window;
declare var ts: any;
declare var nodeRequire: any;
declare var script: HTMLScriptElement;
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
