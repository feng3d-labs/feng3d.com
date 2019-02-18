var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
var editor;
(function (editor) {
    /**
     * Created by 黑暗之神KDS on 2017/2/17.
     */
    /**
     * 文件对象
     * -- WEB端仅可以操作工程内文件且安全的格式：ks、js、json、xml、html、css等
     * -- 其他端支持绝对路径
     * Created by kds on 2017/1/21 0021.
     */
    var FileObject = /** @class */ (function () {
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
        function FileObject(path, onComplete, thisPtr, onError, isGetFileInfo) {
            this.updateStats(path, null, onComplete, onError);
        }
        /**
         * 判断文件名是否合法
         * @param fileName 文件名
         */
        FileObject.isLegalName = function (fileName) {
            return true;
        };
        Object.defineProperty(FileObject.prototype, "exists", {
            /**
             * 文件/文件夹是否存在 基本探索过后才可知道是否存在
             */
            get: function () {
                return this._exists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "size", {
            /**
             * 文件尺寸
             */
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "isDirectory", {
            /**
             * 是否是文件夹
             */
            get: function () {
                return this._isDirectory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "createDate", {
            /**
             * 创建日期
             */
            get: function () {
                return this._createDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "lastModifyDate", {
            /**
             * 上次修改日期
             */
            get: function () {
                return this._lastModifyDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "path", {
            /**
             * 路径
             * -- WEB端是相对路径
             * -- 其他端支持绝对路径 file:///xxx/yyy
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fileName", {
            /**
             * 文件或文件夹名 xxx.ks
             */
            get: function () {
                var fileName = this.path.split("/").pop();
                return fileName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fileNameWithoutExt", {
            /**
             * 不包含格式的文件名称 如 xxx.ks就是xxx
             */
            get: function () {
                var fileName = this.fileName;
                var fileNameWithoutExt = (fileName.indexOf(".") == -1) ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
                return fileNameWithoutExt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "location", {
            /**
             * 当前文件/文件夹所在的相对路径（即父文件夹path）如  serverRun/abc/xxx.ks 的location就是serverRun/abc
             */
            get: function () {
                var paths = this.path.split("/");
                paths.pop();
                var location = paths.join("/");
                return location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "fullPath", {
            /**
             * 绝对路径
             * -- WEB端的是 http://xxxx
             * -- 其他端的是 file:///xxxx
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileObject.prototype, "extension", {
            /**
             * 格式
             */
            get: function () {
                var fileName = this.fileName;
                if (fileName.indexOf(".") == -1)
                    return "";
                var extension = fileName.split(".").pop();
                return extension;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取该文件下的目录
         * @param onComplete 当完成时回调 onComplete([object FileObject],null/[FileObject数组])
         * @param onError 失败时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.getDirectoryListing = function (onComplete, onError, thisPtr) {
            var _this = this;
            editor.editorFS.fs.readdir(this._path, function (err, files) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                }
                else {
                    onComplete(_this, files);
                }
            });
        };
        /**
         * 创建文件夹
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.createDirectory = function (onComplete, onError, thisPtr) {
            var _this = this;
            editor.editorFS.fs.mkdir(this._path, function (err) {
                if (err) {
                    feng3d.warn(_this);
                    onError(_this);
                    return;
                }
                _this.updateStats(_this._path, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 创建文件
         * @param content 初次创建时的内容 一般可为""
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.createFile = function (content, onComplete, onError, thisPtr) {
            this.saveFile(content, onComplete, onError, thisPtr);
        };
        /**
         * 储存文件（文本格式）
         * @param content 文件内容文本
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.saveFile = function (content, onComplete, onError, thisPtr) {
            var _this = this;
            if (typeof content == "string") {
                feng3d.dataTransform.stringToArrayBuffer(content, function (uint8Array) {
                    _this.saveFile(uint8Array, onComplete, onError, thisPtr);
                });
                return;
            }
            editor.editorFS.fs.writeArrayBuffer(this._path, content, function (err) {
                if (err) {
                    onError(_this);
                }
                else {
                    _this.updateStats(_this._path, function () {
                        onComplete(_this);
                    });
                }
            });
        };
        /**
         * 重命名
         * @param newName 重命名
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 错误时回调 onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.rename = function (newName, onComplete, onError, thisPtr) {
            var _this = this;
            var oldPath = this._path;
            var newPath = this.location ? (this.location + "/" + newName) : newName;
            editor.editorFS.fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this.updateStats(newPath, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 移动文件夹
         * @param newPath 新的路径
         * @param onComplete 完成时回调 onComplete([object FileObject])
         * @param onError 失败时回调  onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.move = function (newPath, onComplete, onError, thisPtr) {
            var _this = this;
            editor.editorFS.fs.move(this._path, newPath, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this.updateStats(newPath, function () {
                    onComplete(_this);
                });
            });
        };
        /**
         * 删除文件（夹）
         * @param onComplete onComplete([object FileObject])
         * @param onError onError([object FileObject])
         * @param thisPtr 执行域
         */
        FileObject.prototype.delete = function (onComplete, onError, thisPtr) {
            var _this = this;
            editor.editorFS.fs.delete(this._path, function (err) {
                if (err) {
                    feng3d.warn(err);
                    onError(_this);
                    return;
                }
                _this._exists = false;
                onComplete(_this);
            });
        };
        /**
         * 打开文件
         * @param onFin 完成时回调 onFin(txt:string)
         * @param onError 错误时回调 onError([fileObject])
         */
        FileObject.prototype.open = function (onFin, onError) {
            throw "未实现";
        };
        /**
         * 更新状态
         * @param callback 回调函数
         */
        FileObject.prototype.updateStats = function (path, callback, onComplete, onError) {
            var _this = this;
            editor.editorFS.fs.exists(path, function (exists) {
                if (!exists) {
                    _this._exists = false;
                    onError && onError(_this);
                }
                else {
                    _this._exists = true;
                    _this._size = 0;
                    _this._path = path;
                    _this._isDirectory = path.charAt(path.length - 1) == "/";
                    _this._createDate = new Date();
                    _this._lastModifyDate = new Date();
                    onError && onComplete(_this);
                }
                callback && callback();
            });
        };
        return FileObject;
    }());
    editor.FileObject = FileObject;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 编辑器文件系统
     */
    var EditorFS = /** @class */ (function (_super) {
        __extends(EditorFS, _super);
        function EditorFS() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        EditorFS.prototype.hasProject = function (projectname, callback) {
            var readWriteFS = this.fs;
            if (readWriteFS.baseFS instanceof feng3d.IndexedDBFS) {
                feng3d._indexedDB.hasObjectStore(readWriteFS.baseFS.DBname, projectname, callback);
            }
            else if (readWriteFS["getProjectList"] != null) {
                readWriteFS["getProjectList"](function (err, projects) {
                    if (err)
                        throw err;
                    callback(projects.indexOf(projectname) != -1);
                });
            }
            else {
                throw "未完成 hasProject 功能！";
            }
        };
        /**
         * 获取项目列表
         * @param callback 回调函数
         */
        EditorFS.prototype.getProjectList = function (callback) {
            var readWriteFS = this.fs;
            if (readWriteFS.baseFS instanceof feng3d.IndexedDBFS) {
                feng3d._indexedDB.getObjectStoreNames(readWriteFS.baseFS.DBname, callback);
            }
            else if (readWriteFS["getProjectList"] != null) {
                readWriteFS["getProjectList"](callback);
            }
            else {
                throw "未完成 hasProject 功能！";
            }
        };
        /**
         * 初始化项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        EditorFS.prototype.initproject = function (projectname, callback) {
            var readWriteFS = this.fs;
            if (readWriteFS.baseFS instanceof feng3d.IndexedDBFS) {
                feng3d._indexedDB.createObjectStore(readWriteFS.baseFS.DBname, projectname, function (err) {
                    if (err) {
                        feng3d.warn(err);
                        return;
                    }
                    readWriteFS.projectname = projectname;
                    // todo 启动监听 ts代码变化自动编译
                    callback();
                });
            }
            else if (readWriteFS.type == feng3d.FSType.native) {
                readWriteFS.projectname = projectname;
                readWriteFS.mkdir("", function (err) {
                    if (err)
                        feng3d.error(err);
                    callback();
                });
            }
            else {
                throw "未完成 hasProject 功能！";
            }
        };
        /**
         * 创建项目
         */
        EditorFS.prototype.createproject = function (projectname, callback) {
            editor.editorFS.initproject(projectname, function () {
                //
                var zip = new JSZip();
                var request = new XMLHttpRequest();
                request.open('Get', editor.editorData.getEditorAssetsPath("templates/template.zip"), true);
                request.responseType = "arraybuffer";
                request.onload = function (ev) {
                    zip.loadAsync(request.response).then(function () {
                        var filepaths = Object.keys(zip.files);
                        filepaths.sort();
                        readfiles();
                        /**
                         * 读取zip中所有文件
                         */
                        function readfiles() {
                            if (filepaths.length > 0) {
                                var filepath = filepaths.shift();
                                var file = zip.files[filepath];
                                if (file.dir) {
                                    editor.editorFS.fs.mkdir(filepath, readfiles);
                                }
                                else {
                                    file.async("arraybuffer").then(function (data) {
                                        editor.editorFS.fs.writeArrayBuffer(filepath, data, function (err) {
                                            if (err)
                                                console.log(err);
                                            readfiles();
                                        });
                                    }, function (reason) {
                                        console.warn(reason);
                                        readfiles();
                                    });
                                }
                            }
                            else {
                                callback();
                            }
                        }
                    });
                };
                request.onerror = function (ev) {
                    feng3d.error(request.responseURL + "不存在，无法初始化项目！");
                };
                request.send();
            });
        };
        EditorFS.prototype.upgradeProject = function (callback) {
            //
            var zip = new JSZip();
            var request = new XMLHttpRequest();
            request.open('Get', editor.editorData.getEditorAssetsPath("templates/template.zip"), true);
            request.responseType = "arraybuffer";
            request.onload = function (ev) {
                zip.loadAsync(request.response).then(function () {
                    var filepaths = Object.keys(zip.files);
                    filepaths = filepaths.filter(function (item) {
                        if (item.indexOf("project.js") != -1)
                            return false;
                        if (item.indexOf("default.scene.json") != -1)
                            return false;
                        return true;
                    });
                    filepaths.sort();
                    readfiles();
                    /**
                     * 读取zip中所有文件
                     */
                    function readfiles() {
                        if (filepaths.length > 0) {
                            var filepath = filepaths.shift();
                            var file = zip.files[filepath];
                            if (file.dir) {
                                editor.editorFS.fs.mkdir(filepath, readfiles);
                            }
                            else {
                                file.async("arraybuffer").then(function (data) {
                                    editor.editorFS.fs.writeArrayBuffer(filepath, data, function (err) {
                                        if (err)
                                            console.log(err);
                                        readfiles();
                                    });
                                }, function (reason) {
                                    console.warn(reason);
                                    readfiles();
                                });
                            }
                        }
                        else {
                            callback();
                        }
                    }
                });
            };
            request.onerror = function (ev) {
                feng3d.error(request.responseURL + "不存在，无法初始化项目！");
            };
            request.send();
        };
        EditorFS.prototype.selectFile = function (callback) {
            selectFileCallback = callback;
            isSelectFile = true;
        };
        /**
         * 导出项目
         */
        EditorFS.prototype.exportProject = function (callback) {
            var zip = new JSZip();
            editor.editorFS.fs.getAllfilepathInFolder("", function (err, filepaths) {
                readfiles();
                function readfiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        editor.editorFS.fs.readArrayBuffer(filepath, function (err, data) {
                            //处理文件夹
                            data && zip.file(filepath, data);
                            readfiles();
                        });
                    }
                    else {
                        zip.generateAsync({ type: "blob" }).then(function (content) {
                            callback(null, content);
                        });
                    }
                }
            });
        };
        /**
         * 导入项目
         */
        EditorFS.prototype.importProject = function (file, callback) {
            var zip = new JSZip();
            zip.loadAsync(file).then(function (value) {
                var filepaths = Object.keys(value.files);
                filepaths.sort();
                writeFiles();
                function writeFiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        if (value.files[filepath].dir) {
                            editor.editorFS.fs.mkdir(filepath, function (err) {
                                writeFiles();
                            });
                        }
                        else {
                            zip.file(filepath).async("arraybuffer").then(function (data) {
                                editor.editorFS.fs.writeArrayBuffer(filepath, data, function (err) {
                                    writeFiles();
                                });
                            }, function (reason) {
                            });
                        }
                    }
                    else {
                        callback();
                    }
                }
            });
        };
        return EditorFS;
    }(feng3d.ReadWriteAssetsFS));
    editor.EditorFS = EditorFS;
    if (typeof require == "undefined") {
        feng3d.assets = editor.editorFS = new EditorFS(feng3d.indexedDBFS);
    }
    else {
        var nativeFS = require(__dirname + "/io/NativeFS.js").nativeFS;
        feng3d.assets = editor.editorFS = new EditorFS(nativeFS);
    }
    //
    var isSelectFile = false;
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = "none";
    fileInput.addEventListener('change', function (event) {
        selectFileCallback && selectFileCallback(fileInput.files);
        selectFileCallback = null;
        fileInput.value = null;
    });
    // document.body.appendChild(fileInput);
    window.addEventListener("click", function () {
        if (isSelectFile)
            fileInput.click();
        isSelectFile = false;
    });
    var selectFileCallback;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var EditorCache = /** @class */ (function () {
        function EditorCache() {
            var value = localStorage.getItem("feng3d-editor");
            if (!value)
                return;
            var obj = JSON.parse(value);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    this[key] = obj[key];
                }
            }
        }
        EditorCache.prototype.save = function () {
            localStorage.setItem("feng3d-editor", JSON.stringify(this));
        };
        return EditorCache;
    }());
    editor.EditorCache = EditorCache;
    editor.editorcache = new EditorCache();
    window.addEventListener("beforeunload", function () {
        if (codeeditoWin)
            codeeditoWin.close();
        if (editor.runwin)
            editor.runwin.close();
        editor.editorcache.save();
    });
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Drag = /** @class */ (function () {
        function Drag() {
        }
        Drag.prototype.register = function (displayObject, setdargSource, accepttypes, onDragDrop) {
            this.unregister(displayObject);
            registers.push({ displayObject: displayObject, setdargSource: setdargSource, accepttypes: accepttypes, onDragDrop: onDragDrop });
            if (setdargSource)
                displayObject.addEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null, false, 1000);
        };
        Drag.prototype.unregister = function (displayObject) {
            for (var i = registers.length - 1; i >= 0; i--) {
                if (registers[i].displayObject == displayObject) {
                    registers.splice(i, 1);
                }
            }
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_DOWN, onItemMouseDown, null);
        };
        /** 当拖拽过程中拖拽数据发生变化时调用该方法刷新可接受对象列表 */
        Drag.prototype.refreshAcceptables = function () {
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce(function (value, item) {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
        };
        return Drag;
    }());
    editor.Drag = Drag;
    ;
    editor.drag = new Drag();
    var stage;
    var registers = [];
    /**
     * 对象与触发接受拖拽的对象列表
     */
    var accepters = new Map();
    /**
     * 被拖拽数据
     */
    var dragSource;
    /**
     * 被拖拽对象
     */
    var dragitem;
    /**
     * 可接受拖拽数据对象列表
     */
    var acceptableitems;
    function getitem(displayObject) {
        for (var i = 0; i < registers.length; i++) {
            if (registers[i].displayObject == displayObject)
                return registers[i];
        }
        return null;
    }
    /**
     * 判断是否接受数据
     * @param item
     * @param dragSource
     */
    function acceptData(item, dragSource) {
        var hasdata = item.accepttypes.reduce(function (prevalue, accepttype) { return prevalue || !!dragSource[accepttype]; }, false);
        return hasdata;
    }
    function onItemMouseDown(event) {
        if (dragitem)
            return;
        dragitem = getitem(event.currentTarget);
        if (!dragitem.setdargSource) {
            dragitem = null;
            return;
        }
        if (dragitem) {
            stage = dragitem.displayObject.stage;
            stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
            stage.addEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
        }
    }
    function onMouseUp(event) {
        stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, onMouseMove, null);
        stage.removeEventListener(egret.MouseEvent.MOUSE_UP, onMouseUp, null);
        acceptableitems = null;
        accepters.getKeys().forEach(function (element) {
            element.alpha = accepters.get(element);
            var accepteritem = getitem(element);
            accepteritem.onDragDrop && accepteritem.onDragDrop(dragSource);
        });
        accepters.clear();
        dragitem = null;
    }
    function onMouseMove(event) {
        if (!acceptableitems) {
            //获取拖拽数据
            dragSource = {};
            dragitem.setdargSource(dragSource);
            //获取可接受数据的对象列表
            acceptableitems = registers.reduce(function (value, item) {
                if (item != dragitem && acceptData(item, dragSource)) {
                    value.push(item);
                }
                return value;
            }, []);
        }
        accepters.getKeys().forEach(function (element) {
            element.alpha = accepters.get(element);
        });
        accepters.clear();
        acceptableitems.forEach(function (element) {
            if (element.displayObject.getTransformedBounds(stage).contains(event.stageX, event.stageY)) {
                accepters.set(element.displayObject, element.displayObject.alpha);
                element.displayObject.alpha = 0.5;
            }
        });
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Editorshortcut = /** @class */ (function () {
        function Editorshortcut() {
            this.selectedObjectsHistory = [];
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", this.onDeleteSeletedGameObject, this);
            //
            feng3d.shortcut.on("gameobjectMoveTool", this.onGameobjectMoveTool, this);
            feng3d.shortcut.on("gameobjectRotationTool", this.onGameobjectRotationTool, this);
            feng3d.shortcut.on("gameobjectScaleTool", this.onGameobjectScaleTool, this);
            feng3d.shortcut.on("selectGameObject", this.onSelectGameObject, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", this.onSceneCameraForwardBackMouseMoveStart, this);
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", this.onSceneCameraForwardBackMouseMove, this);
            //
            feng3d.shortcut.on("lookToSelectedGameObject", this.onLookToSelectedGameObject, this);
            feng3d.shortcut.on("dragSceneStart", this.onDragSceneStart, this);
            feng3d.shortcut.on("dragScene", this.onDragScene, this);
            feng3d.shortcut.on("fpsViewStart", this.onFpsViewStart, this);
            feng3d.shortcut.on("fpsViewStop", this.onFpsViewStop, this);
            feng3d.shortcut.on("mouseRotateSceneStart", this.onMouseRotateSceneStart, this);
            feng3d.shortcut.on("mouseRotateScene", this.onMouseRotateScene, this);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", this.onMouseWheelMoveSceneCamera, this);
            //
            feng3d.shortcut.on("areaSelectStart", this.onAreaSelectStart, this);
            feng3d.shortcut.on("areaSelect", this.onAreaSelect, this);
            feng3d.shortcut.on("areaSelectEnd", this.onAreaSelectEnd, this);
        }
        Editorshortcut.prototype.onAreaSelectStart = function () {
            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        };
        Editorshortcut.prototype.onAreaSelect = function () {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var lt = editor.editorui.feng3dView.localToGlobal(0, 0);
            var rb = editor.editorui.feng3dView.localToGlobal(editor.editorui.feng3dView.width, editor.editorui.feng3dView.height);
            var rectangle = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            editor.areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
            //
            var gs = editor.engine.getObjectsInGlobalArea(this.areaSelectStartPosition, areaSelectEndPosition);
            var gs0 = gs.filter(function (g) {
                return !!editor.hierarchy.getNode(g);
            });
            editor.editorData.selectMultiObject(gs0);
        };
        Editorshortcut.prototype.onAreaSelectEnd = function () {
            editor.areaSelectRect.hide();
        };
        Editorshortcut.prototype.onGameobjectMoveTool = function () {
            editor.editorData.toolType = editor.MRSToolType.MOVE;
        };
        Editorshortcut.prototype.onGameobjectRotationTool = function () {
            editor.editorData.toolType = editor.MRSToolType.ROTATION;
        };
        Editorshortcut.prototype.onGameobjectScaleTool = function () {
            editor.editorData.toolType = editor.MRSToolType.SCALE;
        };
        Editorshortcut.prototype.onSceneCameraForwardBackMouseMoveStart = function () {
            this.preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        };
        Editorshortcut.prototype.onSceneCameraForwardBackMouseMove = function () {
            var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var moveDistance = (currentMousePoint.x + currentMousePoint.y - this.preMousePoint.x - this.preMousePoint.y) * editor.sceneControlConfig.sceneCameraForwardBackwardStep;
            editor.sceneControlConfig.lookDistance -= moveDistance;
            var forward = editor.editorCamera.transform.localToWorldMatrix.forward;
            var camerascenePosition = editor.editorCamera.transform.scenePosition;
            var newCamerascenePosition = new feng3d.Vector3(forward.x * moveDistance + camerascenePosition.x, forward.y * moveDistance + camerascenePosition.y, forward.z * moveDistance + camerascenePosition.z);
            var newCameraPosition = editor.editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
            editor.editorCamera.transform.position = newCameraPosition;
            this.preMousePoint = currentMousePoint;
        };
        Editorshortcut.prototype.onSelectGameObject = function () {
            var gameObjects = feng3d.raycaster.pickAll(editor.editorCamera.getMouseRay3D(), editor.editorScene.mouseCheckObjects).sort(function (a, b) { return a.rayEntryDistance - b.rayEntryDistance; }).map(function (v) { return v.gameObject; });
            if (gameObjects.length > 0)
                return;
            //
            gameObjects = feng3d.raycaster.pickAll(editor.editorCamera.getMouseRay3D(), editor.engine.scene.mouseCheckObjects).sort(function (a, b) { return a.rayEntryDistance - b.rayEntryDistance; }).map(function (v) { return v.gameObject; });
            if (gameObjects.length == 0) {
                editor.editorData.clearSelectedObjects();
                return;
            }
            //
            gameObjects = gameObjects.reduce(function (pv, gameObject) {
                var node = editor.hierarchy.getNode(gameObject);
                while (!node && gameObject.parent) {
                    gameObject = gameObject.parent;
                    node = editor.hierarchy.getNode(gameObject);
                }
                if (gameObject != gameObject.scene.gameObject) {
                    pv.push(gameObject);
                }
                return pv;
            }, []);
            //
            if (gameObjects.length > 0) {
                var selectedObjectsHistory = this.selectedObjectsHistory;
                var gameObject = gameObjects.reduce(function (pv, cv) {
                    if (pv)
                        return pv;
                    if (selectedObjectsHistory.indexOf(cv) == -1)
                        pv = cv;
                    return pv;
                }, null);
                if (!gameObject) {
                    selectedObjectsHistory.length = 0;
                    gameObject = gameObjects[0];
                }
                editor.editorData.selectObject(gameObject);
                selectedObjectsHistory.push(gameObject);
            }
            else {
                editor.editorData.clearSelectedObjects();
            }
        };
        Editorshortcut.prototype.onDeleteSeletedGameObject = function () {
            var selectedObject = editor.editorData.selectedObjects;
            if (!selectedObject)
                return;
            //删除文件引用计数
            selectedObject.forEach(function (element) {
                if (element instanceof feng3d.GameObject) {
                    element.remove();
                }
                else if (element instanceof editor.AssetsNode) {
                    element.delete();
                }
            });
            editor.editorData.clearSelectedObjects();
        };
        Editorshortcut.prototype.onDragSceneStart = function () {
            this.dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.dragSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
        };
        Editorshortcut.prototype.onDragScene = function () {
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var addPoint = mousePoint.subTo(this.dragSceneMousePoint);
            var scale = editor.editorCamera.getScaleByDepth(editor.sceneControlConfig.lookDistance);
            var up = this.dragSceneCameraGlobalMatrix3D.up;
            var right = this.dragSceneCameraGlobalMatrix3D.right;
            up.scaleNumber(addPoint.y * scale);
            right.scaleNumber(-addPoint.x * scale);
            var globalMatrix3D = this.dragSceneCameraGlobalMatrix3D.clone();
            globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
            editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        };
        Editorshortcut.prototype.onFpsViewStart = function () {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMousedown();
            feng3d.ticker.onframe(this.updateFpsView);
        };
        Editorshortcut.prototype.onFpsViewStop = function () {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.onMouseup();
            feng3d.ticker.offframe(this.updateFpsView);
        };
        Editorshortcut.prototype.updateFpsView = function () {
            var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
            fpsController.update();
        };
        Editorshortcut.prototype.onMouseRotateSceneStart = function () {
            this.rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            this.rotateSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
            this.rotateSceneCenter = null;
            //获取第一个 游戏对象
            var transformBox = editor.editorData.transformBox;
            if (transformBox) {
                this.rotateSceneCenter = transformBox.getCenter();
            }
            else {
                this.rotateSceneCenter = this.rotateSceneCameraGlobalMatrix3D.forward;
                this.rotateSceneCenter.scaleNumber(editor.sceneControlConfig.lookDistance);
                this.rotateSceneCenter = this.rotateSceneCenter.addTo(this.rotateSceneCameraGlobalMatrix3D.position);
            }
        };
        Editorshortcut.prototype.onMouseRotateScene = function () {
            var globalMatrix3D = this.rotateSceneCameraGlobalMatrix3D.clone();
            var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var view3DRect = editor.engine.viewRect;
            var rotateX = (mousePoint.y - this.rotateSceneMousePoint.y) / view3DRect.height * 180;
            var rotateY = (mousePoint.x - this.rotateSceneMousePoint.x) / view3DRect.width * 180;
            globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, this.rotateSceneCenter);
            var rotateAxisX = globalMatrix3D.right;
            globalMatrix3D.appendRotation(rotateAxisX, rotateX, this.rotateSceneCenter);
            editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
        };
        Editorshortcut.prototype.onLookToSelectedGameObject = function () {
            var transformBox = editor.editorData.transformBox;
            if (transformBox) {
                var scenePosition = transformBox.getCenter();
                var size = transformBox.getSize().length;
                size = Math.max(size, 1);
                var lookDistance = size;
                var lens = editor.editorCamera.lens;
                if (lens instanceof feng3d.PerspectiveLens) {
                    lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
                }
                //
                editor.sceneControlConfig.lookDistance = lookDistance;
                var lookPos = editor.editorCamera.transform.localToWorldMatrix.forward;
                lookPos.scaleNumber(-lookDistance);
                lookPos.add(scenePosition);
                var localLookPos = lookPos.clone();
                if (editor.editorCamera.transform.parent) {
                    localLookPos = editor.editorCamera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
                }
                egret.Tween.get(editor.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
            }
        };
        Editorshortcut.prototype.onMouseWheelMoveSceneCamera = function () {
            var distance = -feng3d.windowEventProxy.deltaY * editor.sceneControlConfig.mouseWheelMoveStep * editor.sceneControlConfig.lookDistance / 10;
            editor.editorCamera.transform.localToWorldMatrix = editor.editorCamera.transform.localToWorldMatrix.moveForward(distance);
            editor.sceneControlConfig.lookDistance -= distance;
        };
        return Editorshortcut;
    }());
    editor.Editorshortcut = Editorshortcut;
    var SceneControlConfig = /** @class */ (function () {
        function SceneControlConfig() {
            this.mouseWheelMoveStep = 0.004;
            //dynamic
            this.lookDistance = 3;
            this.sceneCameraForwardBackwardStep = 0.01;
        }
        return SceneControlConfig;
    }());
    editor.SceneControlConfig = SceneControlConfig;
    editor.sceneControlConfig = new SceneControlConfig();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Feng3dView = /** @class */ (function (_super) {
        __extends(Feng3dView, _super);
        function Feng3dView() {
            var _this = _super.call(this) || this;
            _this.skinName = "Feng3dViewSkin";
            feng3d.Stats.init(document.getElementById("stats"));
            editor.editorui.feng3dView = _this;
            return _this;
        }
        Feng3dView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.canvas = document.getElementById("glcanvas");
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.backRect.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            feng3d.windowEventProxy.on("mousemove", this.onGlobalMouseMove, this);
            this.onResize();
            editor.drag.register(this, null, ["file_gameobject", "file_script"], function (dragdata) {
                if (dragdata.file_gameobject) {
                    editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, editor.hierarchy.rootnode.gameobject);
                }
                if (dragdata.file_script) {
                    var gameobject = editor.engine.mouse3DManager.selectedGameObject;
                    if (!gameobject || !gameobject.scene)
                        gameobject = editor.hierarchy.rootnode.gameobject;
                    gameobject.addScript(dragdata.file_script.scriptName);
                }
            });
        };
        Feng3dView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.canvas = null;
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.backRect.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            feng3d.windowEventProxy.off("mousemove", this.onGlobalMouseMove, this);
            editor.drag.unregister(this);
        };
        Feng3dView.prototype.onMouseMove = function () {
            feng3d.shortcut.activityState("mouseInView3D");
            this.inMouseMove = true;
        };
        Feng3dView.prototype.onGlobalMouseMove = function () {
            if (this.inMouseMove) {
                this.inMouseMove = false;
                return;
            }
            feng3d.shortcut.deactivityState("mouseInView3D");
        };
        Feng3dView.prototype.onResize = function () {
            if (!this.stage)
                return;
            var lt = this.localToGlobal(0, 0);
            var rb = this.localToGlobal(this.width, this.height);
            var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
            feng3d.Stats.instance.dom.style.left = bound.x + "px";
            feng3d.Stats.instance.dom.style.top = bound.y + "px";
        };
        return Feng3dView;
    }(eui.Component));
    editor.Feng3dView = Feng3dView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var CameraPreview = /** @class */ (function (_super) {
        __extends(CameraPreview, _super);
        function CameraPreview() {
            var _this = _super.call(this) || this;
            _this.skinName = "CameraPreview";
            //
            var canvas = _this.canvas = document.getElementById("cameraPreviewCanvas");
            ;
            _this.previewEngine = new feng3d.Engine(canvas);
            _this.previewEngine.mouse3DManager.mouseInput.enable = false;
            _this.previewEngine.stop();
            return _this;
        }
        Object.defineProperty(CameraPreview.prototype, "camera", {
            get: function () {
                return this._camera;
            },
            set: function (value) {
                if (this._camera) {
                    feng3d.ticker.offframe(this.onframe, this);
                }
                this._camera = value;
                this.previewEngine.camera = this._camera;
                this.visible = !!this._camera;
                this.canvas.style.display = this._camera ? "inline" : "none";
                if (this._camera) {
                    feng3d.ticker.onframe(this.onframe, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        CameraPreview.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.initView();
        };
        CameraPreview.prototype.initView = function () {
            var _this = this;
            if (this.saveParent)
                return;
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(function () {
                _this.parent.removeChild(_this);
            });
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            this.onResize();
        };
        CameraPreview.prototype.onResize = function () {
            if (!this.stage)
                return;
            var lt = this.group.localToGlobal(0, 0);
            var rb = this.group.localToGlobal(this.group.width, this.group.height);
            var bound = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
        };
        CameraPreview.prototype.onDataChange = function () {
            var selectedGameObjects = editor.editorData.selectedGameObjects;
            if (selectedGameObjects.length > 0) {
                for (var i = 0; i < selectedGameObjects.length; i++) {
                    var camera = selectedGameObjects[i].getComponent(feng3d.Camera);
                    if (camera) {
                        this.camera = camera;
                        this.saveParent.addChild(this);
                        return;
                    }
                }
            }
            this.camera = null;
            this.parent && this.parent.removeChild(this);
        };
        CameraPreview.prototype.onframe = function () {
            if (this.previewEngine.scene != editor.engine.scene) {
                this.previewEngine.scene = editor.engine.scene;
            }
            this.previewEngine.render();
        };
        return CameraPreview;
    }(eui.Component));
    editor.CameraPreview = CameraPreview;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 粒子特效控制器
     */
    var ParticleEffectController = /** @class */ (function (_super) {
        __extends(ParticleEffectController, _super);
        function ParticleEffectController() {
            var _this = _super.call(this) || this;
            _this.particleSystems = [];
            _this.skinName = "ParticleEffectController";
            return _this;
        }
        ParticleEffectController.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.initView();
            this.updateView();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ParticleEffectController.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.pauseBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.stopBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ParticleEffectController.prototype.onClick = function (e) {
            switch (e.currentTarget) {
                case this.stopBtn:
                    this.particleSystems.forEach(function (v) { return v.stop(); });
                    break;
                case this.pauseBtn:
                    if (this.isParticlePlaying)
                        this.particleSystems.forEach(function (v) { return v.pause(); });
                    else
                        this.particleSystems.forEach(function (v) { return v.continue(); });
                    break;
            }
            this.updateView();
        };
        ParticleEffectController.prototype.onEnterFrame = function () {
            var v = this.particleSystems;
            if (v) {
                var playbackSpeed = (this.particleSystems[0] && this.particleSystems[0].main.simulationSpeed) || 1;
                var playbackTime = (this.particleSystems[0] && this.particleSystems[0].time) || 0;
                var particles = this.particleSystems.reduce(function (pv, cv) { pv += cv.numActiveParticles; return pv; }, 0);
                //
                this.speedInput.text = playbackSpeed.toString();
                this.timeInput.text = playbackTime.toFixed(3);
                this.particlesInput.text = particles.toString();
            }
        };
        ParticleEffectController.prototype.initView = function () {
            var _this = this;
            if (this.saveParent)
                return;
            this.saveParent = this.parent;
            feng3d.ticker.nextframe(function () {
                _this.parent.removeChild(_this);
            });
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onDataChange, this);
        };
        ParticleEffectController.prototype.updateView = function () {
            if (!this.particleSystems)
                return;
            this.pauseBtn.label = this.isParticlePlaying ? "Pause" : "Continue";
        };
        Object.defineProperty(ParticleEffectController.prototype, "isParticlePlaying", {
            get: function () {
                return this.particleSystems.reduce(function (pv, cv) { return pv || cv.isPlaying; }, false);
            },
            enumerable: true,
            configurable: true
        });
        ParticleEffectController.prototype.onDataChange = function () {
            var _this = this;
            var particleSystems = editor.editorData.selectedGameObjects.reduce(function (pv, cv) { var ps = cv.getComponent(feng3d.ParticleSystem); ps && (pv.push(ps)); return pv; }, []);
            this.particleSystems.forEach(function (v) {
                v.pause();
                v.off("particleCompleted", _this.updateView, _this);
            });
            this.particleSystems = particleSystems;
            this.particleSystems.forEach(function (v) {
                v.continue();
                v.on("particleCompleted", _this.updateView, _this);
            });
            if (this.particleSystems.length > 0)
                this.saveParent.addChild(this);
            else
                this.parent && this.parent.removeChild(this);
        };
        return ParticleEffectController;
    }(eui.Component));
    editor.ParticleEffectController = ParticleEffectController;
})(editor || (editor = {}));
var defaultTextFiled;
function lostFocus(display) {
    if (!defaultTextFiled) {
        defaultTextFiled = new egret.TextField();
        defaultTextFiled.visible = false;
        display.stage.addChild(defaultTextFiled);
    }
    defaultTextFiled.setFocus();
}
/**
 * 重命名组件
 */
var RenameTextInput = /** @class */ (function (_super) {
    __extends(RenameTextInput, _super);
    function RenameTextInput() {
        var _this = _super.call(this) || this;
        _this.skinName = "RenameTextInputSkin";
        return _this;
    }
    Object.defineProperty(RenameTextInput.prototype, "text", {
        /**
         * 显示文本
         */
        get: function () {
            return this.nameLabel.text;
        },
        set: function (v) {
            this.nameLabel.text = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenameTextInput.prototype, "textAlign", {
        get: function () {
            return this.nameLabel.textAlign;
        },
        set: function (v) {
            this.nameeditTxt.textDisplay.textAlign = this.nameLabel.textAlign = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 启动编辑
     */
    RenameTextInput.prototype.edit = function (callback) {
        this.callback = callback;
        this.textAlign = this.textAlign;
        this.nameeditTxt.text = this.nameLabel.text;
        this.nameLabel.visible = false;
        this.nameeditTxt.visible = true;
        this.nameeditTxt.textDisplay.setFocus();
        //
        this.nameeditTxt.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
        feng3d.windowEventProxy.on("keyup", this.onnameeditChanged, this);
    };
    /**
     * 取消编辑
     */
    RenameTextInput.prototype.cancelEdit = function () {
        this.nameeditTxt.textDisplay.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.cancelEdit, this);
        feng3d.windowEventProxy.off("keyup", this.onnameeditChanged, this);
        //
        this.nameeditTxt.visible = false;
        this.nameLabel.visible = true;
        if (this.nameLabel.text == this.nameeditTxt.text)
            return;
        this.nameLabel.text = this.nameeditTxt.text;
        this.callback && this.callback();
        this.callback = null;
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    RenameTextInput.prototype.onnameeditChanged = function () {
        if (feng3d.windowEventProxy.key == "Enter" || feng3d.windowEventProxy.key == "Escape") {
            //拾取焦点
            var inputUtils = this.nameeditTxt.textDisplay["inputUtils"];
            inputUtils["onStageDownHandler"](new egret.Event(""));
        }
    };
    return RenameTextInput;
}(eui.Component));
var editor;
(function (editor) {
    var SplitGroupState;
    (function (SplitGroupState) {
        /**
         * 默认状态，鼠标呈现正常形态
         */
        SplitGroupState[SplitGroupState["default"] = 0] = "default";
        /**
         * 鼠标处在分割线上，呈现上下或者左右箭头形态
         */
        SplitGroupState[SplitGroupState["onSplit"] = 1] = "onSplit";
        /**
         * 处于拖拽分隔线状态
         */
        SplitGroupState[SplitGroupState["draging"] = 2] = "draging";
    })(SplitGroupState || (SplitGroupState = {}));
    var SplitdragData = /** @class */ (function () {
        function SplitdragData() {
            this._splitGroupState = SplitGroupState.default;
            this._layouttype = 0;
        }
        Object.defineProperty(SplitdragData.prototype, "splitGroupState", {
            get: function () {
                return this._splitGroupState;
            },
            set: function (value) {
                this._splitGroupState = value;
                this.updatecursor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitdragData.prototype, "layouttype", {
            get: function () {
                return this._layouttype;
            },
            set: function (value) {
                this._layouttype = value;
                this.updatecursor();
            },
            enumerable: true,
            configurable: true
        });
        SplitdragData.prototype.updatecursor = function () {
            if (this._splitGroupState == SplitGroupState.default) {
                egretDiv.style.cursor = "auto";
            }
            else {
                if (this._layouttype == 1) {
                    egretDiv.style.cursor = "e-resize";
                }
                else if (this._layouttype == 2) {
                    egretDiv.style.cursor = "n-resize";
                }
            }
        };
        return SplitdragData;
    }());
    var egretDiv = document.getElementsByClassName("egret-player")[0];
    var splitdragData = new SplitdragData();
    /**
     * 分割组，提供鼠标拖拽改变组内对象分割尺寸
     * 注：不支持 SplitGroup 中两个对象都是Group，不支持两个对象都使用百分比宽高
     */
    var SplitGroup = /** @class */ (function (_super) {
        __extends(SplitGroup, _super);
        function SplitGroup() {
            return _super.call(this) || this;
        }
        SplitGroup.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.addEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
        };
        SplitGroup.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onMouseUp, this);
        };
        SplitGroup.prototype.onMouseMove = function (e) {
            if (splitdragData.splitGroupState == SplitGroupState.default) {
                this._findSplit(e.stageX, e.stageY);
                return;
            }
            if (splitdragData.splitGroup != this)
                return;
            if (splitdragData.splitGroupState == SplitGroupState.onSplit) {
                this._findSplit(e.stageX, e.stageY);
            }
            else if (splitdragData.splitGroupState == SplitGroupState.draging) {
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                if (splitdragData.layouttype == 1) {
                    var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, e.stageX));
                    var preElementWidth = splitdragData.preElementRect.width + (layerX - splitdragData.dragingMousePoint.x);
                    var nextElementWidth = splitdragData.nextElementRect.width - (layerX - splitdragData.dragingMousePoint.x);
                    if (preElement instanceof eui.Group) {
                        preElement.setContentSize(preElementWidth, splitdragData.preElementRect.height);
                    }
                    else {
                        preElement.width = preElementWidth;
                    }
                    if (nextElement instanceof eui.Group) {
                        nextElement.setContentSize(nextElementWidth, nextElement.contentHeight);
                    }
                    else {
                        nextElement.width = nextElementWidth;
                    }
                }
                else {
                    var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, e.stageY));
                    var preElementHeight = splitdragData.preElementRect.height + (layerY - splitdragData.dragingMousePoint.y);
                    var nextElementHeight = splitdragData.nextElementRect.height - (layerY - splitdragData.dragingMousePoint.y);
                    if (preElement instanceof eui.Group) {
                        preElement.setContentSize(splitdragData.preElementRect.width, preElementHeight);
                    }
                    else {
                        preElement.height = preElementHeight;
                    }
                    if (nextElement instanceof eui.Group) {
                        nextElement.setContentSize(splitdragData.nextElementRect.width, nextElementHeight);
                    }
                    else {
                        nextElement.height = nextElementHeight;
                    }
                }
            }
        };
        SplitGroup.prototype._findSplit = function (stageX, stageY) {
            splitdragData.splitGroupState = SplitGroupState.default;
            if (this.numElements < 2)
                return;
            var layouttype = 0;
            if (this.layout instanceof eui.HorizontalLayout) {
                layouttype = 1;
            }
            else if (this.layout instanceof eui.VerticalLayout) {
                layouttype = 2;
            }
            if (layouttype == 0)
                return;
            for (var i = 0; i < this.numElements - 1; i++) {
                var element = this.getElementAt(i);
                var elementRect = element.getTransformedBounds(this.stage);
                var elementRectRight = new feng3d.Rectangle(elementRect.right - 3, elementRect.top, 6, elementRect.height);
                var elementRectBotton = new feng3d.Rectangle(elementRect.left, elementRect.bottom - 3, elementRect.width, 6);
                if (layouttype == 1 && elementRectRight.contains(stageX, stageY)) {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    splitdragData.layouttype = 1;
                    splitdragData.splitGroup = this;
                    splitdragData.preElement = this.getElementAt(i);
                    splitdragData.nextElement = this.getElementAt(i + 1);
                    break;
                }
                else if (layouttype == 2 && elementRectBotton.contains(stageX, stageY)) {
                    splitdragData.splitGroupState = SplitGroupState.onSplit;
                    splitdragData.layouttype = 2;
                    splitdragData.splitGroup = this;
                    splitdragData.preElement = this.getElementAt(i);
                    splitdragData.nextElement = this.getElementAt(i + 1);
                    break;
                }
            }
        };
        SplitGroup.prototype.onMouseDown = function (e) {
            if (splitdragData.splitGroupState == SplitGroupState.onSplit) {
                splitdragData.splitGroupState = SplitGroupState.draging;
                splitdragData.dragingMousePoint = new feng3d.Vector2(e.stageX, e.stageY);
                //
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                var preElementRect = splitdragData.preElementRect = preElement.getTransformedBounds(this.stage);
                var nextElementRect = splitdragData.nextElementRect = nextElement.getTransformedBounds(this.stage);
                //
                var minX = preElementRect.left + (preElement.minWidth ? preElement.minWidth : 10);
                var maxX = nextElementRect.right - (nextElement.minWidth ? nextElement.minWidth : 10);
                var minY = preElementRect.top + (preElement.minHeight ? preElement.minHeight : 10);
                var maxY = nextElementRect.bottom - (nextElement.minHeight ? nextElement.minHeight : 10);
                splitdragData.dragRect = new egret.Rectangle(minX, minY, maxX - minX, maxY - minY);
            }
        };
        SplitGroup.prototype.onMouseUp = function (e) {
            if (splitdragData.splitGroupState == SplitGroupState.draging) {
                splitdragData.splitGroupState = SplitGroupState.default;
                splitdragData.dragingMousePoint = null;
            }
        };
        return SplitGroup;
    }(eui.Group));
    editor.SplitGroup = SplitGroup;
})(editor || (editor = {}));
var TabViewButton = /** @class */ (function (_super) {
    __extends(TabViewButton, _super);
    function TabViewButton() {
        var _this = _super.call(this) || this;
        _this.skinName = "TabViewButtonSkin";
        return _this;
    }
    TabViewButton.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TabViewButton.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TabViewButton;
}(eui.Button));
var TabView = /** @class */ (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        return _super.call(this) || this;
    }
    TabView.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TabView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TabView;
}(eui.Component));
var editor;
(function (editor) {
    var Maskview = /** @class */ (function () {
        function Maskview() {
        }
        Maskview.prototype.mask = function (displayObject, onMaskClick) {
            if (onMaskClick === void 0) { onMaskClick = null; }
            var maskReck = new eui.Rect();
            maskReck.alpha = 0;
            if (displayObject.stage) {
                onAddedToStage();
            }
            else {
                displayObject.once(egret.Event.ADDED_TO_STAGE, onAddedToStage, null);
            }
            function onAddedToStage() {
                maskReck.width = displayObject.stage.stageWidth;
                maskReck.height = displayObject.stage.stageHeight;
                var index = displayObject.parent.getChildIndex(displayObject);
                editor.editorui.popupLayer.addChildAt(maskReck, index);
                //
                maskReck.addEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                feng3d.shortcut.activityState("inModal");
            }
            function removeDisplayObject() {
                if (displayObject.parent)
                    displayObject.parent.removeChild(displayObject);
                onMaskClick && onMaskClick();
            }
            function onRemoveFromStage() {
                maskReck.removeEventListener(egret.MouseEvent.CLICK, removeDisplayObject, null);
                displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onRemoveFromStage, null);
                if (maskReck.parent) {
                    maskReck.parent.removeChild(maskReck);
                }
                feng3d.ticker.nextframe(function () {
                    feng3d.shortcut.deactivityState("inModal");
                });
            }
        };
        return Maskview;
    }());
    editor.Maskview = Maskview;
    ;
    editor.maskview = new Maskview();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 弹出一个objectview界面，点击其它区域关闭界面，并且调用关闭回调
     */
    var Popupview = /** @class */ (function () {
        function Popupview() {
        }
        Popupview.prototype.popupObject = function (object, closecallback, x, y, width, height) {
            var view = feng3d.objectview.getObjectView(object);
            var background = new eui.Rect(width || 300, height || 300, 0xf0f0f0);
            view.addChildAt(background, 0);
            //
            this.popupView(view, function () {
                closecallback && closecallback(object);
            }, x, y, width, height);
        };
        Popupview.prototype.popupView = function (view, closecallback, x, y, width, height) {
            editor.editorui.popupLayer.addChild(view);
            if (width !== undefined)
                view.width = width;
            if (height !== undefined)
                view.height = height;
            var x0 = (editor.editorui.stage.stageWidth - view.width) / 2;
            var y0 = (editor.editorui.stage.stageHeight - view.height) / 2;
            if (x !== undefined) {
                x0 = x;
            }
            if (y !== undefined) {
                y0 = y;
            }
            x0 = feng3d.FMath.clamp(x0, 0, editor.editorui.popupLayer.stage.stageWidth - view.width);
            y0 = feng3d.FMath.clamp(y0, 0, editor.editorui.popupLayer.stage.stageHeight - view.height);
            view.x = x0;
            view.y = y0;
            editor.maskview.mask(view, function () {
                closecallback && closecallback();
            });
        };
        return Popupview;
    }());
    editor.Popupview = Popupview;
    ;
    editor.popupview = new Popupview();
})(editor || (editor = {}));
/**
 * 下拉列表
 */
var ComboBox = /** @class */ (function (_super) {
    __extends(ComboBox, _super);
    function ComboBox() {
        var _this = _super.call(this) || this;
        /**
         * 数据
         */
        _this.dataProvider = [];
        _this.skinName = "ComboBoxSkin";
        return _this;
    }
    Object.defineProperty(ComboBox.prototype, "data", {
        /**
         * 选中数据
         */
        get: function () {
            return this._data;
        },
        set: function (v) {
            this._data = v;
            if (this.label) {
                if (this._data)
                    this.label.text = this._data.label;
                else
                    this.label.text = "";
            }
        },
        enumerable: true,
        configurable: true
    });
    ComboBox.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.init();
        this.updateview();
        this.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.list.addEventListener(egret.Event.CHANGE, this.onlistChange, this);
    };
    ComboBox.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        this.list.removeEventListener(egret.Event.CHANGE, this.onlistChange, this);
    };
    ComboBox.prototype.init = function () {
        this.list = new eui.List();
        this.list.itemRenderer = eui.ItemRenderer;
    };
    ComboBox.prototype.updateview = function () {
        if (this.data == null && this.dataProvider != null)
            this.data = this.dataProvider[0];
        if (this.data)
            this.label.text = this.data.label;
        else
            this.label.text = "";
    };
    ComboBox.prototype.onClick = function () {
        if (!this.dataProvider)
            return;
        this.list.dataProvider = new eui.ArrayCollection(this.dataProvider);
        var rect = this.getTransformedBounds(this.stage);
        this.list.x = rect.left;
        this.list.y = rect.bottom;
        this.list.selectedIndex = this.dataProvider.indexOf(this.data);
        editor.editorui.popupLayer.addChild(this.list);
        editor.maskview.mask(this.list);
    };
    ComboBox.prototype.onlistChange = function () {
        this.data = this.list.selectedItem;
        this.updateview();
        if (this.list.parent)
            this.list.parent.removeChild(this.list);
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    };
    return ComboBox;
}(eui.Component));
var editor;
(function (editor) {
    var Accordion = /** @class */ (function (_super) {
        __extends(Accordion, _super);
        function Accordion() {
            var _this = _super.call(this) || this;
            /**
             * 标签名称
             */
            _this.titleName = "";
            _this.components = [];
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "Accordion";
            return _this;
        }
        Accordion.prototype.addContent = function (component) {
            if (!this.contentGroup)
                this.components.push(component);
            else
                this.contentGroup.addChild(component);
        };
        Accordion.prototype.removeContent = function (component) {
            var index = this.components ? this.components.indexOf(component) : -1;
            if (index != -1)
                this.components.splice(index, 1);
            else
                component.parent && component.parent.removeChild(component);
        };
        Accordion.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        Accordion.prototype.onAddedToStage = function () {
            this.titleGroup.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.titleLabel.text = this.titleName;
            if (this.components) {
                for (var i = 0; i < this.components.length; i++) {
                    this.contentGroup.addChild(this.components[i]);
                }
                this.components = null;
                delete this.components;
            }
        };
        Accordion.prototype.onRemovedFromStage = function () {
            this.titleGroup.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        };
        Accordion.prototype.onTitleButtonClick = function () {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        };
        return Accordion;
    }(eui.Component));
    editor.Accordion = Accordion;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var ColorPicker = /** @class */ (function (_super) {
        __extends(ColorPicker, _super);
        function ColorPicker() {
            var _this = _super.call(this) || this;
            _this._value = new feng3d.Color3();
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ColorPicker";
            return _this;
        }
        Object.defineProperty(ColorPicker.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (v) {
                this._value = v;
                if (this.picker) {
                    if (this._value instanceof feng3d.Color3) {
                        this.picker.fillColor = this._value.toInt();
                    }
                    else {
                        this.picker.fillColor = this._value.toColor3().toInt();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ColorPicker.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        ColorPicker.prototype.onAddedToStage = function () {
            this.picker.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ColorPicker.prototype.onRemovedFromStage = function () {
            this.picker.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
        };
        ColorPicker.prototype.onClick = function () {
            var _this = this;
            if (!editor.colorPickerView)
                editor.colorPickerView = new editor.ColorPickerView();
            editor.colorPickerView.color = this.value;
            var pos = this.localToGlobal(0, 0);
            // pos.x = pos.x - colorPickerView.width;
            pos.x = pos.x - 318;
            editor.colorPickerView.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
            //
            editor.popupview.popupView(editor.colorPickerView, function () {
                editor.colorPickerView.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
            }, pos.x, pos.y);
        };
        ColorPicker.prototype.onPickerViewChanged = function () {
            this.value = editor.colorPickerView.color;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        return ColorPicker;
    }(eui.Component));
    editor.ColorPicker = ColorPicker;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var TreeItemRenderer = /** @class */ (function (_super) {
        __extends(TreeItemRenderer, _super);
        function TreeItemRenderer() {
            var _this = _super.call(this) || this;
            /**
             * 子结点相对父结点的缩进值，以像素为单位。默认17。
             */
            _this.indentation = 17;
            _this.watchers = [];
            _this.skinName = "TreeItemRendererSkin";
            return _this;
        }
        TreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            //
            this.disclosureButton.addEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
            this.watchers.push(eui.Watcher.watch(this, ["data", "depth"], this.updateView, this), eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this), eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this), eui.Watcher.watch(this, ["indentation"], this.updateView, this));
            this.updateView();
        };
        TreeItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            while (this.watchers.length > 0) {
                this.watchers.pop().unwatch();
            }
            //
            this.disclosureButton.removeEventListener(egret.MouseEvent.CLICK, this.onDisclosureButtonClick, this);
        };
        TreeItemRenderer.prototype.onDisclosureButtonClick = function () {
            if (this.data)
                this.data.isOpen = !this.data.isOpen;
        };
        TreeItemRenderer.prototype.updateView = function () {
            this.disclosureButton.visible = this.data ? (this.data.children && this.data.children.length > 0) : false;
            this.contentGroup.left = (this.data ? this.data.depth : 0) * this.indentation;
            this.disclosureButton.selected = this.data ? this.data.isOpen : false;
        };
        return TreeItemRenderer;
    }(eui.ItemRenderer));
    editor.TreeItemRenderer = TreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MenuItemRenderer = /** @class */ (function (_super) {
        __extends(MenuItemRenderer, _super);
        function MenuItemRenderer() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "MenuItemRender";
            return _this;
        }
        MenuItemRenderer.prototype.dataChanged = function () {
            _super.prototype.dataChanged.call(this);
            this.updateView();
        };
        MenuItemRenderer.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        MenuItemRenderer.prototype.onAddedToStage = function () {
            this.addEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false, 1000);
            this.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
            this.menuUI = this.parent;
            this.updateView();
        };
        MenuItemRenderer.prototype.onRemovedFromStage = function () {
            this.removeEventListener(egret.MouseEvent.CLICK, this.onItemMouseDown, this, false);
            this.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onItemMouseOver, this);
            this.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onItemMouseOut, this);
            this.menuUI = null;
        };
        MenuItemRenderer.prototype.updateView = function () {
            if (!this.data)
                return;
            this.touchEnabled = true;
            this.touchChildren = true;
            if (this.data.type == 'separator') {
                this.skin.currentState = "separator";
                this.touchEnabled = false;
                this.touchChildren = false;
            }
            else if (this.data.submenu) {
                this.skin.currentState = "sub";
            }
            else {
                this.skin.currentState = "normal";
            }
            this.selectedRect.visible = false;
        };
        MenuItemRenderer.prototype.onItemMouseDown = function (event) {
            this.data.click && this.data.click();
            this.menuUI.topMenu.remove();
        };
        MenuItemRenderer.prototype.onItemMouseOver = function () {
            if (this.data.submenu) {
                var rect = this.getTransformedBounds(this.stage);
                if (rect.right + 300 > this.stage.stageWidth)
                    rect.x -= rect.width + 150;
                this.menuUI.subMenuUI = editor.MenuUI.create(this.data.submenu, { mousex: rect.right, mousey: rect.top });
                this.menuUI.subMenuUI.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            }
            else {
                this.menuUI.subMenuUI = null;
            }
            this.selectedRect.visible = true;
        };
        MenuItemRenderer.prototype.onItemMouseOut = function () {
            if (!this.menuUI.subMenuUI)
                this.selectedRect.visible = false;
        };
        MenuItemRenderer.prototype.onsubMenuUIRemovedFromeStage = function (e) {
            var current = e.currentTarget;
            current.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onsubMenuUIRemovedFromeStage, this);
            this.selectedRect.visible = false;
        };
        return MenuItemRenderer;
    }(eui.ItemRenderer));
    editor.MenuItemRenderer = MenuItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var TreeNode = /** @class */ (function (_super) {
        __extends(TreeNode, _super);
        function TreeNode(obj) {
            var _this = _super.call(this) || this;
            /**
             * 标签
             */
            _this.label = "";
            /**
             * 是否打开
             */
            _this.isOpen = false;
            /**
             * 是否选中
             */
            _this.selected = false;
            /**
             * 父结点
             */
            _this.parent = null;
            if (obj) {
                Object.assign(_this, obj);
            }
            return _this;
        }
        Object.defineProperty(TreeNode.prototype, "depth", {
            /**
             * 目录深度
             */
            get: function () {
                var d = 0;
                var p = this.parent;
                while (p) {
                    d++;
                    p = p.parent;
                }
                return d;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 销毁
         */
        TreeNode.prototype.destroy = function () {
            if (this.children) {
                this.children.concat().forEach(function (element) {
                    element.destroy();
                });
            }
            this.remove();
            this.parent = null;
            this.children = null;
        };
        /**
         * 判断是否包含结点
         */
        TreeNode.prototype.contain = function (node) {
            while (node) {
                if (node == this)
                    return true;
                node = node.parent;
            }
            return false;
        };
        TreeNode.prototype.addChild = function (node) {
            node.remove();
            feng3d.assert(!node.contain(this), "无法添加到自身结点中!");
            if (this.children.indexOf(node) == -1)
                this.children.push(node);
            node.parent = this;
            this.dispatch("added", node, true);
        };
        TreeNode.prototype.remove = function () {
            if (this.parent) {
                var index = this.parent.children.indexOf(this);
                if (index != -1)
                    this.parent.children.splice(index, 1);
                this.dispatch("removed", this, true);
                this.parent = null;
            }
        };
        TreeNode.prototype.getShowNodes = function () {
            var nodes = [this];
            if (this.isOpen) {
                this.children.forEach(function (element) {
                    nodes = nodes.concat(element.getShowNodes());
                });
            }
            return nodes;
        };
        TreeNode.prototype.openParents = function () {
            var p = this.parent;
            while (p) {
                p.isOpen = true;
                p = p.parent;
            }
        };
        TreeNode.prototype.openChanged = function () {
            this.dispatch("openChanged", null, true);
        };
        __decorate([
            feng3d.watch("openChanged")
        ], TreeNode.prototype, "isOpen", void 0);
        return TreeNode;
    }(feng3d.EventDispatcher));
    editor.TreeNode = TreeNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Vector3DView = /** @class */ (function (_super) {
        __extends(Vector3DView, _super);
        function Vector3DView() {
            var _this = _super.call(this) || this;
            _this._vm = new feng3d.Vector3(1, 2, 3);
            _this._showw = false;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "Vector3DViewSkin";
            return _this;
        }
        Object.defineProperty(Vector3DView.prototype, "vm", {
            get: function () {
                return this._vm;
            },
            set: function (v) {
                if (v)
                    this._vm = v;
                else
                    this._vm = new feng3d.Vector3(1, 2, 3);
                this.showw = v instanceof feng3d.Vector4;
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3DView.prototype, "showw", {
            set: function (value) {
                if (this._showw == value)
                    return;
                this._showw = value;
                this.skin.currentState = this._showw ? "showw" : "default";
            },
            enumerable: true,
            configurable: true
        });
        Vector3DView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        Vector3DView.prototype.onAddedToStage = function () {
            var _this = this;
            this.skin.currentState = this._showw ? "showw" : "default";
            this.updateView();
            [this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach(function (item) {
                _this.addItemEventListener(item);
            });
        };
        Vector3DView.prototype.onRemovedFromStage = function () {
            var _this = this;
            [this.xTextInput, this.yTextInput, this.zTextInput, this.wTextInput].forEach(function (item) {
                _this.removeItemEventListener(item);
            });
        };
        Vector3DView.prototype.addItemEventListener = function (input) {
            input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        Vector3DView.prototype.removeItemEventListener = function (input) {
            input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        Vector3DView.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        Vector3DView.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.updateView();
        };
        Vector3DView.prototype.updateView = function () {
            if (this._textfocusintxt)
                return;
            if (!this.xTextInput)
                return;
            this.xTextInput.text = "" + this.vm.x;
            this.yTextInput.text = "" + this.vm.y;
            this.zTextInput.text = "" + this.vm.z;
            if (this.vm instanceof feng3d.Vector4)
                this.wTextInput.text = "" + this.vm.w;
        };
        Vector3DView.prototype.onTextChange = function (event) {
            if (!this._textfocusintxt)
                return;
            switch (event.currentTarget) {
                case this.xTextInput:
                    this.vm.x = Number(this.xTextInput.text);
                    break;
                case this.yTextInput:
                    this.vm.y = Number(this.yTextInput.text);
                    break;
                case this.zTextInput:
                    this.vm.z = Number(this.zTextInput.text);
                    break;
                case this.wTextInput:
                    if (this.vm instanceof feng3d.Vector4)
                        this.wTextInput.text = "" + this.vm.w;
                    break;
            }
        };
        return Vector3DView;
    }(eui.Component));
    editor.Vector3DView = Vector3DView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var ComponentView = /** @class */ (function (_super) {
        __extends(ComponentView, _super);
        /**
         * 对象界面数据
         */
        function ComponentView(component) {
            var _this = _super.call(this) || this;
            _this.component = component;
            component.on("refreshView", _this.onRefreshView, _this);
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ComponentSkin";
            return _this;
        }
        /**
         * 更新界面
         */
        ComponentView.prototype.updateView = function () {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        };
        ComponentView.prototype.onComplete = function () {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.componentIcon = this.accordion["componentIcon"];
            this.helpBtn = this.accordion["helpBtn"];
            this.operationBtn = this.accordion["operationBtn"];
            if (this.component instanceof feng3d.Transform) {
                this.componentIcon.source = "Transform_png";
            }
            else if (this.component instanceof feng3d.Water) {
                this.componentIcon.source = "Water_png";
            }
            else if (this.component instanceof feng3d.Terrain) {
                this.componentIcon.source = "Terrain_png";
            }
            else if (this.component instanceof feng3d.Model) {
                this.componentIcon.source = "Model_png";
            }
            else if (this.component instanceof feng3d.ScriptComponent) {
                this.componentIcon.source = "ScriptComponent_png";
            }
            else if (this.component instanceof feng3d.Camera) {
                this.componentIcon.source = "Camera_png";
            }
            else if (this.component instanceof feng3d.AudioSource) {
                this.componentIcon.source = "AudioSource_png";
            }
            else if (this.component instanceof feng3d.SpotLight) {
                this.componentIcon.source = "SpotLight_png";
            }
            else if (this.component instanceof feng3d.PointLight) {
                this.componentIcon.source = "PointLight_png";
            }
            else if (this.component instanceof feng3d.DirectionalLight) {
                this.componentIcon.source = "DirectionalLight_png";
            }
            else if (this.component instanceof feng3d.FPSController) {
                this.componentIcon.source = "FPSController_png";
            }
            else if (this.component instanceof feng3d.AudioListener) {
                this.componentIcon.source = "AudioListener_png";
            }
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        };
        ComponentView.prototype.onDeleteButton = function (event) {
            if (this.component.gameObject)
                this.component.gameObject.removeComponent(this.component);
        };
        ComponentView.prototype.onAddToStage = function () {
            this.initScriptView();
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.addEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.addEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.feng3dDispatcher.on("assets.scriptChanged", this.onScriptChanged, this);
        };
        ComponentView.prototype.onRemovedFromStage = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
            this.operationBtn.removeEventListener(egret.MouseEvent.CLICK, this.onOperationBtnClick, this);
            this.helpBtn.removeEventListener(egret.MouseEvent.CLICK, this.onHelpBtnClick, this);
            feng3d.feng3dDispatcher.off("assets.scriptChanged", this.onScriptChanged, this);
        };
        ComponentView.prototype.onRefreshView = function () {
            this.accordion.removeContent(this.componentView);
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
        };
        ComponentView.prototype.updateEnableCB = function () {
            if (this.component instanceof feng3d.Behaviour) {
                this.enabledCB.selected = this.component.enabled;
                this.enabledCB.visible = true;
            }
            else {
                this.enabledCB.visible = false;
            }
        };
        ComponentView.prototype.onEnableCBChange = function () {
            if (this.component instanceof feng3d.Behaviour) {
                this.component.enabled = this.enabledCB.selected;
            }
        };
        ComponentView.prototype.initScriptView = function () {
            // 初始化Script属性面板
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.watch(this.component, "scriptName", this.onScriptChanged, this);
                var component = this.component;
                if (component.scriptInstance) {
                    this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, { autocreate: false });
                    this.accordion.addContent(this.scriptView);
                }
            }
        };
        ComponentView.prototype.removeScriptView = function () {
            // 移除Script属性面板
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.unwatch(this.component, "scriptName", this.onScriptChanged, this);
            }
            if (this.scriptView) {
                if (this.scriptView.parent)
                    this.scriptView.parent.removeChild(this.scriptView);
            }
        };
        ComponentView.prototype.onOperationBtnClick = function () {
            var _this = this;
            var menus = [];
            if (!(this.component instanceof feng3d.Transform)) {
                menus.push({
                    label: "移除组件",
                    click: function () {
                        if (_this.component.gameObject)
                            _this.component.gameObject.removeComponent(_this.component);
                    }
                });
            }
            editor.menu.popup(menus, { mousex: this.stage.stageWidth - 150 });
        };
        ComponentView.prototype.onHelpBtnClick = function () {
            window.open("http://feng3d.gitee.io/#/script");
        };
        ComponentView.prototype.onScriptChanged = function () {
            var _this = this;
            setTimeout(function () {
                _this.removeScriptView();
                _this.initScriptView();
            }, 10);
        };
        return ComponentView;
    }(eui.Component));
    editor.ComponentView = ComponentView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var ParticleComponentView = /** @class */ (function (_super) {
        __extends(ParticleComponentView, _super);
        /**
         * 对象界面数据
         */
        function ParticleComponentView(component) {
            var _this = _super.call(this) || this;
            _this.component = component;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "ParticleComponentView";
            return _this;
        }
        /**
         * 更新界面
         */
        ParticleComponentView.prototype.updateView = function () {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        };
        ParticleComponentView.prototype.onComplete = function () {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.component).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.component, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage)
                this.onAddToStage();
        };
        ParticleComponentView.prototype.onAddToStage = function () {
            this.updateView();
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
        };
        ParticleComponentView.prototype.onRemovedFromStage = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.component, "enabled", this.updateEnableCB, this);
        };
        ParticleComponentView.prototype.updateEnableCB = function () {
            this.enabledCB.selected = this.component.enabled;
        };
        ParticleComponentView.prototype.onEnableCBChange = function () {
            this.component.enabled = this.enabledCB.selected;
        };
        return ParticleComponentView;
    }(eui.Component));
    editor.ParticleComponentView = ParticleComponentView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Menu = /** @class */ (function () {
        function Menu() {
        }
        Menu.prototype.popup = function (menu, parm) {
            var menuUI = MenuUI.create(menu, parm);
            editor.maskview.mask(menuUI);
        };
        Menu.prototype.popupEnum = function (enumDefinition, currentValue, selectCallBack, parm) {
            var menu = [];
            for (var key in enumDefinition) {
                if (enumDefinition.hasOwnProperty(key)) {
                    if (isNaN(Number(key))) {
                        menu.push({
                            label: (currentValue == enumDefinition[key] ? "√ " : "   ") + key,
                            click: (function (v) {
                                return function () { return selectCallBack(v); };
                            })(enumDefinition[key])
                        });
                    }
                }
            }
            this.popup(menu, parm);
        };
        return Menu;
    }());
    editor.Menu = Menu;
    ;
    editor.menu = new Menu();
    var MenuUI = /** @class */ (function (_super) {
        __extends(MenuUI, _super);
        function MenuUI() {
            var _this = _super.call(this) || this;
            _this.itemRenderer = editor.MenuItemRenderer;
            _this.onComplete();
            return _this;
        }
        Object.defineProperty(MenuUI.prototype, "subMenuUI", {
            get: function () {
                return this._subMenuUI;
            },
            set: function (v) {
                if (this._subMenuUI)
                    this._subMenuUI.remove();
                this._subMenuUI = v;
                if (this._subMenuUI)
                    this._subMenuUI.parentMenuUI = this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MenuUI.prototype, "topMenu", {
            get: function () {
                var m = this.parentMenuUI ? this.parentMenuUI.topMenu : this;
                return m;
            },
            enumerable: true,
            configurable: true
        });
        MenuUI.create = function (menu, parm) {
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);
            menuUI.dataProvider = dataProvider;
            editor.editorui.popupLayer.addChild(menuUI);
            parm = Object.assign({ width: 150 }, parm);
            if (parm.width !== undefined)
                menuUI.width = parm.width;
            menuUI.x = parm.mousex || feng3d.windowEventProxy.clientX;
            menuUI.y = parm.mousey || feng3d.windowEventProxy.clientY;
            if (menuUI.x + menuUI.width > editor.editorui.popupLayer.stage.stageWidth)
                menuUI.x -= menuUI.width;
            if (menuUI.y + menuUI.height > editor.editorui.popupLayer.stage.stageHeight)
                menuUI.y -= menuUI.height;
            return menuUI;
        };
        MenuUI.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        MenuUI.prototype.onAddedToStage = function () {
            this.updateView();
        };
        MenuUI.prototype.onRemovedFromStage = function () {
            this.subMenuUI = null;
            this.parentMenuUI = null;
        };
        MenuUI.prototype.updateView = function () {
        };
        MenuUI.prototype.remove = function () {
            this.parent && this.parent.removeChild(this);
        };
        return MenuUI;
    }(eui.List));
    editor.MenuUI = MenuUI;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var ToolTip = /** @class */ (function () {
        function ToolTip() {
            /**
             * 默认 提示界面
             */
            this.defaultTipview = function () { return editor.TipString; };
            /**
             * tip界面映射表，{key:数据类定义,value:界面类定义}，例如 {key:String,value:TipString}
             */
            this.tipviewmap = new Map();
            this.tipmap = new Map();
        }
        ToolTip.prototype.register = function (displayObject, tip) {
            if (!displayObject)
                return;
            this.tipmap.set(displayObject, tip);
            displayObject.addEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
        };
        ToolTip.prototype.unregister = function (displayObject) {
            if (!displayObject)
                return;
            this.tipmap.delete(displayObject);
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_OVER, this.onMouseOver, this);
        };
        ToolTip.prototype.onMouseOver = function (event) {
            this.removeTipview();
            var displayObject = event.currentTarget;
            var tip = this.tipmap.get(displayObject);
            var tipviewcls = this.tipviewmap.get(tip.constructor);
            if (!tipviewcls)
                tipviewcls = this.defaultTipview();
            this.tipView = new tipviewcls();
            editor.editorui.tooltipLayer.addChild(this.tipView);
            this.tipView.value = tip;
            this.tipView.x = feng3d.windowEventProxy.clientX;
            this.tipView.y = feng3d.windowEventProxy.clientY - this.tipView.height;
            //
            displayObject.addEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
        };
        ToolTip.prototype.onMouseOut = function (event) {
            var displayObject = event.currentTarget;
            displayObject.removeEventListener(egret.MouseEvent.MOUSE_OUT, this.onMouseOut, this);
            this.removeTipview();
        };
        ToolTip.prototype.removeTipview = function () {
            if (this.tipView) {
                this.tipView.parent.removeChild(this.tipView);
                this.tipView = null;
            }
        };
        return ToolTip;
    }());
    editor.ToolTip = ToolTip;
    editor.toolTip = new ToolTip();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var colors = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff, 0xff0000];
    /**
     */
    var ColorPickerView = /** @class */ (function (_super) {
        __extends(ColorPickerView, _super);
        function ColorPickerView() {
            var _this = _super.call(this) || this;
            //
            _this.color = new feng3d.Color4(0.2, 0.5, 0);
            _this.skinName = "ColorPickerView";
            return _this;
        }
        ColorPickerView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var w = this.group1.width - 4;
            var h = this.group1.height - 4;
            this.image1.source = new feng3d.ImageUtil(w, h).drawMinMaxGradient(new feng3d.Gradient().fromColors(colors), false).toDataURL();
            this.updateView();
            //
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        };
        ColorPickerView.prototype.$onRemoveFromStage = function () {
            //
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtR.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtR.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtG.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtG.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtB.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtB.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtA.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtA.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.txtColor.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.txtColor.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            //
            this.group0.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.group1.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            //
            _super.prototype.$onRemoveFromStage.call(this);
        };
        ColorPickerView.prototype.onMouseDown = function (e) {
            this._mouseDownGroup = e.currentTarget;
            this.onMouseMove();
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        };
        ColorPickerView.prototype.onMouseMove = function () {
            var image = this.image0;
            if (this._mouseDownGroup == this.group0)
                image = this.image0;
            else
                image = this.image1;
            var p = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var start = image.localToGlobal(0, 0);
            var end = image.localToGlobal(image.width, image.height);
            var rw = feng3d.FMath.clamp((p.x - start.x) / (end.x - start.x), 0, 1);
            var rh = feng3d.FMath.clamp((p.y - start.y) / (end.y - start.y), 0, 1);
            if (this.group0 == this._mouseDownGroup) {
                this.rw = rw;
                this.rh = rh;
                var color = getColorPickerRectAtPosition(this.basecolor.toInt(), rw, rh);
            }
            else if (this.group1 == this._mouseDownGroup) {
                this.ratio = rh;
                var basecolor = this.basecolor = getMixColorAtRatio(rh, colors);
                var color = getColorPickerRectAtPosition(basecolor.toInt(), this.rw, this.rh);
            }
            if (this.color instanceof feng3d.Color3) {
                this.color = color;
            }
            else {
                this.color = new feng3d.Color4(color.r, color.g, color.b, this.color.a);
            }
        };
        ColorPickerView.prototype.onMouseUp = function () {
            this._mouseDownGroup = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        ColorPickerView.prototype.ontxtfocusin = function (e) {
            this._textfocusintxt = e.currentTarget;
        };
        ColorPickerView.prototype.ontxtfocusout = function (e) {
            this._textfocusintxt = null;
            this.updateView();
        };
        ColorPickerView.prototype.onTextChange = function (e) {
            if (this._textfocusintxt == e.currentTarget) {
                var color = this.color.clone();
                switch (this._textfocusintxt) {
                    case this.txtR:
                        color.r = (Number(this.txtR.text) || 0) / 255;
                        break;
                    case this.txtG:
                        color.g = (Number(this.txtG.text) || 0) / 255;
                        break;
                    case this.txtB:
                        color.b = (Number(this.txtB.text) || 0) / 255;
                        break;
                    case this.txtA:
                        color.a = (Number(this.txtA.text) || 0) / 255;
                        break;
                    case this.txtColor:
                        color.fromUnit(Number("0x" + this.txtColor.text) || 0);
                        break;
                }
                this.color = color;
            }
        };
        ColorPickerView.prototype.onColorChanged = function (property, oldValue, newValue) {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            if (oldValue && newValue && !oldValue.equals(newValue)) {
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        ColorPickerView.prototype.updateView = function () {
            if (this._textfocusintxt != this.txtR)
                this.txtR.text = Math.round(this.color.r * 255).toString();
            if (this._textfocusintxt != this.txtG)
                this.txtG.text = Math.round(this.color.g * 255).toString();
            if (this._textfocusintxt != this.txtB)
                this.txtB.text = Math.round(this.color.b * 255).toString();
            if (this._textfocusintxt != this.txtA)
                this.txtA.text = Math.round(this.color.a * 255).toString();
            if (this._textfocusintxt != this.txtColor)
                this.txtColor.text = this.color.toHexString().substr(1);
            if (this._mouseDownGroup == null) {
                //
                var result = getColorPickerRectPosition(this.color.toInt());
                this.basecolor = result.color;
                this.rw = result.ratioW;
                this.rh = result.ratioH;
                this.ratio = getMixColorRatio(this.basecolor.toInt(), colors);
            }
            if (this._mouseDownGroup != this.group0) {
                //
                this.image0.source = new feng3d.ImageUtil(this.group0.width - 16, this.group0.height - 16).drawColorPickerRect(this.basecolor.toInt()).toDataURL();
            }
            this.pos1.y = this.ratio * (this.group1.height - this.pos1.height);
            //
            this.pos0.x = this.rw * (this.group0.width - this.pos0.width);
            this.pos0.y = this.rh * (this.group0.height - this.pos0.height);
            //
            if (this.color instanceof feng3d.Color3) {
                this._groupAParent = this._groupAParent || this.groupA.parent;
                this.groupA.parent && this.groupA.parent.removeChild(this.groupA);
            }
            else {
                if (this.groupA.parent == null && this._groupAParent) {
                    this._groupAParent.addChildAt(this.groupA, 3);
                }
            }
        };
        __decorate([
            feng3d.watch("onColorChanged")
        ], ColorPickerView.prototype, "color", void 0);
        return ColorPickerView;
    }(eui.Component));
    editor.ColorPickerView = ColorPickerView;
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectPosition(color) {
        var black = new feng3d.Color3(0, 0, 0);
        var white = new feng3d.Color3(1, 1, 1);
        var c = new feng3d.Color3().fromUnit(color);
        var max = Math.max(c.r, c.g, c.b);
        if (max != 0)
            c = black.mix(c, 1 / max);
        var min = Math.min(c.r, c.g, c.b);
        if (min != 1)
            c = white.mix(c, 1 / (1 - min));
        var ratioH = 1 - max;
        var ratioW = 1 - min;
        return {
            /**
             * 基色
             */
            color: c,
            /**
             * 横向位置
             */
            ratioW: ratioW,
            /**
             * 纵向位置
             */
            ratioH: ratioH
        };
    }
    function getMixColorRatio(color, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (var i_1 = 0; i_1 < colors.length; i_1++) {
                ratios[i_1] = i_1 / (colors.length - 1);
            }
        }
        var colors1 = colors.map(function (v) { return new feng3d.Color3().fromUnit(v); });
        var c = new feng3d.Color3().fromUnit(color);
        var r = c.r;
        var g = c.g;
        var b = c.b;
        for (var i = 0; i < colors1.length - 1; i++) {
            var c0 = colors1[i];
            var c1 = colors1[i + 1];
            //
            if (c.equals(c0))
                return ratios[i];
            if (c.equals(c1))
                return ratios[i + 1];
            //
            var r1 = c0.r + c1.r;
            var g1 = c0.g + c1.g;
            var b1 = c0.b + c1.b;
            //
            var v = r * r1 + g * g1 + b * b1;
            if (v > 2) {
                var result = 0;
                if (r1 == 1) {
                    result = feng3d.FMath.mapLinear(r, c0.r, c1.r, ratios[i], ratios[i + 1]);
                }
                else if (g1 == 1) {
                    result = feng3d.FMath.mapLinear(g, c0.g, c1.g, ratios[i], ratios[i + 1]);
                }
                else if (b1 == 1) {
                    result = feng3d.FMath.mapLinear(b, c0.b, c1.b, ratios[i], ratios[i + 1]);
                }
                return result;
            }
        }
        return 0;
    }
    /**
     * 获取颜色的基色以及颜色拾取矩形所在位置
     * @param color 查找颜色
     */
    function getColorPickerRectAtPosition(color, rw, rh) {
        var leftTop = new feng3d.Color3(1, 1, 1);
        var rightTop = new feng3d.Color3().fromUnit(color);
        var leftBottom = new feng3d.Color3(0, 0, 0);
        var rightBottom = new feng3d.Color3(0, 0, 0);
        var top = leftTop.mixTo(rightTop, rw);
        var bottom = leftBottom.mixTo(rightBottom, rw);
        var v = top.mixTo(bottom, rh);
        return v;
    }
    function getMixColorAtRatio(ratio, colors, ratios) {
        if (!ratios) {
            ratios = [];
            for (var i_2 = 0; i_2 < colors.length; i_2++) {
                ratios[i_2] = i_2 / (colors.length - 1);
            }
        }
        var colors1 = colors.map(function (v) { return new feng3d.Color3().fromUnit(v); });
        for (var i = 0; i < colors1.length - 1; i++) {
            if (ratios[i] <= ratio && ratio <= ratios[i + 1]) {
                var mix = feng3d.FMath.mapLinear(ratio, ratios[i], ratios[i + 1], 0, 1);
                var c = colors1[i].mixTo(colors1[i + 1], mix);
                return c;
            }
        }
        return colors1[0];
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 区域选择框
     */
    var AreaSelectRect = /** @class */ (function (_super) {
        __extends(AreaSelectRect, _super);
        function AreaSelectRect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fillAlpha = 0.5;
            _this.fillColor = 0x8888ff;
            return _this;
        }
        /**
         * 显示
         * @param start 起始位置
         * @param end 结束位置
         */
        AreaSelectRect.prototype.show = function (start, end) {
            var minX = Math.min(start.x, end.x);
            var maxX = Math.max(start.x, end.x);
            var minY = Math.min(start.y, end.y);
            var maxY = Math.max(start.y, end.y);
            this.x = minX;
            this.y = minY;
            this.width = maxX - minX;
            this.height = maxY - minY;
            editor.editorui.popupLayer.addChild(this);
        };
        /**
         * 隐藏
         */
        AreaSelectRect.prototype.hide = function () {
            this.parent && this.parent.removeChild(this);
        };
        return AreaSelectRect;
    }(eui.Rect));
    editor.AreaSelectRect = AreaSelectRect;
    editor.areaSelectRect = new AreaSelectRect();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 最大最小曲线界面
     */
    var MinMaxCurveView = /** @class */ (function (_super) {
        __extends(MinMaxCurveView, _super);
        function MinMaxCurveView() {
            var _this = _super.call(this) || this;
            _this.minMaxCurve = new feng3d.MinMaxCurve();
            _this.skinName = "MinMaxCurveView";
            return _this;
        }
        MinMaxCurveView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        };
        MinMaxCurveView.prototype.$onRemoveFromStage = function () {
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.curveGroup.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveView.prototype.updateView = function () {
            this.constantGroup.visible = false;
            this.curveGroup.visible = false;
            this.randomBetweenTwoConstantsGroup.visible = false;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant) {
                this.constantGroup.visible = true;
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.constantTextInput, editable: true,
                    controller: null,
                }));
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants) {
                this.randomBetweenTwoConstantsGroup.visible = true;
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant", textInput: this.minValueTextInput, editable: true,
                    controller: null,
                }));
                this.addBinder(new editor.NumberTextInputBinder().init({
                    space: this.minMaxCurve, attribute: "constant1", textInput: this.maxValueTextInput, editable: true,
                    controller: null,
                }));
            }
            else {
                this.curveGroup.visible = true;
                var imageUtil = new feng3d.ImageUtil(this.curveGroup.width - 2, this.curveGroup.height - 2, feng3d.Color4.fromUnit(0xff565656));
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                    imageUtil.drawCurve(this.minMaxCurve.curve, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                    imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curve1, this.minMaxCurve.between0And1, new feng3d.Color4(1, 0, 0));
                }
                this.curveImage.source = imageUtil.toDataURL();
            }
        };
        MinMaxCurveView.prototype.onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveView.prototype._onMinMaxCurveChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveView.prototype.onClick = function (e) {
            var _this = this;
            switch (e.currentTarget) {
                case this.modeBtn:
                    editor.menu.popupEnum(feng3d.MinMaxCurveMode, this.minMaxCurve.mode, function (v) {
                        _this.minMaxCurve.mode = v;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    }, { width: 210 });
                    break;
                case this.curveGroup:
                    editor.minMaxCurveEditor = editor.minMaxCurveEditor || new editor.MinMaxCurveEditor();
                    editor.minMaxCurveEditor.minMaxCurve = this.minMaxCurve;
                    var pos = this.localToGlobal(0, 0);
                    pos.x = pos.x - 318;
                    editor.minMaxCurveEditor.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                    //
                    editor.popupview.popupView(editor.minMaxCurveEditor, function () {
                        editor.minMaxCurveEditor.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
                    }, pos.x, pos.y);
                    break;
            }
        };
        MinMaxCurveView.prototype.onPickerViewChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxCurveView.prototype._onRightClick = function () {
            var _this = this;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Constant || this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoConstants)
                return;
            var menus = [{
                    label: "Copy", click: function () {
                        copyCurve = Object.deepClone(_this.minMaxCurve);
                    }
                }];
            if (copyCurve && this.minMaxCurve.mode == copyCurve.mode && copyCurve.between0And1 == this.minMaxCurve.between0And1) {
                menus.push({
                    label: "Paste", click: function () {
                        Object.setValue(_this.minMaxCurve, copyCurve);
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                        _this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            editor.menu.popup(menus);
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveChanged")
        ], MinMaxCurveView.prototype, "minMaxCurve", void 0);
        return MinMaxCurveView;
    }(eui.Component));
    editor.MinMaxCurveView = MinMaxCurveView;
    var copyCurve;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MinMaxCurveEditor = /** @class */ (function (_super) {
        __extends(MinMaxCurveEditor, _super);
        function MinMaxCurveEditor() {
            var _this = _super.call(this) || this;
            _this.minMaxCurve = new feng3d.MinMaxCurve();
            _this.editing = false;
            _this.mousedownxy = { x: -1, y: -1 };
            _this.curveColor = new feng3d.Color4(1, 0, 0);
            _this.backColor = feng3d.Color4.fromUnit24(0x565656);
            _this.fillTwoCurvesColor = new feng3d.Color4(1, 1, 1, 0.2);
            _this.range = [1, -1];
            _this.imageUtil = new feng3d.ImageUtil();
            /**
             * 点绘制尺寸
             */
            _this.pointSize = 5;
            /**
             * 控制柄长度
             */
            _this.controllerLength = 50;
            _this.skinName = "MinMaxCurveEditor";
            return _this;
        }
        MinMaxCurveEditor.prototype.$onAddToStage = function (stage, nestLevel) {
            var _this = this;
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.yLabels = [this.y_0, this.y_1, this.y_2, this.y_3];
            this.xLabels = [this.x_0, this.x_1, this.x_2, this.x_3, this.x_4, this.x_5, this.x_6, this.x_7, this.x_8, this.x_9, this.x_10];
            this.sampleImages = [this.sample_0, this.sample_1, this.sample_2, this.sample_3, this.sample_4, this.sample_5, this.sample_6, this.sample_7];
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("dblclick", this.ondblclick, this);
            this.sampleImages.forEach(function (v) { return v.addEventListener(egret.MouseEvent.CLICK, _this.onSampleClick, _this); });
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.minMaxCurve, attribute: "curveMultiplier", textInput: this.multiplierInput, editable: true,
                controller: null,
            }));
            feng3d.watcher.watch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            this.updateXYLabels();
            this.updateSampleImages();
            this.updateView();
        };
        MinMaxCurveEditor.prototype.$onRemoveFromStage = function () {
            var _this = this;
            this.sampleImages.forEach(function (v) { return v.removeEventListener(egret.MouseEvent.CLICK, _this.onSampleClick, _this); });
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("dblclick", this.ondblclick, this);
            feng3d.watcher.unwatch(this.minMaxCurve, "curveMultiplier", this.updateXYLabels, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveEditor.prototype.updateView = function () {
            if (!this.stage)
                return;
            // 曲线绘制区域
            this.curveRect = new feng3d.Rectangle(this.curveGroup.x, this.curveGroup.y, this.curveGroup.width, this.curveGroup.height);
            this.canvasRect = new feng3d.Rectangle(0, 0, this.viewGroup.width, this.viewGroup.height);
            if (this.curveGroup.width < 10 || this.curveGroup.height < 10)
                return;
            this.imageUtil.init(this.canvasRect.width, this.canvasRect.height, this.backColor);
            this.drawGrid();
            this.timeline = this.minMaxCurve.curve;
            this.timeline1 = this.minMaxCurve.curve1;
            if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                this.imageUtil.drawCurve(this.timeline, this.minMaxCurve.between0And1, this.curveColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
            }
            else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                this.imageUtil.drawBetweenTwoCurves(this.minMaxCurve.curve, this.minMaxCurve.curve1, this.minMaxCurve.between0And1, this.curveColor, this.fillTwoCurvesColor, this.curveRect);
                this.drawCurveKeys(this.timeline);
                this.drawCurveKeys(this.timeline1);
            }
            this.drawSelectedKey();
            // 设置绘制结果
            this.curveImage.source = this.imageUtil.toDataURL();
        };
        MinMaxCurveEditor.prototype.updateXYLabels = function () {
            this.yLabels[0].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[1].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.25, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[2].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.5, 1, 0, this.range[0], this.range[1])).toString();
            this.yLabels[3].text = (this.minMaxCurve.curveMultiplier * feng3d.FMath.mapLinear(0.75, 1, 0, this.range[0], this.range[1])).toString();
            // for (let i = 0; i <= 10; i++)
            // {
            //     this.xLabels[i].text = (this.minMaxCurve.curveMultiplier * i / 10).toString();
            // }
        };
        MinMaxCurveEditor.prototype.updateSampleImages = function () {
            var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
            var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
            for (var i = 0; i < this.sampleImages.length; i++) {
                var element = this.sampleImages[i];
                if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve && curves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawCurve(curves[i], this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves && doubleCurves[i]) {
                    var imageUtil = new feng3d.ImageUtil(element.width, element.height, this.backColor);
                    if (!this.minMaxCurve.between0And1)
                        imageUtil.drawLine(new feng3d.Vector2(0, element.height / 2), new feng3d.Vector2(element.width, element.height / 2), feng3d.Color4.BLACK);
                    imageUtil.drawBetweenTwoCurves(doubleCurves[i].curveMin, doubleCurves[i].curveMax, this.minMaxCurve.between0And1, feng3d.Color4.WHITE);
                    element.source = imageUtil.toDataURL();
                    this.samplesGroup.addChild(element);
                }
                else {
                    element.parent && element.parent.removeChild(element);
                }
            }
        };
        MinMaxCurveEditor.prototype.onSampleClick = function (e) {
            for (var i = 0; i < this.sampleImages.length; i++) {
                var element = this.sampleImages[i];
                if (element == e.currentTarget) {
                    var curves = this.minMaxCurve.between0And1 ? particleCurves : particleCurvesSingend;
                    var doubleCurves = this.minMaxCurve.between0And1 ? particleDoubleCurves : particleDoubleCurvesSingend;
                    if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.Curve) {
                        var curve = this.minMaxCurve.curve;
                        Object.setValue(curve, curves[i]);
                    }
                    else if (this.minMaxCurve.mode == feng3d.MinMaxCurveMode.RandomBetweenTwoCurves) {
                        Object.setValue(this.minMaxCurve.curve, doubleCurves[i].curveMin);
                        Object.setValue(this.minMaxCurve.curve1, doubleCurves[i].curveMax);
                    }
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    break;
                }
            }
        };
        /**
         * 绘制曲线关键点
         * @param animationCurve
         */
        MinMaxCurveEditor.prototype.drawCurveKeys = function (animationCurve) {
            var _this = this;
            var c = new feng3d.Color4(1, 0, 0);
            animationCurve.keys.forEach(function (key) {
                var pos = _this.curveToUIPos(key.time, key.value);
                _this.imageUtil.drawPoint(pos.x, pos.y, c, _this.pointSize);
            });
        };
        /**
         * 曲线上的坐标转换为UI上的坐标
         * @param time
         * @param value
         */
        MinMaxCurveEditor.prototype.curveToUIPos = function (time, value) {
            var x = feng3d.FMath.mapLinear(time, 0, 1, this.curveRect.left, this.curveRect.right);
            var y = feng3d.FMath.mapLinear(value, this.range[0], this.range[1], this.curveRect.top, this.curveRect.bottom);
            return new feng3d.Vector2(x, y);
        };
        /**
         * UI上坐标转换为曲线上坐标
         * @param x
         * @param y
         */
        MinMaxCurveEditor.prototype.uiToCurvePos = function (x, y) {
            var time = feng3d.FMath.mapLinear(x, this.curveRect.left, this.curveRect.right, 0, 1);
            var value = feng3d.FMath.mapLinear(y, this.curveRect.top, this.curveRect.bottom, this.range[0], this.range[1]);
            return { time: time, value: value };
        };
        MinMaxCurveEditor.prototype.getKeyUIPos = function (key) {
            return this.curveToUIPos(key.time, key.value);
        };
        MinMaxCurveEditor.prototype.getKeyLeftControlUIPos = function (key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var lcp = new feng3d.Vector2(current.x - this.controllerLength * Math.cos(Math.atan(currenttan)), current.y + this.controllerLength * Math.sin(Math.atan(currenttan)));
            return lcp;
        };
        MinMaxCurveEditor.prototype.getKeyRightControlUIPos = function (key) {
            var current = this.curveToUIPos(key.time, key.value);
            var currenttan = key.tangent * this.curveRect.height / this.curveRect.width;
            var rcp = new feng3d.Vector2(current.x + this.controllerLength * Math.cos(Math.atan(currenttan)), current.y - this.controllerLength * Math.sin(Math.atan(currenttan)));
            return rcp;
        };
        /**
         * 绘制选中的关键点
         */
        MinMaxCurveEditor.prototype.drawSelectedKey = function () {
            if (this.selectedKey == null || this.selectTimeline == null)
                return;
            var key = this.selectedKey;
            //
            var i = this.selectTimeline.keys.indexOf(key);
            if (i == -1)
                return;
            var n = this.selectTimeline.keys.length;
            var c = new feng3d.Color4();
            var current = this.getKeyUIPos(key);
            this.imageUtil.drawPoint(current.x, current.y, c, this.pointSize);
            if (this.selectedKey == key) {
                // 绘制控制点
                if (i > 0) {
                    var lcp = this.getKeyLeftControlUIPos(key);
                    this.imageUtil.drawPoint(lcp.x, lcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, lcp, new feng3d.Color4());
                }
                if (i < n - 1) {
                    var rcp = this.getKeyRightControlUIPos(key);
                    this.imageUtil.drawPoint(rcp.x, rcp.y, c, this.pointSize);
                    this.imageUtil.drawLine(current, rcp, new feng3d.Color4());
                }
            }
        };
        MinMaxCurveEditor.prototype.drawGrid = function (segmentW, segmentH) {
            var _this = this;
            if (segmentW === void 0) { segmentW = 10; }
            if (segmentH === void 0) { segmentH = 2; }
            //
            var lines = [];
            var c0 = feng3d.Color4.fromUnit24(0x494949);
            var c1 = feng3d.Color4.fromUnit24(0x4f4f4f);
            for (var i = 0; i <= segmentW; i++) {
                lines.push({ start: new feng3d.Vector2(i / segmentW, 0), end: new feng3d.Vector2(i / segmentW, 1), color: i % 2 == 0 ? c0 : c1 });
            }
            for (var i = 0; i <= segmentH; i++) {
                lines.push({ start: new feng3d.Vector2(0, i / segmentH), end: new feng3d.Vector2(1, i / segmentH), color: i % 2 == 0 ? c0 : c1 });
            }
            lines.forEach(function (v) {
                v.start.x = _this.curveRect.x + _this.curveRect.width * v.start.x;
                v.start.y = _this.curveRect.y + _this.curveRect.height * v.start.y;
                v.end.x = _this.curveRect.x + _this.curveRect.width * v.end.x;
                v.end.y = _this.curveRect.y + _this.curveRect.height * v.end.y;
                //
                _this.imageUtil.drawLine(v.start, v.end, v.color);
            });
        };
        MinMaxCurveEditor.prototype._onMinMaxCurveChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.range = this.minMaxCurve.between0And1 ? [1, 0] : [1, -1];
        };
        MinMaxCurveEditor.prototype._onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveEditor.prototype.onMouseDown = function (ev) {
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            this.mousedownxy.x = x;
            this.mousedownxy.y = y;
            var curvePos = this.uiToCurvePos(x, y);
            var timeline = this.timeline;
            this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (this.editKey == null && this.timeline1 != null) {
                timeline = this.timeline1;
                this.editKey = timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            }
            if (this.editKey != null) {
                this.selectedKey = this.editKey;
                this.selectTimeline = timeline;
            }
            else if (this.selectedKey) {
                this.editorControlkey = this.findControlKey(this.selectedKey, x, y, this.pointSize);
                if (this.editorControlkey == null) {
                    this.selectedKey = null;
                    this.selectTimeline = null;
                }
            }
            if (this.editKey != null || this.editorControlkey != null) {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxCurveEditor.prototype.onMouseMove = function (ev) {
            this.editing = true;
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            if (this.editKey) {
                curvePos.time = feng3d.FMath.clamp(curvePos.time, 0, 1);
                curvePos.value = feng3d.FMath.clamp(curvePos.value, this.range[0], this.range[1]);
                //
                this.editKey.time = curvePos.time;
                this.editKey.value = curvePos.value;
                this.selectTimeline.sort();
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
            else if (this.editorControlkey) {
                var index = this.selectTimeline.indexOfKeys(this.editorControlkey);
                if (index == 0 && curvePos.time < this.editorControlkey.time) {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? Infinity : -Infinity;
                    return;
                }
                if (index == this.selectTimeline.numKeys - 1 && curvePos.time > this.editorControlkey.time) {
                    this.editorControlkey.tangent = curvePos.value > this.editorControlkey.value ? -Infinity : Infinity;
                    return;
                }
                this.editorControlkey.tangent = (curvePos.value - this.editorControlkey.value) / (curvePos.time - this.editorControlkey.time);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        MinMaxCurveEditor.prototype.onMouseUp = function (ev) {
            this.editing = false;
            this.editorControlkey = null;
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        MinMaxCurveEditor.prototype.findControlKey = function (key, x, y, radius) {
            var lcp = this.getKeyLeftControlUIPos(key);
            if (Math.abs(lcp.x - x) < radius && Math.abs(lcp.y - y) < radius) {
                return key;
            }
            var rcp = this.getKeyRightControlUIPos(key);
            if (Math.abs(rcp.x - x) < radius && Math.abs(rcp.y - y) < radius) {
                return key;
            }
            return null;
        };
        MinMaxCurveEditor.prototype.ondblclick = function (ev) {
            this.editing = false;
            this.editKey = null;
            this.editorControlkey = null;
            var lp = this.viewGroup.globalToLocal(ev.clientX, ev.clientY);
            var x = lp.x;
            var y = lp.y;
            var curvePos = this.uiToCurvePos(x, y);
            var selectedKey = this.timeline.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (selectedKey != null) {
                this.timeline.deleteKey(selectedKey);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var selectedKey = this.timeline1.findKey(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (selectedKey != null) {
                    this.timeline1.deleteKey(selectedKey);
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
            // 没有选中关键与控制点时，检查是否点击到曲线
            var newKey = this.timeline.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
            if (newKey) {
                this.selectedKey = newKey;
                this.selectTimeline = this.timeline;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                return;
            }
            if (this.timeline1 != null) {
                var newKey = this.timeline1.addKeyAtCurve(curvePos.time, curvePos.value, this.pointSize / this.curveRect.height);
                if (newKey) {
                    this.selectedKey = newKey;
                    this.selectTimeline = this.timeline1;
                    this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    return;
                }
            }
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveChanged")
        ], MinMaxCurveEditor.prototype, "minMaxCurve", void 0);
        return MinMaxCurveEditor;
    }(eui.Component));
    editor.MinMaxCurveEditor = MinMaxCurveEditor;
    var particleCurves = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];
    var particleCurvesSingend = [
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
        Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
    ];
    var particleDoubleCurves = [{
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
    ];
    var particleDoubleCurvesSingend = [
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: -1, tangent: 0 }, { time: 1, value: -1, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 1 }, { time: 1, value: 1, tangent: 1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -1 }, { time: 1, value: 0, tangent: -1 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: -2 }, { time: 1, value: 0, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 2 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 1, tangent: 0 }, { time: 1, value: 0, tangent: -2 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
        {
            curveMin: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] }),
            curveMax: Object.setValue(new feng3d.AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 0, tangent: 0 }] })
        },
    ];
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MinMaxCurveVector3View = /** @class */ (function (_super) {
        __extends(MinMaxCurveVector3View, _super);
        function MinMaxCurveVector3View() {
            var _this = _super.call(this) || this;
            _this.minMaxCurveVector3 = new feng3d.MinMaxCurveVector3();
            _this.skinName = "MinMaxCurveVector3View";
            return _this;
        }
        MinMaxCurveVector3View.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.xMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.addEventListener(egret.Event.CHANGE, this._onchanged, this);
        };
        MinMaxCurveVector3View.prototype.$onRemoveFromStage = function () {
            this.xMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.yMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            this.zMinMaxCurveView.removeEventListener(egret.Event.CHANGE, this._onchanged, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxCurveVector3View.prototype.updateView = function () {
            if (!this.stage)
                return;
            this.xMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.xCurve;
            this.yMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.yCurve;
            this.zMinMaxCurveView.minMaxCurve = this.minMaxCurveVector3.zCurve;
        };
        MinMaxCurveVector3View.prototype._onMinMaxCurveVector3Changed = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxCurveVector3View.prototype._onchanged = function () {
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        __decorate([
            feng3d.watch("_onMinMaxCurveVector3Changed")
        ], MinMaxCurveVector3View.prototype, "minMaxCurveVector3", void 0);
        return MinMaxCurveVector3View;
    }(eui.Component));
    editor.MinMaxCurveVector3View = MinMaxCurveVector3View;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 最大最小颜色渐变界面
     */
    var MinMaxGradientView = /** @class */ (function (_super) {
        __extends(MinMaxGradientView, _super);
        function MinMaxGradientView() {
            var _this = _super.call(this) || this;
            //
            _this.minMaxGradient = new feng3d.MinMaxGradient();
            _this.skinName = "MinMaxGradientView";
            return _this;
        }
        MinMaxGradientView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.secondGroupParent = this.secondGroupParent || this.secondGroup.parent;
            this.colorGroup0.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.addEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.addEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.addEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.updateView();
        };
        MinMaxGradientView.prototype.$onRemoveFromStage = function () {
            this.colorGroup0.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup1.removeEventListener(egret.Event.RESIZE, this.onReSize, this);
            this.modeBtn.removeEventListener(egret.MouseEvent.CLICK, this.onClick, this);
            this.colorGroup0.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            this.colorGroup1.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this._onRightClick, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        MinMaxGradientView.prototype.updateView = function () {
            //
            if (this.colorGroup0.width > 0 && this.colorGroup0.height > 0) {
                if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Color) {
                    var color = this.minMaxGradient.getValue(0);
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(color).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.Gradient) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawColorRect(this.minMaxGradient.color).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawColorRect(this.minMaxGradient.color1).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomBetweenTwoGradients) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    this.colorImage1.source = new feng3d.ImageUtil(this.colorGroup1.width, this.colorGroup1.height).drawMinMaxGradient(this.minMaxGradient.gradient1).toDataURL();
                    //
                    if (!this.secondGroup.parent)
                        this.secondGroupParent.addChildAt(this.secondGroup, 1);
                }
                else if (this.minMaxGradient.mode == feng3d.MinMaxGradientMode.RandomColor) {
                    this.colorImage0.source = new feng3d.ImageUtil(this.colorGroup0.width, this.colorGroup0.height).drawMinMaxGradient(this.minMaxGradient.gradient).toDataURL();
                    //
                    if (this.secondGroup.parent)
                        this.secondGroup.parent.removeChild(this.secondGroup);
                }
            }
        };
        MinMaxGradientView.prototype.onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        MinMaxGradientView.prototype._onMinMaxGradientChanged = function () {
            if (this.stage)
                this.updateView();
        };
        MinMaxGradientView.prototype.onClick = function (e) {
            var _this = this;
            var view = null;
            switch (e.currentTarget) {
                case this.colorGroup0:
                    this.activeColorGroup = this.colorGroup0;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.Color:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.Gradient:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                        case feng3d.MinMaxGradientMode.RandomColor:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient;
                            break;
                    }
                    break;
                case this.colorGroup1:
                    this.activeColorGroup = this.colorGroup1;
                    switch (this.minMaxGradient.mode) {
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                            view = editor.colorPickerView = editor.colorPickerView || new editor.ColorPickerView();
                            editor.colorPickerView.color = this.minMaxGradient.color1;
                            break;
                        case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                            view = editor.gradientEditor = editor.gradientEditor || new editor.GradientEditor();
                            editor.gradientEditor.gradient = this.minMaxGradient.gradient1;
                            break;
                    }
                    break;
                case this.modeBtn:
                    editor.menu.popupEnum(feng3d.MinMaxGradientMode, this.minMaxGradient.mode, function (v) {
                        _this.minMaxGradient.mode = v;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    }, { width: 210 });
                    break;
            }
            if (view) {
                var pos = this.localToGlobal(0, 0);
                pos.x = pos.x - 318;
                view.addEventListener(egret.Event.CHANGE, this.onPickerViewChanged, this);
                //
                editor.popupview.popupView(view, function () {
                    view.removeEventListener(egret.Event.CHANGE, _this.onPickerViewChanged, _this);
                    _this.activeColorGroup = null;
                }, pos.x, pos.y);
            }
        };
        MinMaxGradientView.prototype.onPickerViewChanged = function () {
            if (this.activeColorGroup == this.colorGroup0) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.Color:
                        this.minMaxGradient.color = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.Gradient:
                        this.minMaxGradient.gradient = editor.gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                        this.minMaxGradient.color = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                        this.minMaxGradient.gradient = editor.gradientEditor.gradient;
                        break;
                    case feng3d.MinMaxGradientMode.RandomColor:
                        this.minMaxGradient.gradient = editor.gradientEditor.gradient;
                        break;
                }
            }
            else if (this.activeColorGroup == this.colorGroup1) {
                switch (this.minMaxGradient.mode) {
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoColors:
                        this.minMaxGradient.color1 = editor.colorPickerView.color.clone();
                        break;
                    case feng3d.MinMaxGradientMode.RandomBetweenTwoGradients:
                        this.minMaxGradient.gradient1 = editor.gradientEditor.gradient;
                        break;
                }
            }
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        MinMaxGradientView.prototype._onRightClick = function (e) {
            var _this = this;
            var mode = this.minMaxGradient.mode;
            var target = e.currentTarget;
            var menus = [{
                    label: "Copy", click: function () {
                        if (target == _this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                copyColor = _this.minMaxGradient.color.clone();
                            else
                                copyGradient = Object.deepClone(_this.minMaxGradient.gradient);
                        }
                        else if (target == _this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                copyColor = _this.minMaxGradient.color1.clone();
                            else
                                copyGradient = Object.deepClone(_this.minMaxGradient.gradient1);
                        }
                    }
                }];
            if ((copyGradient != null && (mode == feng3d.MinMaxGradientMode.Gradient || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoGradients || mode == feng3d.MinMaxGradientMode.RandomColor))
                || (copyColor != null && (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors))) {
                menus.push({
                    label: "Paste", click: function () {
                        if (target == _this.colorGroup0) {
                            if (mode == feng3d.MinMaxGradientMode.Color || mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                _this.minMaxGradient.color.copy(copyColor);
                            else
                                Object.setValue(_this.minMaxGradient.gradient, copyGradient);
                        }
                        else if (target == _this.colorGroup1) {
                            if (mode == feng3d.MinMaxGradientMode.RandomBetweenTwoColors)
                                _this.minMaxGradient.color1.copy(copyColor);
                            else
                                Object.setValue(_this.minMaxGradient.gradient1, copyGradient);
                        }
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                        _this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                    }
                });
            }
            editor.menu.popup(menus);
        };
        __decorate([
            feng3d.watch("_onMinMaxGradientChanged")
        ], MinMaxGradientView.prototype, "minMaxGradient", void 0);
        return MinMaxGradientView;
    }(eui.Component));
    editor.MinMaxGradientView = MinMaxGradientView;
    var copyGradient;
    var copyColor;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var GradientEditor = /** @class */ (function (_super) {
        __extends(GradientEditor, _super);
        function GradientEditor() {
            var _this = _super.call(this) || this;
            _this.gradient = new feng3d.Gradient();
            _this.skinName = "GradientEditor";
            return _this;
        }
        GradientEditor.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.updateView();
            this.alphaLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.addEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorPicker.addEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.addEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.addEventListener(egret.Event.RESIZE, this._onReSize, this);
        };
        GradientEditor.prototype.$onRemoveFromStage = function () {
            this.alphaLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorLineGroup.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this._onMouseDown, this);
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this._onColorPickerChange, this);
            this.modeCB.removeEventListener(egret.Event.CHANGE, this._onModeCBChange, this);
            this.removeEventListener(egret.Event.RESIZE, this._onReSize, this);
            _super.prototype.$onRemoveFromStage.call(this);
        };
        GradientEditor.prototype.updateView = function () {
            var _this = this;
            if (!this.stage)
                return;
            var list = [];
            for (var key in feng3d.GradientMode) {
                if (isNaN(Number(key)))
                    list.push({ label: key, value: feng3d.GradientMode[key] });
            }
            this.modeCB.dataProvider = list;
            this.modeCB.data = list.filter(function (v) { return v.value == _this.gradient.mode; })[0];
            //
            if (this.colorImage.width > 0 && this.colorImage.height > 0) {
                this.colorImage.source = new feng3d.ImageUtil(this.colorImage.width, this.colorImage.height).drawMinMaxGradient(this.gradient).toDataURL();
            }
            if (!this._alphaSprite) {
                this.alphaLineGroup.addChild(this._alphaSprite = new egret.Sprite());
            }
            this._alphaSprite.graphics.clear();
            if (!this._colorSprite) {
                this.colorLineGroup.addChild(this._colorSprite = new egret.Sprite());
            }
            this._colorSprite.graphics.clear();
            //
            var alphaKeys = this.gradient.alphaKeys;
            for (var i = 0, n = alphaKeys.length; i < n; i++) {
                var element = alphaKeys[i];
                this._drawAlphaGraphics(this._alphaSprite.graphics, element.time, element.alpha, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == alphaKeys[i]);
            }
            var colorKeys = this.gradient.colorKeys;
            for (var i = 0, n = colorKeys.length; i < n; i++) {
                var element = colorKeys[i];
                this._drawColorGraphics(this._colorSprite.graphics, element.time, element.color, this.alphaLineGroup.width, this.alphaLineGroup.height, this._selectedValue == colorKeys[i]);
            }
            //
            this._parentGroup = this._parentGroup || this.colorGroup.parent;
            //
            if (this._alphaNumberSliderTextInputBinder) {
                this._alphaNumberSliderTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._alphaNumberSliderTextInputBinder.dispose();
            }
            //
            if (this._loactionNumberTextInputBinder) {
                this._loactionNumberTextInputBinder.off("valueChanged", this._onLocationChanged, this);
                this._loactionNumberTextInputBinder.dispose();
            }
            this.controllerGroup.visible = !!this._selectedValue;
            if (this._selectedValue) {
                if (this._selectedValue.color) {
                    this.alphaGroup.parent && this.alphaGroup.parent.removeChild(this.alphaGroup);
                    this.colorGroup.parent || this._parentGroup.addChildAt(this.colorGroup, 0);
                    //
                    this.colorPicker.value = this._selectedValue.color;
                }
                else {
                    this.colorGroup.parent && this.colorGroup.parent.removeChild(this.colorGroup);
                    this.alphaGroup.parent || this._parentGroup.addChildAt(this.alphaGroup, 0);
                    this._alphaNumberSliderTextInputBinder = new editor.NumberSliderTextInputBinder().init({
                        space: this._selectedValue, attribute: "alpha",
                        slider: this.alphaSlide,
                        textInput: this.alphaInput, controller: this.alphaLabel, minValue: 0, maxValue: 1,
                    });
                    this._alphaNumberSliderTextInputBinder.on("valueChanged", this._onAlphaChanged, this);
                }
                this._loactionNumberTextInputBinder = new editor.NumberTextInputBinder().init({
                    space: this._selectedValue, attribute: "time",
                    textInput: this.locationInput, controller: this.locationLabel, minValue: 0, maxValue: 1,
                });
                this._loactionNumberTextInputBinder.on("valueChanged", this._onLocationChanged, this);
            }
        };
        GradientEditor.prototype._drawAlphaGraphics = function (graphics, time, alpha, width, height, selected) {
            graphics.beginFill(0xffffff, alpha);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
            graphics.moveTo(time * width, height);
            graphics.lineTo(time * width - 5, height - 10);
            graphics.lineTo(time * width - 5, height - 15);
            graphics.lineTo(time * width + 5, height - 15);
            graphics.lineTo(time * width + 5, height - 10);
            graphics.lineTo(time * width, height);
            graphics.endFill();
        };
        GradientEditor.prototype._drawColorGraphics = function (graphics, time, color, width, height, selected) {
            graphics.beginFill(color.toInt(), 1);
            graphics.lineStyle(1, selected ? 0x0091ff : 0x606060);
            graphics.moveTo(time * width, 0);
            graphics.lineTo(time * width - 5, 10);
            graphics.lineTo(time * width - 5, 15);
            graphics.lineTo(time * width + 5, 15);
            graphics.lineTo(time * width + 5, 10);
            graphics.lineTo(time * width, 0);
            graphics.endFill();
        };
        GradientEditor.prototype._onAlphaChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        GradientEditor.prototype._onLocationChanged = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        GradientEditor.prototype._onReSize = function () {
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        GradientEditor.prototype._onModeCBChange = function () {
            this.gradient.mode = this.modeCB.data.value;
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        GradientEditor.prototype._onColorPickerChange = function () {
            if (this._selectedValue && this._selectedValue.color) {
                this._selectedValue.color = new feng3d.Color3(this.colorPicker.value.r, this.colorPicker.value.g, this.colorPicker.value.b);
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        GradientEditor.prototype._onGradientChanged = function () {
            this._selectedValue = this.gradient.colorKeys[0];
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        GradientEditor.prototype._onMouseDown = function (e) {
            this._onMouseDownLineGroup = e.currentTarget;
            var sp = e.currentTarget.localToGlobal(0, 0);
            var localPosX = feng3d.windowEventProxy.clientX - sp.x;
            var time = localPosX / e.currentTarget.width;
            var newAlphaKey = { time: time, alpha: this.gradient.getAlpha(time) };
            var newColorKey = { time: time, color: this.gradient.getColor(time) };
            switch (e.currentTarget) {
                case this.alphaLineGroup:
                    this._selectedValue = null;
                    var onClickIndex = -1;
                    var alphaKeys = this.gradient.alphaKeys;
                    for (var i = 0, n = alphaKeys.length; i < n; i++) {
                        var element = alphaKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1) {
                        this._selectedValue = alphaKeys[onClickIndex];
                    }
                    else if (alphaKeys.length < 8) {
                        this._selectedValue = newAlphaKey;
                        alphaKeys.push(newAlphaKey);
                        alphaKeys.sort(function (a, b) { return a.time - b.time; });
                    }
                    break;
                case this.colorLineGroup:
                    var onClickIndex = -1;
                    var colorKeys = this.gradient.colorKeys;
                    for (var i = 0, n = colorKeys.length; i < n; i++) {
                        var element = colorKeys[i];
                        if (Math.abs(element.time * this.alphaLineGroup.width - localPosX) < 8) {
                            onClickIndex = i;
                            break;
                        }
                    }
                    if (onClickIndex != -1) {
                        this._selectedValue = colorKeys[onClickIndex];
                    }
                    else if (colorKeys.length < 8) {
                        this._selectedValue = newColorKey;
                        colorKeys.push(newColorKey);
                        colorKeys.sort(function (a, b) { return a.time - b.time; });
                    }
                    break;
            }
            if (this._selectedValue) {
                //
                this.updateView();
                feng3d.windowEventProxy.on("mousemove", this._onAlphaColorMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this._onAlphaColorMouseUp, this);
                this._removedTemp = false;
            }
        };
        GradientEditor.prototype._onAlphaColorMouseMove = function () {
            if (!this._selectedValue)
                return;
            var sp = this._onMouseDownLineGroup.localToGlobal(0, 0);
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var rect = new feng3d.Rectangle(sp.x, sp.y, this._onMouseDownLineGroup.width, this._onMouseDownLineGroup.height);
            rect.inflate(8, 8);
            if (rect.containsPoint(mousePos)) {
                if (this._removedTemp) {
                    if (this._selectedValue.color) {
                        var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                        if (index == -1)
                            this.gradient.colorKeys.push(this._selectedValue);
                        this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
                        ;
                    }
                    else {
                        var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                        if (index == -1)
                            this.gradient.alphaKeys.push(this._selectedValue);
                        this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
                        ;
                    }
                    this._removedTemp = false;
                }
            }
            else {
                if (!this._removedTemp) {
                    if (this._selectedValue.color) {
                        var index = this.gradient.colorKeys.indexOf(this._selectedValue);
                        if (index != -1)
                            this.gradient.colorKeys.splice(index, 1);
                        this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
                        ;
                    }
                    else {
                        var index = this.gradient.alphaKeys.indexOf(this._selectedValue);
                        if (index != -1)
                            this.gradient.alphaKeys.splice(index, 1);
                        this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
                        ;
                    }
                    this._removedTemp = true;
                }
            }
            if (this._selectedValue.color) {
                var sp = this.colorLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.colorLineGroup.width;
                this.gradient.colorKeys.sort(function (a, b) { return a.time - b.time; });
                ;
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
            else {
                var sp = this.alphaLineGroup.localToGlobal(0, 0);
                var localPosX = feng3d.windowEventProxy.clientX - sp.x;
                this._selectedValue.time = localPosX / this.alphaLineGroup.width;
                this.gradient.alphaKeys.sort(function (a, b) { return a.time - b.time; });
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            }
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        GradientEditor.prototype._onAlphaColorMouseUp = function () {
            if (this._removedTemp) {
                this._selectedValue = null;
            }
            this._onMouseDownLineGroup = null;
            feng3d.windowEventProxy.off("mousemove", this._onAlphaColorMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this._onAlphaColorMouseUp, this);
            this.once(egret.Event.ENTER_FRAME, this.updateView, this);
        };
        __decorate([
            feng3d.watch("_onGradientChanged")
        ], GradientEditor.prototype, "gradient", void 0);
        return GradientEditor;
    }(eui.Component));
    editor.GradientEditor = GradientEditor;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * String 提示框
     */
    var TipString = /** @class */ (function (_super) {
        __extends(TipString, _super);
        function TipString() {
            var _this = _super.call(this) || this;
            _this.value = "";
            _this.skinName = "TipString";
            _this.touchChildren = _this.touchEnabled = false;
            return _this;
        }
        TipString.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.txtLab.text = String(this.value);
        };
        TipString.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
        };
        TipString.prototype.valuechanged = function () {
            if (this.txtLab) {
                this.txtLab.text = String(this.value);
            }
        };
        __decorate([
            feng3d.watch("valuechanged")
        ], TipString.prototype, "value", void 0);
        return TipString;
    }(eui.Component));
    editor.TipString = TipString;
})(editor || (editor = {}));
var eui;
(function (eui) {
    eui.Component.prototype["addBinder"] = function () {
        var _this = this;
        var binders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            binders[_i] = arguments[_i];
        }
        this._binders = this._binders || [];
        binders.forEach(function (v) {
            _this._binders.push(v);
        });
    };
    var old$onRemoveFromStage = eui.Component.prototype.$onRemoveFromStage;
    eui.Component.prototype["$onRemoveFromStage"] = function () {
        if (this._binders) {
            this._binders.forEach(function (v) { return v.dispose(); });
            this._binders.length = 0;
        }
        old$onRemoveFromStage.call(this);
    };
})(eui || (eui = {}));
var editor;
(function (editor) {
    var TextInputBinder = /** @class */ (function (_super) {
        __extends(TextInputBinder, _super);
        function TextInputBinder() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 是否可编辑
             */
            _this.editable = true;
            /**
             * 绑定属性值转换为文本
             */
            _this.toText = function (v) { return v; };
            /**
             * 文本转换为绑定属性值
             */
            _this.toValue = function (v) { return v; };
            return _this;
        }
        TextInputBinder.prototype.init = function (v) {
            Object.assign(this, v);
            //
            this.initView();
            this.updateView();
            //
            return this;
        };
        TextInputBinder.prototype.dispose = function () {
            feng3d.watcher.unwatch(this.space, this.attribute, this.onValueChanged, this);
            //
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.textInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.textInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        TextInputBinder.prototype.initView = function () {
            //
            feng3d.watcher.watch(this.space, this.attribute, this.onValueChanged, this);
            if (this.editable) {
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.textInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.textInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.textInput.enabled = this.editable;
        };
        TextInputBinder.prototype.onValueChanged = function () {
            var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this.space;
            objectViewEvent.attributeName = this.attribute;
            objectViewEvent.attributeValue = this.space[this.attribute];
            this.textInput.dispatchEvent(objectViewEvent);
            this.dispatch("valueChanged");
            this.updateView();
        };
        TextInputBinder.prototype.updateView = function () {
            if (!this._textfocusintxt) {
                this.textInput.text = this.toText.call(this, this.space[this.attribute]);
            }
        };
        TextInputBinder.prototype.onTextChange = function () {
            this.space[this.attribute] = this.toValue.call(this, this.textInput.text);
        };
        TextInputBinder.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        TextInputBinder.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.updateView();
        };
        return TextInputBinder;
    }(feng3d.EventDispatcher));
    editor.TextInputBinder = TextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var NumberTextInputBinder = /** @class */ (function (_super) {
        __extends(NumberTextInputBinder, _super);
        function NumberTextInputBinder() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 步长，精度
             */
            _this.step = 0.001;
            /**
             * 键盘上下方向键步长
             */
            _this.stepDownup = 0.001;
            /**
             * 移动一个像素时增加的步长数量
             */
            _this.stepScale = 1;
            /**
             * 最小值
             */
            _this.minValue = NaN;
            /**
             * 最小值
             */
            _this.maxValue = NaN;
            _this.toText = function (v) {
                // 消除数字显示为类似 0.0000000001 的问题
                var fractionDigits = 1;
                while (fractionDigits * this.step < 1) {
                    fractionDigits *= 10;
                }
                var text = String(Math.round(fractionDigits * (Math.round(v / this.step) * this.step)) / fractionDigits);
                return text;
            };
            _this.toValue = function (v) {
                var n = Number(v) || 0;
                return n;
            };
            _this.mouseDownPosition = new feng3d.Vector2();
            _this.mouseDownValue = 0;
            return _this;
        }
        NumberTextInputBinder.prototype.initView = function () {
            _super.prototype.initView.call(this);
            if (this.editable) {
                // feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
                this.controller && this.controller.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            }
        };
        NumberTextInputBinder.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            // feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            this.controller && this.controller.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        };
        NumberTextInputBinder.prototype.onValueChanged = function () {
            var value = this.space[this.attribute];
            if (!isNaN(this.minValue)) {
                value = Math.max(this.minValue, value);
            }
            if (!isNaN(this.maxValue)) {
                value = Math.min(this.maxValue, value);
            }
            this.space[this.attribute] = value;
            _super.prototype.onValueChanged.call(this);
        };
        NumberTextInputBinder.prototype.onMouseDown = function (e) {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            //
            this.mouseDownPosition = mousePos;
            this.mouseDownValue = this.space[this.attribute];
            //
            feng3d.windowEventProxy.on("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onStageMouseUp, this);
        };
        NumberTextInputBinder.prototype.onStageMouseMove = function () {
            this.space[this.attribute] = this.mouseDownValue + ((feng3d.windowEventProxy.clientX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - feng3d.windowEventProxy.clientY)) * this.step * this.stepScale;
        };
        NumberTextInputBinder.prototype.onStageMouseUp = function () {
            feng3d.windowEventProxy.off("mousemove", this.onStageMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onStageMouseUp, this);
        };
        NumberTextInputBinder.prototype.ontxtfocusin = function () {
            _super.prototype.ontxtfocusin.call(this);
            feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
        };
        NumberTextInputBinder.prototype.ontxtfocusout = function () {
            _super.prototype.ontxtfocusout.call(this);
            feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
        };
        NumberTextInputBinder.prototype.onWindowKeyDown = function (event) {
            if (event.key == "ArrowUp") {
                this.space[this.attribute] += this.step;
            }
            else if (event.key == "ArrowDown") {
                this.space[this.attribute] -= this.step;
            }
        };
        return NumberTextInputBinder;
    }(editor.TextInputBinder));
    editor.NumberTextInputBinder = NumberTextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var NumberSliderTextInputBinder = /** @class */ (function (_super) {
        __extends(NumberSliderTextInputBinder, _super);
        function NumberSliderTextInputBinder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NumberSliderTextInputBinder.prototype.initView = function () {
            _super.prototype.initView.call(this);
            if (this.editable) {
                this.slider.addEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
            }
            this.slider.enabled = this.slider.touchEnabled = this.slider.touchChildren = this.editable;
        };
        NumberSliderTextInputBinder.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.slider.removeEventListener(egret.Event.CHANGE, this._onSliderChanged, this);
        };
        NumberSliderTextInputBinder.prototype.updateView = function () {
            _super.prototype.updateView.call(this);
            this.slider.minimum = isNaN(this.minValue) ? Number.MIN_VALUE : this.minValue;
            this.slider.maximum = isNaN(this.maxValue) ? Number.MAX_VALUE : this.maxValue;
            this.slider.snapInterval = this.step;
            this.slider.value = this.space[this.attribute];
        };
        NumberSliderTextInputBinder.prototype._onSliderChanged = function () {
            this.space[this.attribute] = this.slider.value;
        };
        return NumberSliderTextInputBinder;
    }(editor.NumberTextInputBinder));
    editor.NumberSliderTextInputBinder = NumberSliderTextInputBinder;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var TerrainView = /** @class */ (function (_super) {
        __extends(TerrainView, _super);
        function TerrainView() {
            var _this = _super.call(this) || this;
            _this.skinName = "TerrainView";
            return _this;
        }
        TerrainView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.updateView();
        };
        TerrainView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
        };
        TerrainView.prototype.updateView = function () {
            if (!this.stage)
                return;
        };
        return TerrainView;
    }(eui.Component));
    editor.TerrainView = TerrainView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OVTerrain = /** @class */ (function (_super) {
        __extends(OVTerrain, _super);
        function OVTerrain(objectViewInfo) {
            var _this = _super.call(this) || this;
            _this._objectViewInfo = objectViewInfo;
            _this.space = objectViewInfo.owner;
            return _this;
        }
        OVTerrain.prototype.getAttributeView = function (attributeName) {
            return null;
        };
        OVTerrain.prototype.getblockView = function (blockName) {
            return null;
        };
        OVTerrain = __decorate([
            feng3d.OVComponent()
        ], OVTerrain);
        return OVTerrain;
    }(editor.TerrainView));
    editor.OVTerrain = OVTerrain;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认基础对象界面
     */
    var OVBaseDefault = /** @class */ (function (_super) {
        __extends(OVBaseDefault, _super);
        function OVBaseDefault(objectViewInfo) {
            var _this = _super.call(this) || this;
            _this._space = objectViewInfo.owner;
            _this.skinName = "OVBaseDefault";
            return _this;
        }
        OVBaseDefault.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.updateView();
        };
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
    }(eui.Component));
    editor.OVBaseDefault = OVBaseDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认使用块的对象界面
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
            _this.skinName = "OVDefault";
            return _this;
        }
        OVDefault.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            //
            this.initview();
            this.updateView();
        };
        OVDefault.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.dispose();
        };
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
            if (!this.blockViews)
                return;
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
            if (!this.stage)
                return;
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
    }(eui.Component));
    editor.OVDefault = OVDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OVTransform = /** @class */ (function (_super) {
        __extends(OVTransform, _super);
        function OVTransform(objectViewInfo) {
            var _this = _super.call(this) || this;
            _this._objectViewInfo = objectViewInfo;
            _this._space = objectViewInfo.owner;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "OVTransform";
            return _this;
        }
        OVTransform.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
            this.updateView();
        };
        OVTransform.prototype.onAddedToStage = function () {
            var _this = this;
            this._space.on("transformChanged", this.updateView, this);
            //
            this.updateView();
            [this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach(function (item) {
                _this.addItemEventListener(item);
            });
        };
        OVTransform.prototype.onRemovedFromStage = function () {
            var _this = this;
            this._space.off("transformChanged", this.updateView, this);
            //
            [this.xTextInput, this.yTextInput, this.zTextInput, this.rxTextInput, this.ryTextInput, this.rzTextInput, this.sxTextInput, this.syTextInput, this.szTextInput,].forEach(function (item) {
                _this.removeItemEventListener(item);
            });
        };
        OVTransform.prototype.addItemEventListener = function (input) {
            input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        OVTransform.prototype.removeItemEventListener = function (input) {
            input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
        };
        OVTransform.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OVTransform.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.updateView();
        };
        OVTransform.prototype.onTextChange = function (event) {
            if (!this._textfocusintxt)
                return;
            var transfrom = this.space;
            var value = 0;
            if (event.currentTarget.text != undefined) {
                value = Number(event.currentTarget.text);
                value = isNaN(value) ? 0 : value;
            }
            switch (event.currentTarget) {
                case this.xTextInput:
                    transfrom.x = value;
                    break;
                case this.yTextInput:
                    transfrom.y = value;
                    break;
                case this.zTextInput:
                    transfrom.z = value;
                    break;
                case this.rxTextInput:
                    transfrom.rx = value;
                    break;
                case this.ryTextInput:
                    transfrom.ry = value;
                    break;
                case this.rzTextInput:
                    transfrom.rz = value;
                    break;
                case this.sxTextInput:
                    transfrom.sx = value ? value : 1;
                    break;
                case this.syTextInput:
                    transfrom.sy = value ? value : 1;
                    break;
                case this.szTextInput:
                    transfrom.sz = value ? value : 1;
                    break;
            }
        };
        Object.defineProperty(OVTransform.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                if (this._space)
                    this._space.off("transformChanged", this.updateView, this);
                this._space = value;
                if (this._space)
                    this._space.on("transformChanged", this.updateView, this);
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        OVTransform.prototype.getAttributeView = function (attributeName) {
            return null;
        };
        OVTransform.prototype.getblockView = function (blockName) {
            return null;
        };
        /**
         * 更新界面
         */
        OVTransform.prototype.updateView = function () {
            if (this._textfocusintxt)
                return;
            var transfrom = this.space;
            if (!transfrom)
                return;
            this.xTextInput.text = "" + transfrom.x;
            this.yTextInput.text = "" + transfrom.y;
            this.zTextInput.text = "" + transfrom.z;
            this.rxTextInput.text = "" + transfrom.rx;
            this.ryTextInput.text = "" + transfrom.ry;
            this.rzTextInput.text = "" + transfrom.rz;
            this.sxTextInput.text = "" + transfrom.sx;
            this.syTextInput.text = "" + transfrom.sy;
            this.szTextInput.text = "" + transfrom.sz;
        };
        OVTransform = __decorate([
            feng3d.OVComponent()
        ], OVTransform);
        return OVTransform;
    }(eui.Component));
    editor.OVTransform = OVTransform;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性块界面
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
            _this.skinName = "OBVDefault";
            return _this;
        }
        OBVDefault.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.initView();
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
        };
        OBVDefault.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.dispose();
        };
        OBVDefault.prototype.initView = function () {
            if (this._blockName != null && this._blockName.length > 0) {
                this.addChildAt(this.border, 0);
                this.group.addChildAt(this.titleGroup, 0);
            }
            else {
                this.removeChild(this.border);
                this.group.removeChild(this.titleGroup);
            }
            this.attributeViews = [];
            var objectAttributeInfos = this.itemList;
            for (var i = 0; i < objectAttributeInfos.length; i++) {
                var displayObject = feng3d.objectview.getAttributeView(objectAttributeInfos[i]);
                displayObject.percentWidth = 100;
                displayObject.objectView = this.objectView;
                displayObject.objectBlockView = this;
                this.contentGroup.addChild(displayObject);
                this.attributeViews.push(displayObject);
            }
        };
        OBVDefault.prototype.dispose = function () {
            for (var i = 0; i < this.attributeViews.length; i++) {
                var displayObject = this.attributeViews[i];
                displayObject.objectView = null;
                displayObject.objectBlockView = null;
                this.contentGroup.removeChild(displayObject);
            }
            this.attributeViews.length = 0;
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
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        };
        OBVDefault = __decorate([
            feng3d.OBVComponent()
        ], OBVDefault);
        return OBVDefault;
    }(eui.Component));
    editor.OBVDefault = OBVDefault;
})(editor || (editor = {}));
var feng3d;
(function (feng3d) {
    var ObjectViewEvent = /** @class */ (function (_super) {
        __extends(ObjectViewEvent, _super);
        function ObjectViewEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObjectViewEvent.VALUE_CHANGE = "valuechange";
        return ObjectViewEvent;
    }(egret.Event));
    feng3d.ObjectViewEvent = ObjectViewEvent;
})(feng3d || (feng3d = {}));
var editor;
(function (editor) {
    var OAVBase = /** @class */ (function (_super) {
        __extends(OAVBase, _super);
        function OAVBase(attributeViewInfo) {
            var _this = _super.call(this) || this;
            // 占用，避免出现label命名的组件
            _this.label = "";
            _this._space = attributeViewInfo.owner;
            _this._attributeName = attributeViewInfo.name;
            _this._attributeType = attributeViewInfo.type;
            _this._attributeViewInfo = attributeViewInfo;
            if (!_this._attributeViewInfo.editable)
                _this.alpha = 0.8;
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
        OAVBase.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var componentParam = this._attributeViewInfo.componentParam;
            if (componentParam) {
                for (var key in componentParam) {
                    if (componentParam.hasOwnProperty(key)) {
                        this[key] = componentParam[key];
                    }
                }
            }
            if (this.labelLab) {
                if (this.label)
                    this.labelLab.text = this.label;
                else
                    this.labelLab.text = this._attributeName;
            }
            if (this._attributeViewInfo.tooltip)
                editor.toolTip.register(this.labelLab, this._attributeViewInfo.tooltip);
            this.initView();
            this.updateView();
        };
        OAVBase.prototype.$onRemoveFromStage = function () {
            editor.toolTip.unregister(this.labelLab);
            _super.prototype.$onRemoveFromStage.call(this);
            this.dispose();
        };
        /**
         * 初始化
         */
        OAVBase.prototype.initView = function () {
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
                    var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
                    objectViewEvent.space = this._space;
                    objectViewEvent.attributeName = this._attributeName;
                    objectViewEvent.attributeValue = this.attributeValue;
                    this.dispatchEvent(objectViewEvent);
                }
                this.once(egret.Event.ENTER_FRAME, this.updateView, this);
            },
            enumerable: true,
            configurable: true
        });
        return OAVBase;
    }(eui.Component));
    editor.OAVBase = OAVBase;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    var OAVDefault = /** @class */ (function (_super) {
        __extends(OAVDefault, _super);
        function OAVDefault(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVDefault";
            return _this;
        }
        Object.defineProperty(OAVDefault.prototype, "dragparam", {
            set: function (param) {
                var _this = this;
                if (param) {
                    //
                    editor.drag.register(this, function (dragsource) {
                        if (param.datatype)
                            dragsource[param.datatype] = _this.attributeValue;
                    }, [param.accepttype], function (dragSource) {
                        _this.attributeValue = dragSource[param.accepttype];
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        OAVDefault.prototype.initView = function () {
            this.text.percentWidth = 100;
            this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            if (this._attributeViewInfo.editable)
                feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVDefault.prototype.dispose = function () {
            editor.drag.unregister(this);
            if (this._attributeViewInfo.editable)
                feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
            this.text.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.text.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.text.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
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
            this.text.enabled = this._attributeViewInfo.editable;
            var value = this.attributeValue;
            if (value === undefined) {
                this.text.text = String(value);
            }
            else if (!(value instanceof Object)) {
                this.text.text = String(value);
            }
            else {
                var valuename = value["name"] || "";
                this.text.text = valuename + " (" + value.constructor.name + ")";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
                this.text.enabled = false;
            }
        };
        OAVDefault.prototype.onDoubleClick = function () {
            editor.editorui.inspectorView.showData(this.attributeValue);
        };
        OAVDefault.prototype.onTextChange = function () {
            if (this._textfocusintxt) {
                switch (this._attributeType) {
                    case "String":
                        this.attributeValue = this.text.text;
                        break;
                    case "number":
                        var num = Number(this.text.text);
                        num = isNaN(num) ? 0 : num;
                        this.attributeValue = num;
                        break;
                    case "Boolean":
                        this.attributeValue = Boolean(this.text.text);
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
    }(editor.OAVBase));
    editor.OAVDefault = OAVDefault;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVBoolean = /** @class */ (function (_super) {
        __extends(OAVBoolean, _super);
        function OAVBoolean(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "BooleanAttrViewSkin";
            return _this;
        }
        OAVBoolean.prototype.initView = function () {
            if (this._attributeViewInfo.editable)
                this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.checkBox.enabled = this._attributeViewInfo.editable;
        };
        OAVBoolean.prototype.dispose = function () {
            this.checkBox.removeEventListener(egret.Event.CHANGE, this.onChange, this);
        };
        OAVBoolean.prototype.updateView = function () {
            this.checkBox.selected = this.attributeValue;
        };
        OAVBoolean.prototype.onChange = function (event) {
            this.attributeValue = this.checkBox.selected;
        };
        OAVBoolean = __decorate([
            feng3d.OAVComponent()
        ], OAVBoolean);
        return OAVBoolean;
    }(editor.OAVBase));
    editor.OAVBoolean = OAVBoolean;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    var OAVNumber = /** @class */ (function (_super) {
        __extends(OAVNumber, _super);
        function OAVNumber(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVNumber";
            return _this;
        }
        OAVNumber.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.addBinder(new editor.NumberTextInputBinder().init({
                space: this.space, attribute: this._attributeName, textInput: this.text, editable: this._attributeViewInfo.editable,
                controller: this.labelLab,
            }));
        };
        OAVNumber = __decorate([
            feng3d.OAVComponent()
        ], OAVNumber);
        return OAVNumber;
    }(editor.OAVBase));
    editor.OAVNumber = OAVNumber;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVString = /** @class */ (function (_super) {
        __extends(OAVString, _super);
        function OAVString(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVString";
            return _this;
        }
        OAVString.prototype.initView = function () {
            this.addBinder(new editor.TextInputBinder().init({ space: this.space, attribute: this._attributeName, textInput: this.txtInput, editable: this._attributeViewInfo.editable, }));
        };
        OAVString = __decorate([
            feng3d.OAVComponent()
        ], OAVString);
        return OAVString;
    }(editor.OAVBase));
    editor.OAVString = OAVString;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 默认对象属性界面
     */
    var OAVMultiText = /** @class */ (function (_super) {
        __extends(OAVMultiText, _super);
        function OAVMultiText(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMultiText";
            return _this;
        }
        OAVMultiText.prototype.initView = function () {
            feng3d.watcher.watch(this.space, this._attributeName, this.updateView, this);
        };
        OAVMultiText.prototype.dispose = function () {
            feng3d.watcher.unwatch(this.space, this._attributeName, this.updateView, this);
        };
        OAVMultiText.prototype.updateView = function () {
            this.txtLab.text = this.attributeValue;
        };
        OAVMultiText = __decorate([
            feng3d.OAVComponent()
        ], OAVMultiText);
        return OAVMultiText;
    }(editor.OAVBase));
    editor.OAVMultiText = OAVMultiText;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVVector3D = /** @class */ (function (_super) {
        __extends(OAVVector3D, _super);
        function OAVVector3D(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVVector3DSkin";
            return _this;
        }
        OAVVector3D.prototype.initView = function () {
            this.vector3DView.vm = this.attributeValue;
            eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
        };
        OAVVector3D.prototype.dispose = function () {
            // this.vector3DView.vm = <any>this.attributeValue;
            // eui.Binding.bindProperty(this, ["_space", this._attributeName], this.vector3DView, "vm");
        };
        OAVVector3D = __decorate([
            feng3d.OAVComponent()
        ], OAVVector3D);
        return OAVVector3D;
    }(editor.OAVBase));
    editor.OAVVector3D = OAVVector3D;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVArray = /** @class */ (function (_super) {
        __extends(OAVArray, _super);
        function OAVArray(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVArray";
            return _this;
        }
        Object.defineProperty(OAVArray.prototype, "space", {
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
        Object.defineProperty(OAVArray.prototype, "attributeName", {
            get: function () {
                return this._attributeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVArray.prototype, "attributeValue", {
            get: function () {
                return this._space[this._attributeName];
            },
            set: function (value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        OAVArray.prototype.initView = function () {
            this.attributeViews = [];
            var attributeValue = this.attributeValue;
            this.sizeTxt.text = this.attributeValue.length.toString();
            for (var i = 0; i < attributeValue.length; i++) {
                var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                displayObject.percentWidth = 100;
                this.contentGroup.addChild(displayObject);
                this.attributeViews[i] = displayObject;
            }
            this.currentState = "hide";
            this.titleButton.addEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.sizeTxt.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
        };
        OAVArray.prototype.dispose = function () {
            this.titleButton.removeEventListener(egret.MouseEvent.CLICK, this.onTitleButtonClick, this);
            this.sizeTxt.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onsizeTxtfocusout, this);
            this.attributeViews = [];
            for (var i = 0; i < this.attributeViews.length; i++) {
                var displayObject = this.attributeViews[i];
                this.contentGroup.removeChild(displayObject);
            }
            this.attributeViews = null;
        };
        OAVArray.prototype.onTitleButtonClick = function () {
            this.currentState = this.currentState == "hide" ? "show" : "hide";
        };
        OAVArray.prototype.onsizeTxtfocusout = function () {
            var size = parseInt(this.sizeTxt.text);
            var attributeValue = this.attributeValue;
            var attributeViews = this.attributeViews;
            if (size != attributeValue.length) {
                for (var i = 0; i < attributeViews.length; i++) {
                    if (attributeViews[i].parent) {
                        attributeViews[i].parent.removeChild(attributeViews[i]);
                    }
                }
                attributeValue.length = size;
                for (var i = 0; i < size; i++) {
                    if (attributeValue[i] == null && this._attributeViewInfo.componentParam)
                        attributeValue[i] = feng3d.lazy.getvalue(this._attributeViewInfo.componentParam.defaultItem);
                    if (attributeViews[i] == null) {
                        var displayObject = new OAVArrayItem(attributeValue, i, this._attributeViewInfo.componentParam);
                        attributeViews[i] = displayObject;
                        displayObject.percentWidth = 100;
                    }
                    this.contentGroup.addChild(attributeViews[i]);
                }
            }
        };
        OAVArray = __decorate([
            feng3d.OAVComponent()
        ], OAVArray);
        return OAVArray;
    }(editor.OAVBase));
    editor.OAVArray = OAVArray;
    var OAVArrayItem = /** @class */ (function (_super) {
        __extends(OAVArrayItem, _super);
        function OAVArrayItem(arr, index, componentParam) {
            var _this = this;
            var attributeViewInfo = {
                name: index + "",
                editable: true,
                componentParam: componentParam,
                owner: arr,
                type: "number",
            };
            _this = _super.call(this, attributeViewInfo) || this;
            return _this;
        }
        OAVArrayItem.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.labelLab.width = 60;
        };
        return OAVArrayItem;
    }(editor.OAVDefault));
    editor.OAVArrayItem = OAVArrayItem;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVEnum = /** @class */ (function (_super) {
        __extends(OAVEnum, _super);
        function OAVEnum(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVEnum";
            return _this;
        }
        Object.defineProperty(OAVEnum.prototype, "enumClass", {
            set: function (obj) {
                this.list = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (isNaN(Number(key)))
                            this.list.push({ label: key, value: obj[key] });
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        OAVEnum.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
            }
            this.combobox.touchEnabled = this.combobox.touchChildren = this._attributeViewInfo.editable;
        };
        OAVEnum.prototype.dispose = function () {
            this.combobox.removeEventListener(egret.Event.CHANGE, this.onComboxChange, this);
        };
        OAVEnum.prototype.updateView = function () {
            var _this = this;
            this.combobox.dataProvider = this.list;
            if (this.list) {
                this.combobox.data = this.list.reduce(function (prevalue, item) {
                    if (prevalue)
                        return prevalue;
                    if (item.value == _this.attributeValue)
                        return item;
                    return null;
                }, null);
            }
        };
        OAVEnum.prototype.onComboxChange = function () {
            this.attributeValue = this.combobox.data.value;
        };
        OAVEnum = __decorate([
            feng3d.OAVComponent()
        ], OAVEnum);
        return OAVEnum;
    }(editor.OAVBase));
    editor.OAVEnum = OAVEnum;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVImage = /** @class */ (function (_super) {
        __extends(OAVImage, _super);
        function OAVImage(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVImage";
            _this.alpha = 1;
            return _this;
        }
        OAVImage.prototype.initView = function () {
            var texture = this.space;
            this.image.source = texture.dataURL;
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        OAVImage.prototype.dispose = function () {
        };
        OAVImage.prototype.updateView = function () {
        };
        OAVImage.prototype.onResize = function () {
            this.image.width = this.width;
            this.image.height = this.width;
            this.height = this.width;
        };
        OAVImage = __decorate([
            feng3d.OAVComponent()
        ], OAVImage);
        return OAVImage;
    }(editor.OAVBase));
    editor.OAVImage = OAVImage;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVCubeMap = /** @class */ (function (_super) {
        __extends(OAVCubeMap, _super);
        function OAVCubeMap(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVCubeMap";
            _this.alpha = 1;
            return _this;
        }
        OAVCubeMap.prototype.initView = function () {
            this.images = [this.px, this.py, this.pz, this.nx, this.ny, this.nz];
            this.btns = [this.pxBtn, this.pyBtn, this.pzBtn, this.nxBtn, this.nyBtn, this.nzBtn];
            // var param: { accepttype: keyof DragData; datatype?: string; } = { accepttype: "image" };
            for (var i = 0; i < propertys.length; i++) {
                this.updateImage(i);
                // drag.register(image,
                // 	(dragsource) => { },
                // 	[param.accepttype],
                // 	(dragSource) =>
                // 	{
                // 		this.attributeValue = dragSource[param.accepttype];
                // 	});
                this.btns[i].addEventListener(egret.MouseEvent.CLICK, this.onImageClick, this);
                this.btns[i].enabled = this._attributeViewInfo.editable;
                // this.btns[i].touchChildren = this.btns[i].touchEnabled = this._attributeViewInfo.editable;
            }
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        OAVCubeMap.prototype.updateImage = function (i) {
            var textureCube = this.space;
            var imagePath = textureCube[propertys[i]];
            var image = this.images[i];
            if (imagePath) {
                editor.editorFS.fs.readArrayBuffer(imagePath, function (err, data) {
                    feng3d.dataTransform.arrayBufferToDataURL(data, function (dataurl) {
                        image.source = dataurl;
                    });
                });
            }
            else {
                image.source = null;
            }
        };
        OAVCubeMap.prototype.onImageClick = function (e) {
            var _this = this;
            var index = this.btns.indexOf(e.currentTarget);
            if (index != -1) {
                var textureCube = this.space;
                var texture2ds = feng3d.Feng3dAssets.getAssetsByType(feng3d.UrlImageTexture2D);
                var menus = [{
                        label: "None", click: function () {
                            textureCube[propertys[index]] = "";
                            _this.updateImage(index);
                            _this.dispatchValueChange(index);
                        }
                    }];
                texture2ds.forEach(function (d) {
                    menus.push({
                        label: d.name, click: function () {
                            textureCube[propertys[index]] = d.url;
                            _this.updateImage(index);
                            _this.dispatchValueChange(index);
                        }
                    });
                });
                editor.menu.popup(menus);
            }
        };
        OAVCubeMap.prototype.dispatchValueChange = function (index) {
            var objectViewEvent = new feng3d.ObjectViewEvent(feng3d.ObjectViewEvent.VALUE_CHANGE, true);
            objectViewEvent.space = this._space;
            objectViewEvent.attributeName = propertys[index];
            this.dispatchEvent(objectViewEvent);
        };
        OAVCubeMap.prototype.dispose = function () {
        };
        OAVCubeMap.prototype.updateView = function () {
        };
        OAVCubeMap.prototype.onResize = function () {
            var w4 = Math.round(this.width / 4);
            this.px.width = this.py.width = this.pz.width = this.nx.width = this.ny.width = this.nz.width = w4;
            this.px.height = this.py.height = this.pz.height = this.nx.height = this.ny.height = this.nz.height = w4;
            //
            this.pxGroup.width = this.pyGroup.width = this.pzGroup.width = this.nxGroup.width = this.nyGroup.width = this.nzGroup.width = w4;
            this.pxGroup.height = this.pyGroup.height = this.pzGroup.height = this.nxGroup.height = this.nyGroup.height = this.nzGroup.height = w4;
            //
            this.pxGroup.x = w4 * 2;
            this.pxGroup.y = w4;
            //
            this.pyGroup.x = w4;
            //
            this.pzGroup.x = w4;
            this.pzGroup.y = w4;
            //
            this.nxGroup.y = w4;
            //
            this.nyGroup.x = w4;
            this.nyGroup.y = w4 * 2;
            //
            this.nzGroup.x = w4 * 3;
            this.nzGroup.y = w4;
            //
            this.height = w4 * 3;
        };
        OAVCubeMap = __decorate([
            feng3d.OAVComponent()
        ], OAVCubeMap);
        return OAVCubeMap;
    }(editor.OAVBase));
    editor.OAVCubeMap = OAVCubeMap;
    var propertys = ["positive_x_url", "positive_y_url", "positive_z_url", "negative_x_url", "negative_y_url", "negative_z_url"];
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVComponentList = /** @class */ (function (_super) {
        __extends(OAVComponentList, _super);
        function OAVComponentList(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVComponentListSkin";
            return _this;
        }
        OAVComponentList.prototype.onAddComponentButtonClick = function () {
            editor.menu.popup(editor.getCreateComponentMenu(this.space));
        };
        Object.defineProperty(OAVComponentList.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
                this.dispose();
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVComponentList.prototype, "attributeName", {
            get: function () {
                return this._attributeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVComponentList.prototype, "attributeValue", {
            get: function () {
                return this._space[this._attributeName];
            },
            set: function (value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        OAVComponentList.prototype.initView = function () {
            var _this = this;
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
            this.space.on("addComponent", this.onAddCompont, this);
            this.space.on("removeComponent", this.onRemoveComponent, this);
            editor.drag.register(this.addComponentButton, null, ["file_script"], function (dragdata) {
                if (dragdata.file_script) {
                    _this.space.addScript(dragdata.file_script.scriptName);
                }
            });
            this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
            this.space.off("addComponent", this.onAddCompont, this);
            this.space.off("removeComponent", this.onRemoveComponent, this);
            editor.drag.unregister(this.addComponentButton);
            this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.addComponentView = function (component) {
            if (component.hideFlags & feng3d.HideFlags.HideInInspector)
                return;
            var displayObject = new editor.ComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        };
        /**
         * 更新界面
         */
        OAVComponentList.prototype.updateView = function () {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof editor.ComponentView)
                    child.updateView();
            }
        };
        OAVComponentList.prototype.removedComponentView = function (component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof editor.ComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        };
        OAVComponentList.prototype.onAddCompont = function (event) {
            if (event.data.gameObject == this.space)
                this.addComponentView(event.data);
        };
        OAVComponentList.prototype.onRemoveComponent = function (event) {
            if (event.data.gameObject == this.space)
                this.removedComponentView(event.data);
        };
        OAVComponentList = __decorate([
            feng3d.OAVComponent()
        ], OAVComponentList);
        return OAVComponentList;
    }(editor.OAVBase));
    editor.OAVComponentList = OAVComponentList;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVFunction = /** @class */ (function (_super) {
        __extends(OAVFunction, _super);
        function OAVFunction(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVFunction";
            return _this;
        }
        OAVFunction.prototype.initView = function () {
            this.button.addEventListener(egret.MouseEvent.CLICK, this.click, this);
        };
        OAVFunction.prototype.dispose = function () {
            this.button.removeEventListener(egret.MouseEvent.CLICK, this.click, this);
        };
        OAVFunction.prototype.updateView = function () {
        };
        OAVFunction.prototype.click = function (event) {
            this._space[this._attributeName]();
        };
        OAVFunction = __decorate([
            feng3d.OAVComponent()
        ], OAVFunction);
        return OAVFunction;
    }(editor.OAVBase));
    editor.OAVFunction = OAVFunction;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVColorPicker = /** @class */ (function (_super) {
        __extends(OAVColorPicker, _super);
        function OAVColorPicker(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVColorPicker";
            return _this;
        }
        OAVColorPicker.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
                this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
                this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            }
            this.colorPicker.touchEnabled = this.colorPicker.touchChildren = this.input.enabled = this._attributeViewInfo.editable;
        };
        OAVColorPicker.prototype.dispose = function () {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVColorPicker.prototype.updateView = function () {
            var color = this.attributeValue;
            this.colorPicker.value = color;
            this.input.text = color.toHexString();
        };
        OAVColorPicker.prototype.onChange = function (event) {
            //
            this.attributeValue = this.colorPicker.value.clone();
            this.input.text = this.attributeValue.toHexString();
        };
        OAVColorPicker.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OAVColorPicker.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
            this.input.text = this.attributeValue.toHexString();
        };
        OAVColorPicker.prototype.onTextChange = function () {
            if (this._textfocusintxt) {
                var text = this.input.text;
                if (this.attributeValue instanceof feng3d.Color3) {
                    this.colorPicker.value = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color3().fromUnit(Number("0x" + text.substr(1)));
                }
                else {
                    this.colorPicker.value = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                    this.attributeValue = new feng3d.Color4().fromUnit(Number("0x" + text.substr(1)));
                }
            }
        };
        OAVColorPicker = __decorate([
            feng3d.OAVComponent()
        ], OAVColorPicker);
        return OAVColorPicker;
    }(editor.OAVBase));
    editor.OAVColorPicker = OAVColorPicker;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVMaterialName = /** @class */ (function (_super) {
        __extends(OAVMaterialName, _super);
        function OAVMaterialName(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OVMaterial";
            return _this;
        }
        OAVMaterialName.prototype.initView = function () {
            this.shaderComboBox.addEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.feng3dDispatcher.on("assets.shaderChanged", this.onShaderComboBoxChange, this);
            this.shaderComboBox.touchChildren = this.shaderComboBox.touchEnabled = this._attributeViewInfo.editable;
        };
        OAVMaterialName.prototype.dispose = function () {
            this.shaderComboBox.removeEventListener(egret.Event.CHANGE, this.onShaderComboBoxChange, this);
            feng3d.feng3dDispatcher.off("assets.shaderChanged", this.onShaderComboBoxChange, this);
        };
        OAVMaterialName.prototype.updateView = function () {
            var material = this.space;
            this.nameLabel.text = material.shaderName;
            var data = feng3d.shaderlib.getShaderNames().sort().map(function (v) { return { label: v, value: v }; });
            var selected = data.reduce(function (prevalue, item) {
                if (prevalue)
                    return prevalue;
                if (item.value == material.shaderName)
                    return item;
                return null;
            }, null);
            this.shaderComboBox.dataProvider = data;
            this.shaderComboBox.data = selected;
        };
        OAVMaterialName.prototype.onShaderComboBoxChange = function () {
            this.attributeValue = this.shaderComboBox.data.value;
            this.objectView.space = this.space;
        };
        OAVMaterialName = __decorate([
            feng3d.OAVComponent()
        ], OAVMaterialName);
        return OAVMaterialName;
    }(editor.OAVBase));
    editor.OAVMaterialName = OAVMaterialName;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVObjectView = /** @class */ (function (_super) {
        __extends(OAVObjectView, _super);
        function OAVObjectView(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OVDefault";
            return _this;
        }
        OAVObjectView.prototype.initView = function () {
            var _this = this;
            var arr = [];
            if (this.attributeValue instanceof Array)
                arr = this.attributeValue;
            else
                arr.push(this.attributeValue);
            this.views = [];
            arr.forEach(function (element) {
                var editable = _this._attributeViewInfo.editable;
                if (element instanceof feng3d.Feng3dObject)
                    editable = editable && !Boolean(element.hideFlags & feng3d.HideFlags.NotEditable);
                var view = feng3d.objectview.getObjectView(element, { editable: editable });
                view.percentWidth = 100;
                _this.group.addChild(view);
                _this.views.push(view);
                if (element instanceof feng3d.EventDispatcher) {
                    element.on("refreshView", _this.onRefreshView, _this);
                }
            });
        };
        OAVObjectView.prototype.updateView = function () {
        };
        /**
         * 销毁
         */
        OAVObjectView.prototype.dispose = function () {
            var _this = this;
            this.views.forEach(function (element) {
                _this.group.removeChild(element);
                if (element.space instanceof feng3d.EventDispatcher) {
                    element.space.on("refreshView", _this.onRefreshView, _this);
                }
            });
            this.views.length = 0;
        };
        OAVObjectView.prototype.onRefreshView = function (event) {
            this.dispose();
            this.initView();
        };
        OAVObjectView = __decorate([
            feng3d.OAVComponent()
        ], OAVObjectView);
        return OAVObjectView;
    }(editor.OAVBase));
    editor.OAVObjectView = OAVObjectView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVAccordionObjectView = /** @class */ (function (_super) {
        __extends(OAVAccordionObjectView, _super);
        /**
         * 对象界面数据
         */
        function OAVAccordionObjectView(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "ParticleComponentView";
            return _this;
        }
        /**
         * 更新界面
         */
        OAVAccordionObjectView.prototype.updateView = function () {
            this.updateEnableCB();
            if (this.componentView)
                this.componentView.updateView();
        };
        OAVAccordionObjectView.prototype.initView = function () {
            var componentName = feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop();
            this.accordion.titleName = componentName;
            this.componentView = feng3d.objectview.getObjectView(this.attributeValue, { autocreate: false, excludeAttrs: ["enabled"] });
            this.accordion.addContent(this.componentView);
            this.enabledCB = this.accordion["enabledCB"];
            this.enabledCB.addEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.watch(this.attributeValue, "enabled", this.updateEnableCB, this);
            this.updateView();
        };
        OAVAccordionObjectView.prototype.dispose = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            feng3d.watcher.unwatch(this.attributeValue, "enabled", this.updateEnableCB, this);
        };
        OAVAccordionObjectView.prototype.updateEnableCB = function () {
            this.enabledCB.selected = this.attributeValue.enabled;
        };
        OAVAccordionObjectView.prototype.onEnableCBChange = function () {
            this.attributeValue.enabled = this.enabledCB.selected;
        };
        OAVAccordionObjectView = __decorate([
            feng3d.OAVComponent()
        ], OAVAccordionObjectView);
        return OAVAccordionObjectView;
    }(editor.OAVBase));
    editor.OAVAccordionObjectView = OAVAccordionObjectView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVGameObjectName = /** @class */ (function (_super) {
        __extends(OAVGameObjectName, _super);
        function OAVGameObjectName(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVGameObjectName";
            return _this;
        }
        OAVGameObjectName.prototype.initView = function () {
            this.visibleCB.addEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.addEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVGameObjectName.prototype.dispose = function () {
            this.visibleCB.removeEventListener(egret.MouseEvent.CLICK, this.onVisibleCBClick, this);
            this.mouseEnabledCB.removeEventListener(egret.MouseEvent.CLICK, this.onMouseEnabledCBClick, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.nameInput.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.nameInput.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVGameObjectName.prototype.updateView = function () {
            this.visibleCB.selected = this.space.visible;
            this.mouseEnabledCB.selected = this.space.mouseEnabled;
            this.nameInput.text = this.space.name;
        };
        OAVGameObjectName.prototype.onVisibleCBClick = function () {
            this.space.visible = !this.space.visible;
        };
        OAVGameObjectName.prototype.onMouseEnabledCBClick = function () {
            this.space.mouseEnabled = !this.space.mouseEnabled;
        };
        OAVGameObjectName.prototype.ontxtfocusin = function () {
            this._textfocusintxt = true;
        };
        OAVGameObjectName.prototype.ontxtfocusout = function () {
            this._textfocusintxt = false;
        };
        OAVGameObjectName.prototype.onTextChange = function () {
            if (this._textfocusintxt) {
                this.space.name = this.nameInput.text;
            }
        };
        OAVGameObjectName = __decorate([
            feng3d.OAVComponent()
        ], OAVGameObjectName);
        return OAVGameObjectName;
    }(editor.OAVBase));
    editor.OAVGameObjectName = OAVGameObjectName;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 挑选（拾取）OAV界面
     */
    var OAVPick = /** @class */ (function (_super) {
        __extends(OAVPick, _super);
        function OAVPick(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVPick";
            return _this;
        }
        OAVPick.prototype.initView = function () {
            var _this = this;
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable) {
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
                var param = this._attributeViewInfo.componentParam;
                editor.drag.register(this, function (dragsource) {
                    if (param.datatype)
                        dragsource[param.datatype] = _this.attributeValue;
                }, [param.accepttype], function (dragSource) {
                    _this.attributeValue = dragSource[param.accepttype];
                });
            }
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVPick.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.onPickBtnClick, this);
            editor.drag.unregister(this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        };
        OAVPick.prototype.onPickBtnClick = function () {
            var _this = this;
            var param = this._attributeViewInfo.componentParam;
            if (param.accepttype) {
                if (param.accepttype == "texture2d") {
                    var menus = [];
                    var texture2ds = feng3d.Feng3dAssets.getAssetsByType(feng3d.UrlImageTexture2D);
                    texture2ds.forEach(function (item) {
                        menus.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "texturecube") {
                    var menus = [];
                    var textureCubes = feng3d.Feng3dAssets.getAssetsByType(feng3d.TextureCube);
                    textureCubes.forEach(function (item) {
                        menus.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "audio") {
                    var menus = [{ label: "None", click: function () { _this.attributeValue = ""; } }];
                    var audioFiles = editor.editorAssets.getAssetsByType(feng3d.AudioFile);
                    audioFiles.forEach(function (item) {
                        menus.push({
                            label: item.label, click: function () {
                                _this.attributeValue = feng3d.assetsIDPathMap.getPath(item.id);
                            }
                        });
                    }, []);
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "file_script") {
                    var scriptFiles = feng3d.Feng3dAssets.getAssetsByType(feng3d.ScriptFile);
                    var menus = [{ label: "None", click: function () { _this.attributeValue = null; } }];
                    scriptFiles.forEach(function (element) {
                        menus.push({
                            label: element.scriptName,
                            click: function () {
                                _this.attributeValue = element.scriptName;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "material") {
                    var materials = feng3d.Feng3dAssets.getAssetsByType(feng3d.Material);
                    var menus = [];
                    materials.forEach(function (element) {
                        menus.push({
                            label: element.name,
                            click: function () {
                                _this.attributeValue = element;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "geometry") {
                    var geometrys = feng3d.Feng3dAssets.getAssetsByType(feng3d.Geometry);
                    var menus = [];
                    geometrys.forEach(function (element) {
                        menus.push({
                            label: element.name,
                            click: function () {
                                _this.attributeValue = element;
                            }
                        });
                    });
                    editor.menu.popup(menus);
                }
            }
        };
        /**
         * 更新界面
         */
        OAVPick.prototype.updateView = function () {
            if (this.attributeValue === undefined) {
                this.text.text = String(this.attributeValue);
            }
            else if (!(this.attributeValue instanceof Object)) {
                this.text.text = String(this.attributeValue);
            }
            else {
                this.text.text = this.attributeValue["name"] || "";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
        };
        OAVPick.prototype.onDoubleClick = function () {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editor.editorui.inspectorView.showData(this.attributeValue);
        };
        OAVPick = __decorate([
            feng3d.OAVComponent()
        ], OAVPick);
        return OAVPick;
    }(editor.OAVBase));
    editor.OAVPick = OAVPick;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 挑选（拾取）OAV界面
     */
    var OAVTexture2D = /** @class */ (function (_super) {
        __extends(OAVTexture2D, _super);
        function OAVTexture2D(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVTexture2D";
            return _this;
        }
        OAVTexture2D.prototype.initView = function () {
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            if (this._attributeViewInfo.editable)
                this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVTexture2D.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        };
        OAVTexture2D.prototype.ontxtClick = function () {
            var _this = this;
            var menus = [];
            var texture2ds = feng3d.Feng3dAssets.getAssetsByType(feng3d.Texture2D);
            texture2ds.forEach(function (texture2d) {
                menus.push({
                    label: texture2d.name, click: function () {
                        _this.attributeValue = texture2d;
                        _this.once(egret.Event.ENTER_FRAME, _this.updateView, _this);
                    }
                });
            });
            editor.menu.popup(menus);
        };
        /**
         * 更新界面
         */
        OAVTexture2D.prototype.updateView = function () {
            var texture = this.attributeValue;
            this.image.source = texture.dataURL;
        };
        OAVTexture2D.prototype.onDoubleClick = function () {
            if (this.attributeValue && typeof this.attributeValue == "object")
                editor.editorui.inspectorView.showData(this.attributeValue);
        };
        OAVTexture2D = __decorate([
            feng3d.OAVComponent()
        ], OAVTexture2D);
        return OAVTexture2D;
    }(editor.OAVBase));
    editor.OAVTexture2D = OAVTexture2D;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVParticleComponentList = /** @class */ (function (_super) {
        __extends(OAVParticleComponentList, _super);
        function OAVParticleComponentList(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVParticleComponentList";
            return _this;
        }
        Object.defineProperty(OAVParticleComponentList.prototype, "space", {
            get: function () {
                return this._space;
            },
            set: function (value) {
                this._space = value;
                this.dispose();
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVParticleComponentList.prototype, "attributeName", {
            get: function () {
                return this._attributeName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OAVParticleComponentList.prototype, "attributeValue", {
            get: function () {
                return this._space[this._attributeName];
            },
            set: function (value) {
                if (this._space[this._attributeName] != value) {
                    this._space[this._attributeName] = value;
                }
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        OAVParticleComponentList.prototype.initView = function () {
            this.group.layout.gap = -1;
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.addComponentView(components[i]);
            }
        };
        OAVParticleComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
        };
        /**
         * 更新界面
         */
        OAVParticleComponentList.prototype.updateView = function () {
            for (var i = 0, n = this.group.numChildren; i < n; i++) {
                var child = this.group.getChildAt(i);
                if (child instanceof editor.ParticleComponentView)
                    child.updateView();
            }
        };
        OAVParticleComponentList.prototype.addComponentView = function (component) {
            var o;
            var displayObject = new editor.ParticleComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
        };
        OAVParticleComponentList.prototype.removedComponentView = function (component) {
            for (var i = this.group.numChildren - 1; i >= 0; i--) {
                var displayObject = this.group.getChildAt(i);
                if (displayObject instanceof editor.ParticleComponentView && displayObject.component == component) {
                    this.group.removeChild(displayObject);
                }
            }
        };
        OAVParticleComponentList = __decorate([
            feng3d.OAVComponent()
        ], OAVParticleComponentList);
        return OAVParticleComponentList;
    }(editor.OAVBase));
    editor.OAVParticleComponentList = OAVParticleComponentList;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVFeng3dPreView = /** @class */ (function (_super) {
        __extends(OAVFeng3dPreView, _super);
        function OAVFeng3dPreView(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVFeng3dPreView";
            _this.alpha = 1;
            return _this;
        }
        OAVFeng3dPreView.prototype.initView = function () {
            if (this.space instanceof feng3d.GameObject) {
                editor.feng3dScreenShot.drawGameObject(this.space);
            }
            else if (this.space instanceof feng3d.Geometry) {
                editor.feng3dScreenShot.drawGeometry(this.space);
            }
            else if (this.space instanceof feng3d.Material) {
                editor.feng3dScreenShot.drawMaterial(this.space);
            }
            this.cameraRotation = editor.feng3dScreenShot.camera.transform.rotation.clone();
            this.onResize();
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.ticker.on(100, this.onDrawObject, this);
        };
        OAVFeng3dPreView.prototype.dispose = function () {
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.ticker.off(100, this.onDrawObject, this);
        };
        OAVFeng3dPreView.prototype.onMouseDown = function () {
            this.preMousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var s = this.localToGlobal(0, 0);
            if (new feng3d.Rectangle(s.x, s.y, this.width, this.height).containsPoint(this.preMousePos)) {
                feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            }
        };
        OAVFeng3dPreView.prototype.onMouseMove = function () {
            var mousePos = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var X_AXIS = editor.feng3dScreenShot.camera.transform.rightVector;
            var Y_AXIS = editor.feng3dScreenShot.camera.transform.upVector;
            editor.feng3dScreenShot.camera.transform.rotate(X_AXIS, mousePos.y - this.preMousePos.y);
            editor.feng3dScreenShot.camera.transform.rotate(Y_AXIS, mousePos.x - this.preMousePos.x);
            this.cameraRotation = editor.feng3dScreenShot.camera.transform.rotation.clone();
            this.preMousePos = mousePos;
        };
        OAVFeng3dPreView.prototype.onDrawObject = function () {
            this.cameraRotation && (editor.feng3dScreenShot.camera.transform.rotation = this.cameraRotation);
            editor.feng3dScreenShot.updateCameraPosition();
            this.image.source = editor.feng3dScreenShot.toDataURL();
        };
        OAVFeng3dPreView.prototype.onMouseUp = function () {
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        OAVFeng3dPreView.prototype.updateView = function () {
        };
        OAVFeng3dPreView.prototype.onResize = function () {
            this.height = this.width;
            this.image.width = this.image.height = this.width;
            editor.feng3dScreenShot.engine.setSize(this.width, this.height);
        };
        OAVFeng3dPreView = __decorate([
            feng3d.OAVComponent()
        ], OAVFeng3dPreView);
        return OAVFeng3dPreView;
    }(editor.OAVBase));
    editor.OAVFeng3dPreView = OAVFeng3dPreView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVMinMaxCurve = /** @class */ (function (_super) {
        __extends(OAVMinMaxCurve, _super);
        function OAVMinMaxCurve(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMinMaxCurve";
            return _this;
        }
        OAVMinMaxCurve.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveView.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxCurveView.minMaxCurve = this.attributeValue;
            this.minMaxCurveView.touchEnabled = this.minMaxCurveView.touchChildren = this._attributeViewInfo.editable;
        };
        OAVMinMaxCurve.prototype.dispose = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        };
        OAVMinMaxCurve.prototype.updateView = function () {
        };
        OAVMinMaxCurve.prototype.onChange = function () {
        };
        OAVMinMaxCurve = __decorate([
            feng3d.OAVComponent()
        ], OAVMinMaxCurve);
        return OAVMinMaxCurve;
    }(editor.OAVBase));
    editor.OAVMinMaxCurve = OAVMinMaxCurve;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVMinMaxCurveVector3 = /** @class */ (function (_super) {
        __extends(OAVMinMaxCurveVector3, _super);
        function OAVMinMaxCurveVector3(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMinMaxCurveVector3";
            return _this;
        }
        OAVMinMaxCurveVector3.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxCurveVector3View.minMaxCurveVector3 = this.attributeValue;
            this.minMaxCurveVector3View.touchEnabled = this.minMaxCurveVector3View.touchChildren = this._attributeViewInfo.editable;
        };
        OAVMinMaxCurveVector3.prototype.dispose = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxCurveVector3View.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        };
        OAVMinMaxCurveVector3.prototype.updateView = function () {
        };
        OAVMinMaxCurveVector3.prototype.onChange = function () {
        };
        OAVMinMaxCurveVector3 = __decorate([
            feng3d.OAVComponent()
        ], OAVMinMaxCurveVector3);
        return OAVMinMaxCurveVector3;
    }(editor.OAVBase));
    editor.OAVMinMaxCurveVector3 = OAVMinMaxCurveVector3;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var OAVMinMaxGradient = /** @class */ (function (_super) {
        __extends(OAVMinMaxGradient, _super);
        function OAVMinMaxGradient(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this.skinName = "OAVMinMaxGradient";
            return _this;
        }
        OAVMinMaxGradient.prototype.initView = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.addEventListener(egret.Event.CHANGE, this.onChange, this);
            }
            this.minMaxGradientView.minMaxGradient = this.attributeValue;
            this.minMaxGradientView.touchEnabled = this.minMaxGradientView.touchChildren = this._attributeViewInfo.editable;
        };
        OAVMinMaxGradient.prototype.dispose = function () {
            if (this._attributeViewInfo.editable) {
                this.minMaxGradientView.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            }
        };
        OAVMinMaxGradient.prototype.updateView = function () {
        };
        OAVMinMaxGradient.prototype.onChange = function () {
        };
        OAVMinMaxGradient = __decorate([
            feng3d.OAVComponent()
        ], OAVMinMaxGradient);
        return OAVMinMaxGradient;
    }(editor.OAVBase));
    editor.OAVMinMaxGradient = OAVMinMaxGradient;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 属性面板（检查器）
     */
    var InspectorView = /** @class */ (function (_super) {
        __extends(InspectorView, _super);
        function InspectorView() {
            var _this = _super.call(this) || this;
            _this._viewDataList = [];
            _this._dataChanged = false;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "InspectorViewSkin";
            return _this;
        }
        InspectorView.prototype.showData = function (data, removeBack) {
            if (removeBack === void 0) { removeBack = false; }
            if (this._viewData) {
                this.saveShowData();
                this._viewDataList.push(this._viewData);
            }
            if (removeBack) {
                this._viewDataList.length = 0;
            }
            //
            this._viewData = data;
            this.updateView();
        };
        InspectorView.prototype.updateView = function () {
            var _this = this;
            this.typeLab.text = "Inspector";
            this.backButton.visible = this._viewDataList.length > 0;
            if (this._view && this._view.parent) {
                this._view.parent.removeChild(this._view);
            }
            if (this._viewData) {
                if (this._viewData instanceof editor.AssetsNode) {
                    if (this._viewData.isDirectory)
                        return;
                    if (this._viewData.feng3dAssets) {
                        this.updateShowData(this._viewData.feng3dAssets);
                    }
                    else {
                        if (!this._viewData.isLoaded) {
                            var viewData = this._viewData;
                            viewData.load(function () {
                                feng3d.assert(!!viewData.feng3dAssets);
                                if (viewData == _this._viewData)
                                    _this.updateShowData(viewData.feng3dAssets);
                            });
                        }
                    }
                }
                else {
                    this.updateShowData(this._viewData);
                }
            }
        };
        /**
         * 保存显示数据
         */
        InspectorView.prototype.saveShowData = function (callback) {
            if (this._dataChanged) {
                if (this._viewData instanceof feng3d.Feng3dAssets) {
                    if (this._viewData.assetsId) {
                        var assetsFile = editor.editorAssets.getAssetsByID(this._viewData.assetsId);
                        assetsFile && editor.editorAssets.saveAssets(assetsFile);
                    }
                }
                else if (this._viewData instanceof editor.AssetsNode) {
                    editor.editorAssets.saveAssets(assetsFile);
                }
                this._dataChanged = false;
            }
            else {
                callback && callback();
            }
        };
        InspectorView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            editor.editorui.inspectorView = this;
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        InspectorView.prototype.onAddedToStage = function () {
            this.backButton.visible = this._viewDataList.length > 0;
            this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
        };
        InspectorView.prototype.onRemovedFromStage = function () {
            this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.onSelectedObjectsChanged, this);
        };
        InspectorView.prototype.onSelectedObjectsChanged = function () {
            var data = editor.inspectorMultiObject.convertInspectorObject(editor.editorData.selectedObjects);
            this.showData(data, true);
        };
        InspectorView.prototype.updateShowData = function (showdata) {
            this.typeLab.text = "Inspector - " + showdata.constructor["name"];
            if (this._view)
                this._view.removeEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
            var editable = true;
            if (showdata instanceof feng3d.Feng3dObject)
                editable = !Boolean(showdata.hideFlags & feng3d.HideFlags.NotEditable);
            this._view = feng3d.objectview.getObjectView(showdata, { editable: editable });
            this._view.percentWidth = 100;
            this.group.addChild(this._view);
            this.group.scrollV = 0;
            this._view.addEventListener(feng3d.ObjectViewEvent.VALUE_CHANGE, this.onValueChanged, this);
        };
        InspectorView.prototype.onValueChanged = function (e) {
            this._dataChanged = true;
            if (this._viewData instanceof feng3d.Feng3dAssets) {
                if (this._viewData.assetsId) {
                    var assetsFile = editor.editorAssets.getAssetsByID(this._viewData.assetsId);
                    assetsFile && assetsFile.updateImage();
                }
            }
            else if (this._viewData instanceof editor.AssetsNode) {
                this._viewData.updateImage();
            }
        };
        InspectorView.prototype.onBackButton = function () {
            this._viewData = this._viewDataList.pop();
            this.updateView();
        };
        return InspectorView;
    }(eui.Component));
    editor.InspectorView = InspectorView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 检查器多对象
     *
     * 处理多个对象在检查器中显示问题
     */
    var InspectorMultiObject = /** @class */ (function () {
        function InspectorMultiObject() {
        }
        InspectorMultiObject.prototype.convertInspectorObject = function (objects) {
            if (objects.length == 0)
                return 0;
            if (objects.length == 1)
                return objects[0];
            var data = {};
            objects.forEach(function (element) {
                if (element instanceof editor.AssetsNode) {
                    element = element.feng3dAssets;
                }
                var type = feng3d.classUtils.getQualifiedClassName(element);
                var list = data[type] = data[type] || [];
                list.push(element);
            });
            var l = [];
            for (var type in data) {
                var element = data[type];
                l.push(element.length + " " + type);
            }
            l.unshift(objects.length + " Objects\n");
            return l.join("\n\t");
        };
        return InspectorMultiObject;
    }());
    editor.InspectorMultiObject = InspectorMultiObject;
    editor.inspectorMultiObject = new InspectorMultiObject();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var HierarchyTreeItemRenderer = /** @class */ (function (_super) {
        __extends(HierarchyTreeItemRenderer, _super);
        function HierarchyTreeItemRenderer() {
            var _this = _super.call(this) || this;
            _this.skinName = "HierarchyTreeItemRenderer";
            return _this;
        }
        HierarchyTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            var _this = this;
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            editor.drag.register(this, this.setdargSource.bind(this), ["gameobject", "file_gameobject", "file_script"], function (dragdata) {
                if (dragdata.gameobject) {
                    if (!dragdata.gameobject.contains(_this.data.gameobject)) {
                        var localToWorldMatrix = dragdata.gameobject.transform.localToWorldMatrix;
                        _this.data.gameobject.addChild(dragdata.gameobject);
                        dragdata.gameobject.transform.localToWorldMatrix = localToWorldMatrix;
                    }
                }
                if (dragdata.file_gameobject) {
                    editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, _this.data.gameobject);
                }
                if (dragdata.file_script) {
                    _this.data.gameobject.addScript(dragdata.file_script.scriptName);
                }
            });
            //
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        HierarchyTreeItemRenderer.prototype.$onRemoveFromStage = function () {
            editor.drag.unregister(this);
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        HierarchyTreeItemRenderer.prototype.setdargSource = function (dragSource) {
            dragSource.gameobject = this.data.gameobject;
        };
        HierarchyTreeItemRenderer.prototype.onclick = function () {
            editor.editorData.selectObject(this.data.gameobject);
        };
        HierarchyTreeItemRenderer.prototype.onDoubleClick = function () {
            feng3d.shortcut.dispatch("lookToSelectedGameObject");
        };
        HierarchyTreeItemRenderer.prototype.onrightclick = function (e) {
            var _this = this;
            var menuconfig = [];
            //scene3d无法删除
            if (this.data.gameobject.scene.gameObject != this.data.gameobject) {
                menuconfig.push({
                    label: "删除", click: function () {
                        _this.data.gameobject.parent.removeChild(_this.data.gameobject);
                    }
                });
            }
            menuconfig = menuconfig.concat({ type: 'separator' }, editor.createObjectConfig);
            if (menuconfig.length > 0)
                editor.menu.popup(menuconfig);
        };
        return HierarchyTreeItemRenderer;
    }(editor.TreeItemRenderer));
    editor.HierarchyTreeItemRenderer = HierarchyTreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var HierarchyView = /** @class */ (function (_super) {
        __extends(HierarchyView, _super);
        function HierarchyView() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "HierarchyViewSkin";
            return _this;
        }
        HierarchyView.prototype.onComplete = function () {
            this.list.itemRenderer = editor.HierarchyTreeItemRenderer;
            this.hierachyScroller.viewport = this.list;
            this.listData = this.list.dataProvider = new eui.ArrayCollection();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        HierarchyView.prototype.onAddedToStage = function () {
            this.list.addEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
            this.list.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
            feng3d.watcher.watch(editor.hierarchy, "rootnode", this.onRootNodeChanged, this);
            this.onRootNode(editor.hierarchy.rootnode);
            this.invalidHierarchy();
        };
        HierarchyView.prototype.onRemovedFromStage = function () {
            this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
            this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
            feng3d.watcher.unwatch(editor.hierarchy, "rootnode", this.onRootNodeChanged, this);
            this.offRootNode(editor.hierarchy.rootnode);
        };
        HierarchyView.prototype.onRootNodeChanged = function (host, property, oldvalue) {
            this.offRootNode(oldvalue);
            this.onRootNode(editor.hierarchy.rootnode);
        };
        HierarchyView.prototype.onRootNode = function (node) {
            if (node) {
                node.on("added", this.invalidHierarchy, this);
                node.on("removed", this.invalidHierarchy, this);
                node.on("openChanged", this.invalidHierarchy, this);
            }
        };
        HierarchyView.prototype.offRootNode = function (node) {
            if (node) {
                node.off("added", this.invalidHierarchy, this);
                node.off("removed", this.invalidHierarchy, this);
                node.off("openChanged", this.invalidHierarchy, this);
            }
        };
        HierarchyView.prototype.invalidHierarchy = function () {
            feng3d.ticker.nextframe(this.updateHierarchyTree, this);
        };
        HierarchyView.prototype.updateHierarchyTree = function () {
            var nodes = editor.hierarchy.rootnode.getShowNodes();
            this.listData.replaceAll(nodes);
        };
        HierarchyView.prototype.onListClick = function (e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
            }
        };
        HierarchyView.prototype.onListRightClick = function (e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
                editor.menu.popup(editor.createObjectConfig, { mousex: feng3d.windowEventProxy.clientX, mousey: feng3d.windowEventProxy.clientY });
            }
        };
        return HierarchyView;
    }(eui.Component));
    editor.HierarchyView = HierarchyView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 资源字典表存储路径
     */
    var assetsFilePath = "assets.json";
    /**
     * 资源文件夹路径
     */
    var AssetsPath = "Assets/";
    var EditorAssets = /** @class */ (function () {
        function EditorAssets() {
            /**
             * 资源ID字典
             */
            this._assetsIDMap = {};
            /**
             * 上次执行的项目脚本
             */
            this._preProjectJsContent = null;
            feng3d.feng3dDispatcher.on("assets.parsed", this.onParsed, this);
        }
        /**
         * 初始化项目
         * @param callback
         */
        EditorAssets.prototype.initproject = function (callback) {
            var _this = this;
            editor.editorFS.fs.readObject(assetsFilePath, function (err, list) {
                list = list || [{ id: AssetsPath, path: AssetsPath, isDirectory: true }];
                feng3d.assetsIDPathMap.init(list);
                list.map(function (element) {
                    return _this._assetsIDMap[element.id] = new editor.AssetsNode(element.id, element.path, element.isDirectory);
                }).forEach(function (element) {
                    var elementpath = feng3d.assetsIDPathMap.getPath(element.id);
                    var parentPath = feng3d.pathUtils.getParentPath(elementpath);
                    if (parentPath != "/" && parentPath.length > 0) {
                        _this.getAssetsByPath(parentPath).addChild(element);
                    }
                });
                _this.rootFile = _this.getAssetsByID(AssetsPath);
                _this.showFloder = _this.rootFile;
                _this.rootFile.on("added", function () { _this.saveProject(); });
                _this.rootFile.on("removed", function () { _this.saveProject(); });
                _this.rootFile.isOpen = true;
                callback();
            });
        };
        EditorAssets.prototype.readScene = function (path, callback) {
            editor.editorFS.fs.readObject(path, function (err, object) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var scene = object.getComponent(feng3d.Scene3D);
                callback(null, scene);
            });
        };
        /**
         * 根据资源编号获取文件
         *
         * @param assetsId 文件路径
         */
        EditorAssets.prototype.getAssetsByID = function (assetsId) {
            return this._assetsIDMap[assetsId];
        };
        /**
         * 根据路径获取资源
         *
         * @param assetsPath 资源路径
         */
        EditorAssets.prototype.getAssetsByPath = function (assetsPath) {
            var id = feng3d.assetsIDPathMap.getID(assetsPath);
            return this.getAssetsByID(id);
        };
        /**
         * 删除资源
         *
         * @param assetsFile 资源
         */
        EditorAssets.prototype.deleteAssets = function (assetsFile, callback) {
            var _this = this;
            feng3d.assert(!!this._assetsIDMap[assetsFile.id]);
            editor.editorFS.deleteAssets(assetsFile.feng3dAssets, function (err) {
                if (err) {
                    callback && callback(err);
                    return;
                }
                delete _this._assetsIDMap[assetsFile.id];
                feng3d.feng3dDispatcher.dispatch("assets.deletefile", { id: assetsFile.id });
                _this.saveProject();
                callback && callback(err);
            });
        };
        /**
         * 保存项目
         * @param callback 完成回调
         */
        EditorAssets.prototype.saveProject = function (callback) {
            editor.editorFS.fs.writeObject(assetsFilePath, feng3d.assetsIDPathMap.toList(), callback);
        };
        /**
         * 保存资源
         *
         * @param assetsFile 资源
         * @param callback 完成回调
         */
        EditorAssets.prototype.saveAssets = function (assetsFile, callback) {
            feng3d.assert(!!this._assetsIDMap[assetsFile.id], "\u65E0\u6CD5\u4FDD\u5B58\u5DF2\u7ECF\u88AB\u5220\u9664\u7684\u8D44\u6E90\uFF01");
            editor.editorFS.writeAssets(assetsFile.feng3dAssets, function (err) {
                feng3d.assert(!err, "\u8D44\u6E90 " + assetsFile.id + " \u4FDD\u5B58\u5931\u8D25\uFF01");
                callback && callback();
            });
        };
        /**
         * 移动资源
         *
         * @param assetsFile 资源文件
         * @param newPath 新路径
         * @param callback 回调函数，当文件系统中文件全部移动完成后调用
         */
        EditorAssets.prototype.moveAssets = function (assetsFile, newPath, callback) {
            if (feng3d.assetsIDPathMap.existPath(newPath)) {
                callback && callback();
                return;
            }
            var oldPath = feng3d.assetsIDPathMap.getPath(assetsFile.id);
            var files = assetsFile.getFileList();
            // 更新资源结点中文件路径
            files.forEach(function (file) {
                var filepath = feng3d.assetsIDPathMap.getPath(file.id);
                filepath = filepath.replace(oldPath, newPath);
                feng3d.assetsIDPathMap.deleteByID(file.id);
                feng3d.assetsIDPathMap.addItem({ id: file.id, path: filepath, isDirectory: file.isDirectory });
            });
            // 更新结点父子关系
            var newParentPath = feng3d.pathUtils.getParentPath(newPath);
            var newParentAssetsFile = this.getAssetsByPath(newParentPath);
            newParentAssetsFile.addChild(assetsFile);
            // 移动文件
            editor.editorFS.fs.move(oldPath, newPath, callback);
        };
        /**
         * 获取脚本列表
         */
        EditorAssets.prototype.getScripts = function () {
            var files = this._assetsIDMap;
            var tslist = [];
            for (var key in files) {
                var file = files[key].feng3dAssets;
                if (file instanceof feng3d.ScriptFile) {
                    tslist.push(file);
                }
            }
            return tslist;
        };
        /**
         * 获取指定类型资源
         * @param type 资源类型
         */
        EditorAssets.prototype.getAssetsByType = function (type) {
            var _this = this;
            var assetsFiles = Object.keys(this._assetsIDMap).map(function (key) { return _this._assetsIDMap[key]; }).filter(function (element) { return element.feng3dAssets instanceof type; });
            return assetsFiles;
        };
        /**
         * 新增文件夹
         *
         * @param folderName 文件夹名称
         */
        EditorAssets.prototype.createFolder = function (parentAssets, folderName) {
            var _this = this;
            var newName = parentAssets.getNewChildFileName(folderName);
            var parentPath = feng3d.assetsIDPathMap.getPath(parentAssets.id);
            var newFolderPath = feng3d.pathUtils.getChildFolderPath(parentPath, newName);
            var assetsFile = new editor.AssetsNode(feng3d.FMath.uuid(), newFolderPath, true);
            var feng3dFolder = new feng3d.Feng3dFolder();
            feng3dFolder.assetsId = assetsFile.id;
            assetsFile.feng3dAssets = feng3dFolder;
            assetsFile.isLoaded = true;
            this._assetsIDMap[assetsFile.id] = assetsFile;
            feng3d.assetsIDPathMap.addItem({ id: assetsFile.id, path: newFolderPath, isDirectory: assetsFile.isDirectory });
            this.saveAssets(assetsFile, function () {
                _this.saveProject();
                parentAssets.addChild(assetsFile);
            });
            return assetsFile;
        };
        /**
         * 新增资源
         *
         * @param feng3dAssets
         */
        EditorAssets.prototype.createAssets = function (parentAssets, fileName, feng3dAssets) {
            var _this = this;
            var path = parentAssets.getNewChildPath(fileName);
            var assetsFile = new editor.AssetsNode(feng3d.FMath.uuid(), path, false);
            feng3dAssets.assetsId = assetsFile.id;
            assetsFile.feng3dAssets = feng3dAssets;
            assetsFile.isLoaded = true;
            this._assetsIDMap[assetsFile.id] = assetsFile;
            feng3d.assetsIDPathMap.addItem({ id: assetsFile.id, path: path, isDirectory: assetsFile.isDirectory });
            this.saveAssets(assetsFile, function () {
                _this.saveProject();
            });
            parentAssets.addChild(assetsFile);
            return assetsFile;
        };
        /**
         * 弹出文件菜单
         */
        EditorAssets.prototype.popupmenu = function (assetsFile) {
            var _this = this;
            var menuconfig = [];
            if (assetsFile.isDirectory) {
                menuconfig.push({
                    label: "新建",
                    submenu: [
                        {
                            label: "文件夹", click: function () {
                                editor.editorData.selectObject(_this.createFolder(assetsFile, "NewFolder"));
                            }
                        },
                        {
                            label: "脚本", click: function () {
                                var fileName = assetsFile.getNewChildFileName("NewScript.ts");
                                var scriptName = fileName.split(".").shift();
                                editor.editorData.selectObject(_this.createAssets(assetsFile, fileName, Object.setValue(new feng3d.ScriptFile(), { textContent: editor.assetsFileTemplates.getNewScript(scriptName) })));
                            }
                        },
                        {
                            label: "着色器", click: function () {
                                var fileName = assetsFile.getNewChildFileName("NewShader.ts");
                                var shaderName = fileName.split(".").shift();
                                editor.editorData.selectObject(_this.createAssets(assetsFile, fileName, Object.setValue(new feng3d.ShaderFile(), { textContent: editor.assetsFileTemplates.getNewShader(shaderName) })));
                            }
                        },
                        {
                            label: "js", click: function () {
                                editor.editorData.selectObject(_this.createAssets(assetsFile, "NewJs.js", new feng3d.JSFile()));
                            }
                        },
                        {
                            label: "Json", click: function () {
                                editor.editorData.selectObject(_this.createAssets(assetsFile, "New Json.json", new feng3d.JsonFile()));
                            }
                        },
                        {
                            label: "文本", click: function () {
                                editor.editorData.selectObject(_this.createAssets(assetsFile, "New Text.txt", new feng3d.TextFile()));
                            }
                        },
                        { type: "separator" },
                        {
                            label: "立方体贴图", click: function () {
                                editor.editorData.selectObject(_this.createAssets(assetsFile, "new TextureCube.json", new feng3d.TextureCube()));
                            }
                        },
                        {
                            label: "材质", click: function () {
                                editor.editorData.selectObject(_this.createAssets(assetsFile, "New Material.json", new feng3d.Material()));
                            }
                        },
                        {
                            label: "几何体",
                            submenu: [
                                {
                                    label: "平面", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New PlaneGeometry.json", new feng3d.PlaneGeometry()));
                                    }
                                },
                                {
                                    label: "立方体", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New CubeGeometry.json", new feng3d.CubeGeometry()));
                                    }
                                },
                                {
                                    label: "球体", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New SphereGeometry.json", new feng3d.SphereGeometry()));
                                    }
                                },
                                {
                                    label: "胶囊体", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New CapsuleGeometry.json", new feng3d.CapsuleGeometry()));
                                    }
                                },
                                {
                                    label: "圆柱体", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New CylinderGeometry.json", new feng3d.CylinderGeometry()));
                                    }
                                },
                                {
                                    label: "圆锥体", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New ConeGeometry.json", new feng3d.ConeGeometry()));
                                    }
                                },
                                {
                                    label: "圆环", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New TorusGeometry.json", new feng3d.TorusGeometry()));
                                    }
                                },
                                {
                                    label: "地形", click: function () {
                                        editor.editorData.selectObject(_this.createAssets(assetsFile, "New TerrainGeometry.json", new feng3d.TerrainGeometry()));
                                    }
                                },
                            ],
                        },
                    ]
                }, { type: "separator" }, {
                    label: "导入资源", click: function () {
                        editor.editorFS.selectFile(function (fileList) {
                            var files = [];
                            for (var i = 0; i < fileList.length; i++) {
                                files[i] = fileList[i];
                            }
                            _this.inputFiles(files);
                        });
                    }
                });
            }
            if (menuconfig.length > 0) {
                menuconfig.push({ type: "separator" });
            }
            // 使用编辑器打开
            if (assetsFile.feng3dAssets instanceof feng3d.StringFile) {
                menuconfig.push({
                    label: "编辑", click: function () {
                        editor.scriptCompiler.edit(assetsFile.feng3dAssets);
                    }
                });
            }
            // 解析菜单
            this.parserMenu(menuconfig, assetsFile);
            if (!assetsFile.isDirectory) {
                menuconfig.push({
                    label: "导出", click: function () {
                        assetsFile.export();
                    }
                });
            }
            if (assetsFile != this.rootFile && assetsFile != this.showFloder) {
                menuconfig.push({
                    label: "删除", click: function () {
                        assetsFile.delete();
                    }
                });
            }
            if (assetsFile.feng3dAssets instanceof feng3d.UrlImageTexture2D) {
                menuconfig.push({
                    label: "去除背景色", click: function () {
                        var image = assetsFile.feng3dAssets["image"];
                        var imageUtil = new feng3d.ImageUtil().fromImage(image);
                        var backColor = new feng3d.Color4(222 / 255, 222 / 255, 222 / 255);
                        imageUtil.clearBackColor(backColor);
                        feng3d.dataTransform.imagedataToImage(imageUtil.imageData, function (img) {
                            assetsFile.feng3dAssets["image"] = img;
                            _this.saveAssets(assetsFile);
                        });
                    }
                });
            }
            editor.menu.popup(menuconfig);
        };
        /**
         * 保存对象
         *
         * @param object 对象
         * @param callback
         */
        EditorAssets.prototype.saveObject = function (object, callback) {
            feng3d.error("\u672A\u5B9E\u73B0");
            var assetsFile = this.createAssets(this.showFloder, object.name, object);
            callback && callback(assetsFile);
        };
        /**
         *
         * @param files 需要导入的文件列表
         * @param callback 完成回调
         * @param assetsFiles 生成资源文件列表（不用赋值，函数递归时使用）
         */
        EditorAssets.prototype.inputFiles = function (files, callback, assetsFiles) {
            var _this = this;
            if (assetsFiles === void 0) { assetsFiles = []; }
            if (files.length == 0) {
                editor.editorData.selectMultiObject(assetsFiles);
                callback && callback(assetsFiles);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', function (event) {
                var result = event.target["result"];
                var showFloder = _this.showFloder;
                if (feng3d.regExps.image.test(file.name)) {
                    var imagePath = showFloder.getNewChildPath(file.name);
                    editor.editorFS.fs.writeArrayBuffer(imagePath, result, function (err) {
                        var urlImageTexture2D = Object.setValue(new feng3d.UrlImageTexture2D(), { name: file.name });
                        urlImageTexture2D.url = imagePath;
                        var assetsFile = _this.createAssets(showFloder, file.name, urlImageTexture2D);
                        assetsFiles.push(assetsFile);
                        _this.inputFiles(files, callback, assetsFiles);
                    });
                }
                else {
                    showFloder.addfileFromArrayBuffer(file.name, result, false, function (e, assetsFile) {
                        if (e) {
                            feng3d.error(e);
                            _this.inputFiles(files, callback, assetsFiles);
                        }
                        else {
                            assetsFiles.push(assetsFile);
                            _this.inputFiles(files, callback, assetsFiles);
                        }
                    });
                }
            }, false);
            reader.readAsArrayBuffer(file);
        };
        EditorAssets.prototype.runProjectScript = function (callback) {
            var _this = this;
            editor.editorFS.fs.readString("project.js", function (err, content) {
                if (content != _this._preProjectJsContent) {
                    //
                    var windowEval = eval.bind(window);
                    try {
                        // 运行project.js
                        windowEval(content);
                        // 刷新属性界面（界面中可能有脚本）
                        editor.editorui.inspectorView.updateView();
                    }
                    catch (error) {
                        feng3d.warn(error);
                    }
                }
                _this._preProjectJsContent = content;
                callback && callback();
            });
        };
        /**
         * 解析菜单
         * @param menuconfig 菜单
         * @param assetsFile 文件
         */
        EditorAssets.prototype.parserMenu = function (menuconfig, assetsFile) {
            if (assetsFile.feng3dAssets instanceof feng3d.Feng3dFile) {
                var filePath = feng3d.assetsIDPathMap.getPath(assetsFile.id);
                var extensions = feng3d.pathUtils.getExtension(filePath);
                switch (extensions) {
                    case "mdl":
                        menuconfig.push({ label: "解析", click: function () { return feng3d.mdlLoader.load(filePath); } });
                        break;
                    case "obj":
                        menuconfig.push({ label: "解析", click: function () { return feng3d.objLoader.load(filePath); } });
                        break;
                    case "mtl":
                        menuconfig.push({ label: "解析", click: function () { return feng3d.mtlLoader.load(filePath); } });
                        break;
                    case "fbx":
                        menuconfig.push({ label: "解析", click: function () { return editor.threejsLoader.load(filePath); } });
                        break;
                    case "md5mesh":
                        menuconfig.push({ label: "解析", click: function () { return feng3d.md5Loader.load(filePath); } });
                        break;
                    case "md5anim":
                        menuconfig.push({ label: "解析", click: function () { return feng3d.md5Loader.loadAnim(filePath); } });
                        break;
                }
            }
        };
        EditorAssets.prototype.showFloderChanged = function (property, oldValue, newValue) {
            this.showFloder.openParents();
            feng3d.feng3dDispatcher.dispatch("assets.showFloderChanged", { oldpath: oldValue, newpath: newValue });
        };
        EditorAssets.prototype.onParsed = function (e) {
            var data = e.data;
            if (data instanceof feng3d.Feng3dAssets) {
                this.saveObject(data);
            }
        };
        __decorate([
            feng3d.watch("showFloderChanged")
        ], EditorAssets.prototype, "showFloder", void 0);
        return EditorAssets;
    }());
    editor.EditorAssets = EditorAssets;
    editor.editorAssets = new EditorAssets();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsFileItemRenderer = /** @class */ (function (_super) {
        __extends(AssetsFileItemRenderer, _super);
        function AssetsFileItemRenderer() {
            var _this = _super.call(this) || this;
            _this.itemSelected = false;
            _this.skinName = "AssetsFileItemRenderer";
            return _this;
        }
        AssetsFileItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            this.selectedfilechanged();
        };
        AssetsFileItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        };
        AssetsFileItemRenderer.prototype.dataChanged = function () {
            var _this = this;
            _super.prototype.dataChanged.call(this);
            if (this.data) {
                if (this.data.isDirectory) {
                    editor.drag.register(this, function (dragsource) {
                        if (editor.editorData.selectedAssetsFile.indexOf(_this.data) != -1) {
                            dragsource.assetsFiles = editor.editorData.selectedAssetsFile.concat();
                        }
                        else {
                            dragsource.assetsFiles = [_this.data];
                        }
                    }, ["assetsFiles"], function (dragdata) {
                        dragdata.assetsFiles.forEach(function (v) {
                            // 移动文件
                            var oldPath = feng3d.assetsIDPathMap.getPath(v.id);
                            var newParentPath = feng3d.assetsIDPathMap.getPath(_this.data.id);
                            var newPath = oldPath.replace(feng3d.pathUtils.getParentPath(oldPath), newParentPath);
                            editor.editorAssets.moveAssets(v, newPath);
                        });
                    });
                }
                else {
                    if (!this.data.isLoaded) {
                        var data = this.data;
                        data.load(function () {
                            feng3d.assert(data.isLoaded);
                            if (data == _this.data)
                                _this.dataChanged();
                        });
                        return;
                    }
                    editor.drag.register(this, function (dragsource) {
                        var extension = _this.data.feng3dAssets.assetType;
                        switch (extension) {
                            case feng3d.AssetExtension.gameobject:
                                dragsource.file_gameobject = feng3d.serialization.clone(_this.data.feng3dAssets);
                                break;
                            case feng3d.AssetExtension.script:
                                dragsource.file_script = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.anim:
                                dragsource.animationclip = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.material:
                                dragsource.material = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.texturecube:
                                dragsource.texturecube = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.geometry:
                                dragsource.geometry = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.texture:
                                dragsource.texture2d = _this.data.feng3dAssets;
                                break;
                            case feng3d.AssetExtension.audio:
                                dragsource.audio = _this.data.feng3dAssets;
                                break;
                        }
                        if (editor.editorData.selectedAssetsFile.indexOf(_this.data) != -1) {
                            dragsource.assetsFiles = editor.editorData.selectedAssetsFile.concat();
                        }
                        else {
                            dragsource.assetsFiles = [_this.data];
                        }
                    }, []);
                }
            }
            else {
                editor.drag.unregister(this);
            }
            this.selectedfilechanged();
        };
        AssetsFileItemRenderer.prototype.ondoubleclick = function () {
            if (this.data.isDirectory) {
                editor.editorAssets.showFloder = this.data;
            }
            else if (this.data.feng3dAssets instanceof feng3d.GameObject) {
                var scene = this.data.feng3dAssets.getComponent(feng3d.Scene3D);
                if (scene) {
                    editor.engine.scene = scene;
                }
            }
        };
        AssetsFileItemRenderer.prototype.onclick = function () {
            // 处理按下shift键时
            var isShift = feng3d.shortcut.keyState.getKeyState("shift");
            if (isShift) {
                var source = this.parent.dataProvider.source;
                var index = source.indexOf(this.data);
                var min = index, max = index;
                if (editor.editorData.selectedAssetsFile.indexOf(preAssetsFile) != -1) {
                    index = source.indexOf(preAssetsFile);
                    if (index < min)
                        min = index;
                    if (index > max)
                        max = index;
                }
                editor.editorData.selectMultiObject(source.slice(min, max + 1));
            }
            else {
                editor.editorData.selectObject(this.data);
                preAssetsFile = this.data;
            }
        };
        AssetsFileItemRenderer.prototype.onrightclick = function (e) {
            e.stopPropagation();
            editor.editorData.selectObject(this.data);
            editor.editorAssets.popupmenu(this.data);
        };
        AssetsFileItemRenderer.prototype.selectedfilechanged = function () {
            var selectedAssetsFile = editor.editorData.selectedAssetsFile;
            var selected = this.data ? selectedAssetsFile.indexOf(this.data) != -1 : false;
            if (this.itemSelected != selected) {
                this.itemSelected = selected;
            }
        };
        return AssetsFileItemRenderer;
    }(eui.ItemRenderer));
    editor.AssetsFileItemRenderer = AssetsFileItemRenderer;
    var preAssetsFile;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 资源元数据
     */
    var AssetsMeta = /** @class */ (function () {
        function AssetsMeta() {
        }
        return AssetsMeta;
    }());
    editor.AssetsMeta = AssetsMeta;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsNode = /** @class */ (function (_super) {
        __extends(AssetsNode, _super);
        /**
         * 构建
         *
         * @param id 编号
         * @param path 路径
         */
        function AssetsNode(id, path, isDirectory) {
            var _this = _super.call(this) || this;
            _this.children = [];
            /**
             * 是否已加载
             */
            _this.isLoaded = false;
            feng3d.assert(!!id);
            feng3d.assert(!!path);
            _this._id = id;
            _this.isDirectory = isDirectory;
            _this.label = feng3d.pathUtils.getName(path);
            // 更新图标
            if (_this.isDirectory) {
                _this.image = "folder_png";
            }
            else {
                _this.image = "file_png";
            }
            return _this;
        }
        Object.defineProperty(AssetsNode.prototype, "id", {
            /**
             * 编号
             */
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        /**
         * 加载元标签文件
         *
         * @param callback 加载完成回调
         */
        AssetsNode.prototype.loadMeta = function (callback) {
        };
        /**
         * 加载
         *
         * @param callback 加载完成回调
         */
        AssetsNode.prototype.load = function (callback) {
            var _this = this;
            if (this.isLoaded) {
                callback && callback();
                return;
            }
            if (this.isLoading) {
                callback && this.on("loaded", callback);
                return;
            }
            this.isLoading = true;
            editor.editorFS.readAssets(this.id, function (err, assets) {
                feng3d.assert(!err);
                var path = feng3d.assetsIDPathMap.getPath(_this.id);
                assets.name = feng3d.pathUtils.getNameWithExtension(path);
                _this.feng3dAssets = assets;
                _this.isLoading = false;
                _this.isLoaded = true;
                callback && callback();
                _this.dispatch("loaded", _this);
            });
        };
        /**
         * 更新缩略图
         */
        AssetsNode.prototype.updateImage = function () {
            var _this = this;
            if (this.feng3dAssets instanceof feng3d.UrlImageTexture2D) {
                var texture = this.feng3dAssets;
                texture.onLoadCompleted(function () {
                    _this.image = texture.dataURL;
                });
            }
            else if (this.feng3dAssets instanceof feng3d.TextureCube) {
                var textureCube = this.feng3dAssets;
                textureCube.onLoadCompleted(function () {
                    _this.image = editor.feng3dScreenShot.drawTextureCube(textureCube);
                });
            }
            else if (this.feng3dAssets instanceof feng3d.Material) {
                var mat = this.feng3dAssets;
                mat.onLoadCompleted(function () {
                    _this.image = editor.feng3dScreenShot.drawMaterial(mat).toDataURL();
                });
            }
            else if (this.feng3dAssets instanceof feng3d.Geometry) {
                this.image = editor.feng3dScreenShot.drawGeometry(this.feng3dAssets).toDataURL();
            }
            else if (this.feng3dAssets instanceof feng3d.GameObject) {
                var gameObject = this.feng3dAssets;
                gameObject.onLoadCompleted(function () {
                    _this.image = editor.feng3dScreenShot.drawGameObject(gameObject).toDataURL();
                });
            }
        };
        /**
         * 删除
         */
        AssetsNode.prototype.delete = function () {
            this.children.forEach(function (element) {
                element.delete();
            });
            this.remove();
            editor.editorAssets.deleteAssets(this);
        };
        /**
         * 获取文件夹列表
         *
         * @param includeClose 是否包含关闭的文件夹
         */
        AssetsNode.prototype.getFolderList = function (includeClose) {
            if (includeClose === void 0) { includeClose = false; }
            var folders = [];
            if (this.isDirectory) {
                folders.push(this);
            }
            if (this.isOpen || includeClose) {
                this.children.forEach(function (v) {
                    var cfolders = v.getFolderList();
                    folders = folders.concat(cfolders);
                });
            }
            return folders;
        };
        /**
         * 获取文件列表
         */
        AssetsNode.prototype.getFileList = function () {
            var files = [];
            files.push(this);
            this.children.forEach(function (v) {
                var cfiles = v.getFileList();
                files = files.concat(cfiles);
            });
            return files;
        };
        /**
         * 获取新子文件名称
         *
         * @param childName 基础名称
         */
        AssetsNode.prototype.getNewChildFileName = function (childName) {
            var childrenNames = this.children.map(function (v) {
                var filepath = feng3d.assetsIDPathMap.getPath(v.id);
                var filename = feng3d.pathUtils.getNameWithExtension(filepath);
                return filename;
            });
            if (childrenNames.indexOf(childName) == -1)
                return childName;
            var baseName = feng3d.pathUtils.getName(childName);
            var extension = feng3d.pathUtils.getExtension(childName);
            if (extension.length > 0)
                extension = "." + extension;
            var i = 1;
            var newName = baseName + extension;
            while (childrenNames.indexOf(newName) != -1) {
                newName = baseName + i + extension;
                i++;
            }
            return newName;
        };
        /**
         * 获取新子文件路径
         *
         * @param basename 基础名称
         */
        AssetsNode.prototype.getNewChildPath = function (basename) {
            var newName = this.getNewChildFileName(basename);
            var filepath = feng3d.assetsIDPathMap.getPath(this.id);
            var path = feng3d.pathUtils.getChildFilePath(filepath, newName);
            return path;
        };
        /**
         * 新增文件从ArrayBuffer
         *
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        AssetsNode.prototype.addfileFromArrayBuffer = function (filename, arraybuffer, override, callback) {
            var _this = this;
            if (override === void 0) { override = false; }
            var feng3dFile = Object.setValue(new feng3d.ArrayBufferFile(), { name: filename, arraybuffer: arraybuffer });
            var path = this.getNewChildPath(filename);
            feng3d.error("\u672A\u5B9E\u73B0");
            // assets.writeAssets(feng3dFile);
            editor.editorFS.fs.writeArrayBuffer(path, arraybuffer, function (err) {
                var assetsFile = editor.editorAssets.createAssets(_this, filename, feng3dFile);
                callback(err, assetsFile);
            });
        };
        /**
         * 导出
         */
        AssetsNode.prototype.export = function () {
            var zip = new JSZip();
            var path = feng3d.assetsIDPathMap.getPath(this.id);
            if (!feng3d.pathUtils.isDirectory(path))
                path = feng3d.pathUtils.getParentPath(path);
            var filename = this.label;
            editor.editorFS.fs.getAllfilepathInFolder(path, function (err, filepaths) {
                readfiles();
                function readfiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        editor.editorFS.fs.readArrayBuffer(filepath, function (err, data) {
                            //处理文件夹
                            data && zip.file(filepath, data);
                            readfiles();
                        });
                    }
                    else {
                        zip.generateAsync({ type: "blob" }).then(function (content) {
                            saveAs(content, filename + ".zip");
                        });
                    }
                }
            });
        };
        __decorate([
            feng3d.serialize
        ], AssetsNode.prototype, "children", void 0);
        return AssetsNode;
    }(editor.TreeNode));
    editor.AssetsNode = AssetsNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsTreeItemRenderer = /** @class */ (function (_super) {
        __extends(AssetsTreeItemRenderer, _super);
        function AssetsTreeItemRenderer() {
            var _this = _super.call(this) || this;
            _this.skinName = "AssetsTreeItemRenderer";
            return _this;
        }
        AssetsTreeItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.watcher.watch(editor.editorAssets, "showFloder", this.showFloderChanged, this);
            this.showFloderChanged();
        };
        AssetsTreeItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
            feng3d.watcher.unwatch(editor.editorAssets, "showFloder", this.showFloderChanged, this);
        };
        AssetsTreeItemRenderer.prototype.dataChanged = function () {
            var _this = this;
            _super.prototype.dataChanged.call(this);
            if (this.data) {
                editor.drag.register(this, function (dragsource) {
                    dragsource.assetsFiles = [_this.data];
                }, ["assetsFiles"], function (dragdata) {
                    dragdata.assetsFiles.forEach(function (v) {
                        // 移动文件
                        var oldPath = feng3d.assetsIDPathMap.getPath(v.id);
                        var newParentPath = feng3d.assetsIDPathMap.getPath(_this.data.id);
                        var newPath = oldPath.replace(feng3d.pathUtils.getParentPath(oldPath), newParentPath);
                        editor.editorAssets.moveAssets(v, newPath);
                    });
                });
            }
            else {
                editor.drag.unregister(this);
            }
            this.showFloderChanged();
        };
        AssetsTreeItemRenderer.prototype.showFloderChanged = function () {
            this.selected = this.data ? editor.editorAssets.showFloder == this.data : false;
        };
        AssetsTreeItemRenderer.prototype.onclick = function () {
            editor.editorAssets.showFloder = this.data;
        };
        AssetsTreeItemRenderer.prototype.onrightclick = function (e) {
            if (this.data.parent != null) {
                editor.editorAssets.popupmenu(this.data);
            }
            else {
                editor.editorAssets.popupmenu(this.data);
            }
        };
        return AssetsTreeItemRenderer;
    }(editor.TreeItemRenderer));
    editor.AssetsTreeItemRenderer = AssetsTreeItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsView = /** @class */ (function (_super) {
        __extends(AssetsView, _super);
        function AssetsView() {
            var _this = _super.call(this) || this;
            //
            _this._assetstreeInvalid = true;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "AssetsView";
            editor.editorui.assetsview = _this;
            _this.fileDrag = new FileDrag(_this);
            return _this;
        }
        AssetsView.prototype.onComplete = function () {
            this.assetsTreeList.itemRenderer = editor.AssetsTreeItemRenderer;
            this.filelist.itemRenderer = editor.AssetsFileItemRenderer;
            this.floderScroller.viewport = this.filelist;
            this.assetsTreeScroller.viewport = this.assetsTreeList;
            this.listData = this.assetsTreeList.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        };
        AssetsView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.excludeTxt.text = "";
            this.filepathLabel.text = "";
            //
            editor.drag.register(this.filelistgroup, function (dragsource) { }, ["gameobject"], function (dragSource) {
                if (dragSource.gameobject) {
                    var gameobject = feng3d.serialization.clone(dragSource.gameobject);
                    editor.editorAssets.saveObject(gameobject);
                }
            });
            this.initlist();
            //
            this.fileDrag.addEventListener();
            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.selectedfilechanged, this);
        };
        AssetsView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.filelist.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.watcher.unwatch(editor.editorAssets, "showFloder", this.updateShowFloder, this);
            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.selectedfilechanged, this);
            //
            editor.drag.unregister(this.filelistgroup);
            this.fileDrag.removeEventListener();
        };
        AssetsView.prototype.initlist = function () {
            var _this = this;
            editor.editorAssets.initproject(function () {
                _this.invalidateAssetstree();
                editor.editorAssets.rootFile.on("openChanged", _this.invalidateAssetstree, _this);
                editor.editorAssets.rootFile.on("added", _this.invalidateAssetstree, _this);
                editor.editorAssets.rootFile.on("removed", _this.invalidateAssetstree, _this);
                feng3d.watcher.watch(editor.editorAssets, "showFloder", _this.updateShowFloder, _this);
            });
        };
        AssetsView.prototype.update = function () {
            if (this._assetstreeInvalid) {
                this.updateAssetsTree();
                this.updateShowFloder();
                this._assetstreeInvalid = false;
            }
        };
        AssetsView.prototype.invalidateAssetstree = function () {
            this._assetstreeInvalid = true;
            feng3d.ticker.nextframe(this.update, this);
        };
        AssetsView.prototype.updateAssetsTree = function () {
            var folders = editor.editorAssets.rootFile.getFolderList();
            this.listData.replaceAll(folders);
        };
        AssetsView.prototype.updateShowFloder = function (host, property, oldvalue) {
            var _this = this;
            var floder = editor.editorAssets.showFloder;
            if (!floder)
                return;
            var textFlow = new Array();
            do {
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floder.label, style: { "href": "event:" + floder.id } });
                floder = floder.parent;
            } while (floder);
            this.floderpathTxt.textFlow = textFlow;
            var children = editor.editorAssets.showFloder.children;
            try {
                var excludeReg = new RegExp(this.excludeTxt.text);
            }
            catch (error) {
                excludeReg = new RegExp("");
            }
            try {
                var includeReg = new RegExp(this.includeTxt.text);
            }
            catch (error) {
                includeReg = new RegExp("");
            }
            var fileinfos = children.filter(function (value) {
                if (_this.includeTxt.text) {
                    if (!includeReg.test(value.label))
                        return false;
                }
                if (_this.excludeTxt.text) {
                    if (excludeReg.test(value.label))
                        return false;
                }
                return true;
            });
            var nodes = fileinfos.map(function (value) { return value; });
            nodes = nodes.sort(function (a, b) {
                if (a.isDirectory > b.isDirectory)
                    return -1;
                if (a.isDirectory < b.isDirectory)
                    return 1;
                if (a.label < b.label)
                    return -1;
                return 1;
            });
            this.filelistData.replaceAll(nodes);
            this.filelist.scrollV = 0;
            this.selectedfilechanged();
        };
        AssetsView.prototype.onfilter = function () {
            this.updateShowFloder();
        };
        AssetsView.prototype.selectedfilechanged = function () {
            var selectedAssetsFile = editor.editorData.selectedAssetsFile;
            if (selectedAssetsFile.length > 0)
                this.filepathLabel.text = selectedAssetsFile.map(function (v) {
                    var vpath = feng3d.assetsIDPathMap.getPath(v.id);
                    return feng3d.pathUtils.getNameWithExtension(vpath);
                }).join(",");
            else
                this.filepathLabel.text = "";
        };
        AssetsView.prototype.onfilelistclick = function (e) {
            if (e.target == this.filelist) {
                editor.editorData.clearSelectedObjects();
            }
        };
        AssetsView.prototype.onfilelistrightclick = function (e) {
            editor.editorData.clearSelectedObjects();
            editor.editorAssets.popupmenu(editor.editorAssets.showFloder);
        };
        AssetsView.prototype.onfloderpathTxtLink = function (evt) {
            editor.editorAssets.showFloder = editor.editorAssets.getAssetsByID(evt.text);
        };
        AssetsView.prototype.onMouseDown = function (e) {
            if (e.target != this.filelist)
                return;
            this.areaSelectStartPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
        };
        AssetsView.prototype.onMouseMove = function () {
            var areaSelectEndPosition = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            var p = this.filelist.localToGlobal(0, 0);
            var rectangle = new feng3d.Rectangle(p.x, p.y, this.filelist.width, this.filelist.height);
            //
            areaSelectEndPosition = rectangle.clampPoint(areaSelectEndPosition);
            //
            editor.areaSelectRect.show(this.areaSelectStartPosition, areaSelectEndPosition);
            //
            var min = this.areaSelectStartPosition.clone().min(areaSelectEndPosition);
            var max = this.areaSelectStartPosition.clone().max(areaSelectEndPosition);
            var areaRect = new feng3d.Rectangle(min.x, min.y, max.x - min.x, max.y - min.y);
            //
            var datas = this.filelist.$indexToRenderer.filter(function (v) {
                var p = v.localToGlobal(0, 0);
                var rectangle = new feng3d.Rectangle(p.x, p.y, v.width, v.height);
                return areaRect.intersects(rectangle);
            }).map(function (v) { return v.data; });
            editor.editorData.selectMultiObject(datas);
        };
        AssetsView.prototype.onMouseUp = function () {
            editor.areaSelectRect.hide();
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
        };
        return AssetsView;
    }(eui.Component));
    editor.AssetsView = AssetsView;
    var FileDrag = /** @class */ (function () {
        function FileDrag(displayobject) {
            this.addEventListener = function () {
                document.addEventListener("dragenter", dragenter, false);
                document.addEventListener("dragover", dragover, false);
                document.addEventListener("drop", drop, false);
            };
            this.removeEventListener = function () {
                document.removeEventListener("dragenter", dragenter, false);
                document.removeEventListener("dragover", dragover, false);
                document.removeEventListener("drop", drop, false);
            };
            function dragenter(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function dragover(e) {
                e.stopPropagation();
                e.preventDefault();
            }
            function drop(e) {
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                var fileList = dt.files;
                var files = [];
                for (var i = 0; i < fileList.length; i++) {
                    files[i] = fileList[i];
                }
                if (displayobject.getTransformedBounds(displayobject.stage).contains(e.clientX, e.clientY)) {
                    editor.editorAssets.inputFiles(files);
                }
            }
        }
        return FileDrag;
    }());
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsFileTemplates = /** @class */ (function () {
        function AssetsFileTemplates() {
        }
        /**
         *
         * @param scriptName 脚本名称（类名）
         */
        AssetsFileTemplates.prototype.getNewScript = function (scriptName) {
            return scriptTemplate.replace("NewScript", scriptName);
        };
        /**
         *
         * @param shadername shader名称
         */
        AssetsFileTemplates.prototype.getNewShader = function (shadername) {
            return shaderTemplate.replace(new RegExp("NewShader", "g"), shadername);
        };
        return AssetsFileTemplates;
    }());
    editor.AssetsFileTemplates = AssetsFileTemplates;
    editor.assetsFileTemplates = new AssetsFileTemplates();
    var scriptTemplate = "\nclass NewScript extends feng3d.Script\n{\n\n    /** \n     * \u6D4B\u8BD5\u5C5E\u6027 \n     */\n    @feng3d.serialize\n    @feng3d.oav()\n    t_attr = new feng3d.Color4();\n\n    /**\n     * \u521D\u59CB\u5316\u65F6\u8C03\u7528\n     */\n    init()\n    {\n\n    }\n\n    /**\n     * \u66F4\u65B0\n     */\n    update()\n    {\n\n    }\n\n    /**\n     * \u9500\u6BC1\u65F6\u8C03\u7528\n     */\n    dispose()\n    {\n\n    }\n}";
    var shaderTemplate = "\nclass NewShaderUniforms\n{\n    /** \n     * \u989C\u8272 \n     */\n    @feng3d.serialize\n    @feng3d.oav()\n    u_color = new feng3d.Color4();\n}\n\nfeng3d.shaderConfig.shaders[\"NewShader\"] = {\n    cls: NewShaderUniforms,\n    vertex: `\n    \n    attribute vec3 a_position;\n    \n    uniform mat4 u_modelMatrix;\n    uniform mat4 u_viewProjection;\n    \n    void main() {\n    \n        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\n        gl_Position = u_viewProjection * globalPosition;\n    }`,\n    fragment: `\n    \n    precision mediump float;\n    \n    uniform vec4 u_color;\n    \n    void main() {\n        \n        gl_FragColor = u_color;\n    }\n    `,\n};\n\ntype NewShaderMaterial = feng3d.Material & { uniforms: NewShaderUniforms; };\ninterface MaterialFactory\n{\n    create(shader: \"NewShader\", raw?: gPartial<NewShaderMaterial>): NewShaderMaterial;\n}\n\ninterface MaterialRawMap\n{\n    NewShader: gPartial<NewShaderMaterial>;\n}";
})(editor || (editor = {}));
var editor;
(function (editor) {
    var TopView = /** @class */ (function (_super) {
        __extends(TopView, _super);
        function TopView() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "TopView";
            return _this;
        }
        TopView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        TopView.prototype.onAddedToStage = function () {
            this.mainButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.moveButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.addEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.addEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.feng3dDispatcher.on("editor.toolTypeChanged", this.updateview, this);
            this.updateview();
        };
        TopView.prototype.onRemovedFromStage = function () {
            this.mainButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.moveButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.rotateButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.scaleButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.worldButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.centerButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.playBtn.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            this.helpButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.settingButton.removeEventListener(egret.MouseEvent.CLICK, this.onHelpButtonClick, this);
            this.qrcodeButton.removeEventListener(egret.MouseEvent.CLICK, this.onButtonClick, this);
            feng3d.feng3dDispatcher.off("editor.toolTypeChanged", this.updateview, this);
            if (editor.runwin)
                editor.runwin.close();
            editor.runwin = null;
        };
        TopView.prototype.onMainMenu = function (item) {
            feng3d.feng3dDispatcher.dispatch(item.command);
        };
        TopView.prototype.onHelpButtonClick = function () {
            window.open("http://feng3d.com");
        };
        TopView.prototype.onButtonClick = function (event) {
            switch (event.currentTarget) {
                case this.mainButton:
                    editor.menu.popup(editor.mainMenu);
                    break;
                case this.moveButton:
                    editor.editorData.toolType = editor.MRSToolType.MOVE;
                    break;
                case this.rotateButton:
                    editor.editorData.toolType = editor.MRSToolType.ROTATION;
                    break;
                case this.scaleButton:
                    editor.editorData.toolType = editor.MRSToolType.SCALE;
                    break;
                case this.worldButton:
                    editor.editorData.isWoldCoordinate = !editor.editorData.isWoldCoordinate;
                    break;
                case this.centerButton:
                    editor.editorData.isBaryCenter = !editor.editorData.isBaryCenter;
                    break;
                case this.playBtn:
                    editor.editorui.inspectorView.saveShowData(function () {
                        editor.editorFS.fs.writeObject("default.scene.json", editor.engine.scene.gameObject, function (err) {
                            if (err) {
                                feng3d.warn(err);
                                return;
                            }
                            if (editor.editorFS.fs.type == feng3d.FSType.indexedDB) {
                                if (editor.runwin)
                                    editor.runwin.close();
                                editor.runwin = window.open("run.html?fstype=" + feng3d.assets.fs.type + "&project=" + editor.editorcache.projectname);
                                return;
                            }
                            editor.editorFS.fs.getAbsolutePath("index.html", function (err, path) {
                                if (err) {
                                    feng3d.warn(err);
                                    return;
                                }
                                if (editor.runwin)
                                    editor.runwin.close();
                                editor.runwin = window.open(path);
                            });
                        });
                    });
                    break;
                case this.qrcodeButton:
                    setTimeout(function () {
                        $('#output').show();
                    }, 10);
                    break;
            }
        };
        TopView.prototype.updateview = function () {
            this.moveButton.selected = editor.editorData.toolType == editor.MRSToolType.MOVE;
            this.rotateButton.selected = editor.editorData.toolType == editor.MRSToolType.ROTATION;
            this.scaleButton.selected = editor.editorData.toolType == editor.MRSToolType.SCALE;
            this.worldButton.selected = !editor.editorData.isWoldCoordinate;
            this.centerButton.selected = editor.editorData.isBaryCenter;
        };
        return TopView;
    }(eui.Component));
    editor.TopView = TopView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var NavigationView = /** @class */ (function (_super) {
        __extends(NavigationView, _super);
        function NavigationView() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "NavigationView";
            return _this;
        }
        NavigationView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        NavigationView.prototype.onAddedToStage = function () {
        };
        NavigationView.prototype.onRemovedFromStage = function () {
        };
        return NavigationView;
    }(eui.Component));
    editor.NavigationView = NavigationView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MainView = /** @class */ (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            var _this = _super.call(this) || this;
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "MainViewSkin";
            return _this;
        }
        MainView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        MainView.prototype.onAddedToStage = function () {
        };
        MainView.prototype.onRemovedFromStage = function () {
        };
        return MainView;
    }(eui.Component));
    editor.MainView = MainView;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    var AssetAdapter = /** @class */ (function () {
        function AssetAdapter() {
        }
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
            function onGetRes(data) {
                compFunc.call(thisObject, data, source);
            }
            if (RES.hasRes(source)) {
                var data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source, onGetRes, this);
                }
            }
            else {
                RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
            }
        };
        return AssetAdapter;
    }());
    editor.AssetAdapter = AssetAdapter;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    var LoadingUI = /** @class */ (function (_super) {
        __extends(LoadingUI, _super);
        function LoadingUI() {
            var _this = _super.call(this) || this;
            _this.createView();
            return _this;
        }
        LoadingUI.prototype.createView = function () {
            this.textField = new egret.TextField();
            this.addChild(this.textField);
            this.textField.y = 300;
            this.textField.width = 480;
            this.textField.height = 100;
            this.textField.textAlign = "center";
        };
        LoadingUI.prototype.setProgress = function (current, total) {
            this.textField.text = "Loading..." + current + "/" + total;
        };
        return LoadingUI;
    }(egret.Sprite));
    editor.LoadingUI = LoadingUI;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    var MainUI = /** @class */ (function (_super) {
        __extends(MainUI, _super);
        function MainUI(onComplete) {
            if (onComplete === void 0) { onComplete = null; }
            var _this = _super.call(this) || this;
            _this.isThemeLoadEnd = false;
            _this.isResourceLoadEnd = false;
            _this.onComplete = onComplete;
            return _this;
        }
        MainUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            //inject the custom material parser
            //注入自定义的素材解析器
            var assetAdapter = new editor.AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new editor.ThemeAdapter());
            //Config loading process interface
            //设置加载进度界面
            this.loadingView = new editor.LoadingUI();
            this.stage.addChild(this.loadingView);
            // initialize the Resource loading library
            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig("./resource/default.res.json", "./resource/");
        };
        /**
         * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
         * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
         */
        MainUI.prototype.onConfigComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("./resource/default.thm.json", this.stage);
            theme.once(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup("preload");
        };
        /**
         * 主题文件加载完成,开始预加载
         * Loading of theme configuration file is complete, start to pre-load the
         */
        MainUI.prototype.onThemeLoadComplete = function () {
            this.isThemeLoadEnd = true;
            this.createScene();
        };
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        MainUI.prototype.onResourceLoadComplete = function (event) {
            if (event.groupName == "preload") {
                this.stage.removeChild(this.loadingView);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                this.isResourceLoadEnd = true;
                this.createScene();
            }
        };
        MainUI.prototype.createScene = function () {
            if (this.isThemeLoadEnd && this.isResourceLoadEnd && this.onComplete) {
                this.onComplete();
            }
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        MainUI.prototype.onItemLoadError = function (event) {
            feng3d.warn("Url:" + event.resItem.url + " has failed to load");
        };
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        MainUI.prototype.onResourceLoadError = function (event) {
            //TODO
            feng3d.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //ignore loading failed projects
            this.onResourceLoadComplete(event);
        };
        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        MainUI.prototype.onResourceProgress = function (event) {
            if (event.groupName == "preload") {
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        };
        return MainUI;
    }(eui.UILayer));
    editor.MainUI = MainUI;
})(editor || (editor = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var editor;
(function (editor) {
    var ThemeAdapter = /** @class */ (function () {
        function ThemeAdapter() {
        }
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
            function onGetRes(e) {
                compFunc.call(thisObject, e);
            }
            function onError(e) {
                if (e.resItem.url == url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
            }
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
            RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
        };
        return ThemeAdapter;
    }());
    editor.ThemeAdapter = ThemeAdapter;
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.editorui = {};
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 游戏对象控制器类型
     */
    var MRSToolType;
    (function (MRSToolType) {
        /**
         * 移动
         */
        MRSToolType[MRSToolType["MOVE"] = 0] = "MOVE";
        /**
         * 旋转
         */
        MRSToolType[MRSToolType["ROTATION"] = 1] = "ROTATION";
        /**
         * 缩放
         */
        MRSToolType[MRSToolType["SCALE"] = 2] = "SCALE";
    })(MRSToolType = editor.MRSToolType || (editor.MRSToolType = {}));
    /**
     * 编辑器数据
     */
    var EditorData = /** @class */ (function () {
        function EditorData() {
            this._selectedObjects = [];
            this._toolType = MRSToolType.MOVE;
            this._selectedGameObjects = [];
            this._selectedGameObjectsInvalid = true;
            this._isBaryCenter = true;
            this._isWoldCoordinate = false;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._selectedAssetsFile = [];
        }
        Object.defineProperty(EditorData.prototype, "selectedObjects", {
            /**
             * 选中对象，游戏对象与资源文件列表
             * 选中对象时尽量使用 selectObject 方法设置选中对象
             */
            get: function () {
                return this._selectedObjects;
            },
            enumerable: true,
            configurable: true
        });
        EditorData.prototype.clearSelectedObjects = function () {
            this._selectedObjects.length = 0;
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        };
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        EditorData.prototype.selectObject = function (object) {
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd)
                this._selectedObjects.length = 0;
            //
            var index = this._selectedObjects.indexOf(object);
            if (index == -1)
                this._selectedObjects.push(object);
            else
                this._selectedObjects.splice(index, 1);
            //
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        };
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        EditorData.prototype.selectMultiObject = function (objs) {
            var _this = this;
            var isAdd = feng3d.shortcut.keyState.getKeyState("ctrl");
            if (!isAdd)
                this._selectedObjects.length = 0;
            objs.forEach(function (v) {
                var index = _this._selectedObjects.indexOf(v);
                if (index == -1)
                    _this._selectedObjects.push(v);
                else
                    _this._selectedObjects.splice(index, 1);
            });
            this._selectedGameObjectsInvalid = true;
            this._selectedAssetsFileInvalid = true;
            this._transformGameObjectInvalid = true;
            this._transformBoxInvalid = true;
            feng3d.feng3dDispatcher.dispatch("editor.selectedObjectsChanged");
        };
        Object.defineProperty(EditorData.prototype, "toolType", {
            /**
             * 使用的控制工具类型
             */
            get: function () {
                return this._toolType;
            },
            set: function (v) {
                if (this._toolType == v)
                    return;
                this._toolType = v;
                feng3d.feng3dDispatcher.dispatch("editor.toolTypeChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "selectedGameObjects", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var _this = this;
                if (this._selectedGameObjectsInvalid) {
                    this._selectedGameObjects.length = 0;
                    this._selectedObjects.forEach(function (v) {
                        if (v instanceof feng3d.GameObject)
                            _this._selectedGameObjects.push(v);
                    });
                    this._selectedGameObjectsInvalid = false;
                }
                return this._selectedGameObjects;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "isBaryCenter", {
            /**
             * 坐标原点是否在质心
             */
            get: function () {
                return this._isBaryCenter;
            },
            set: function (v) {
                if (this._isBaryCenter == v)
                    return;
                this._isBaryCenter = v;
                this._transformBoxInvalid = true;
                feng3d.feng3dDispatcher.dispatch("editor.isBaryCenterChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "isWoldCoordinate", {
            /**
             * 是否使用世界坐标
             */
            get: function () {
                return this._isWoldCoordinate;
            },
            set: function (v) {
                if (this._isWoldCoordinate == v)
                    return;
                this._isWoldCoordinate = v;
                feng3d.feng3dDispatcher.dispatch("editor.isWoldCoordinateChanged");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "transformGameObject", {
            /**
             * 变换对象
             */
            get: function () {
                if (this._transformGameObjectInvalid) {
                    var length = this.selectedGameObjects.length;
                    if (length > 0)
                        this._transformGameObject = this.selectedGameObjects[length - 1];
                    else
                        this._transformGameObject = null;
                    this._transformGameObjectInvalid = false;
                }
                return this._transformGameObject;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "transformBox", {
            get: function () {
                var _this = this;
                if (this._transformBoxInvalid) {
                    var length = this.selectedGameObjects.length;
                    if (length > 0) {
                        this._transformBox = null;
                        this.selectedGameObjects.forEach(function (cv) {
                            var box = cv.worldBounds;
                            if (editor.editorData.isBaryCenter || _this._transformBox == null) {
                                _this._transformBox = box.clone();
                            }
                            else {
                                _this._transformBox.union(box);
                            }
                        });
                    }
                    else {
                        this._transformBox = null;
                    }
                    this._transformBoxInvalid = false;
                }
                return this._transformBox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "selectedAssetsFile", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var _this = this;
                if (this._selectedAssetsFileInvalid) {
                    this._selectedAssetsFile.length = 0;
                    this._selectedObjects.forEach(function (v) {
                        if (v instanceof editor.AssetsNode)
                            _this._selectedAssetsFile.push(v);
                    });
                    this._selectedAssetsFileInvalid = false;
                }
                return this._selectedAssetsFile;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取编辑器资源绝对路径
         * @param url 编辑器资源相对路径
         */
        EditorData.prototype.getEditorAssetsPath = function (url) {
            return document.URL.substring(0, document.URL.lastIndexOf("/") + 1) + "resource/" + url;
        };
        return EditorData;
    }());
    editor.EditorData = EditorData;
    editor.editorData = new EditorData();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MRSToolTarget = /** @class */ (function () {
        function MRSToolTarget() {
            this._startScaleVec = [];
            this._position = new feng3d.Vector3();
            this._rotation = new feng3d.Vector3();
            feng3d.feng3dDispatcher.on("editor.isWoldCoordinateChanged", this.updateControllerImage, this);
            feng3d.feng3dDispatcher.on("editor.isBaryCenterChanged", this.updateControllerImage, this);
            //
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
        }
        Object.defineProperty(MRSToolTarget.prototype, "controllerTool", {
            get: function () {
                return this._controllerTool;
            },
            set: function (value) {
                this._controllerTool = value;
                if (this._controllerTool) {
                    this._controllerTool.position = this._position;
                    this._controllerTool.rotation = this._rotation;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MRSToolTarget.prototype, "controllerTargets", {
            set: function (value) {
                this._controllerTargets = value;
                this.updateControllerImage();
            },
            enumerable: true,
            configurable: true
        });
        MRSToolTarget.prototype.onSelectedGameObjectChange = function () {
            //筛选出 工具控制的对象
            var transforms = editor.editorData.selectedGameObjects.reduce(function (result, item) {
                result.push(item.transform);
                return result;
            }, []);
            if (transforms.length > 0) {
                this.controllerTargets = transforms;
            }
            else {
                this.controllerTargets = null;
            }
        };
        MRSToolTarget.prototype.updateControllerImage = function () {
            if (!this._controllerTargets || this._controllerTargets.length == 0)
                return;
            var transform = this._controllerTargets[this._controllerTargets.length - 1];
            var position = new feng3d.Vector3();
            if (editor.editorData.isBaryCenter) {
                position.copy(transform.scenePosition);
            }
            else {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    position.add(this._controllerTargets[i].scenePosition);
                }
                position.scaleNumber(1 / this._controllerTargets.length);
            }
            var rotation = new feng3d.Vector3();
            if (!editor.editorData.isWoldCoordinate) {
                rotation = this._controllerTargets[0].rotation;
            }
            this._position = position;
            this._rotation = rotation;
            if (this._controllerTool) {
                this._controllerTool.position = position;
                this._controllerTool.rotation = rotation;
            }
        };
        /**
         * 开始移动
         */
        MRSToolTarget.prototype.startTranslation = function () {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        };
        MRSToolTarget.prototype.translation = function (addPos) {
            if (!this._controllerTargets)
                return;
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var gameobject = objects[i];
                var transform = this._startTransformDic.get(gameobject);
                var localMove = addPos.clone();
                if (gameobject.parent)
                    localMove = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localMove);
                gameobject.position = transform.position.addTo(localMove);
            }
        };
        MRSToolTarget.prototype.stopTranslation = function () {
            this._startTransformDic = null;
        };
        MRSToolTarget.prototype.startRotate = function () {
            this._startTransformDic = new Map();
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            for (var i = 0; i < objects.length; i++) {
                var transform = objects[i];
                this._startTransformDic.set(transform, this.getTransformData(transform));
            }
        };
        /**
         * 绕指定轴旋转
         * @param angle 旋转角度
         * @param normal 旋转轴
         */
        MRSToolTarget.prototype.rotate1 = function (angle, normal) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var localnormal;
            var gameobject = objects[0];
            if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                    gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                }
                else {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (editor.editorData.isBaryCenter) {
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempTransform.position.x, tempTransform.position.y, tempTransform.position.z).appendRotation(localnormal, angle, localPivotPoint).position;
                        gameobject.rotation = this.rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                }
            }
        };
        /**
         * 按指定角旋转
         * @param angle1 第一方向旋转角度
         * @param normal1 第一方向旋转轴
         * @param angle2 第二方向旋转角度
         * @param normal2 第二方向旋转轴
         */
        MRSToolTarget.prototype.rotate2 = function (angle1, normal1, angle2, normal2) {
            var objects = this._controllerTargets.concat();
            objects.push(this._controllerTool);
            var gameobject = objects[0];
            if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                if (gameobject.parent) {
                    normal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal1);
                    normal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal2);
                }
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempsceneTransform = this._startTransformDic.get(gameobject);
                var tempPosition = tempsceneTransform.position.clone();
                var tempRotation = tempsceneTransform.rotation.clone();
                if (!editor.editorData.isWoldCoordinate && editor.editorData.isBaryCenter) {
                    tempRotation = this.rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = this.rotateRotation(tempRotation, normal1, angle1);
                }
                else {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent) {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (editor.editorData.isBaryCenter) {
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                    else {
                        var localPivotPoint = this._position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempPosition.x, tempPosition.y, tempPosition.z).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        tempRotation = this.rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = this.rotateRotation(tempRotation, localnormal2, angle2);
                    }
                }
            }
        };
        MRSToolTarget.prototype.stopRote = function () {
            this._startTransformDic = null;
        };
        MRSToolTarget.prototype.startScale = function () {
            for (var i = 0; i < this._controllerTargets.length; i++) {
                this._startScaleVec[i] = this._controllerTargets[i].scale.clone();
            }
        };
        MRSToolTarget.prototype.doScale = function (scale) {
            feng3d.debuger && feng3d.assert(!!scale.length);
            for (var i = 0; i < this._controllerTargets.length; i++) {
                var result = this._startScaleVec[i].multiplyTo(scale);
                this._controllerTargets[i].sx = result.x;
                this._controllerTargets[i].sy = result.y;
                this._controllerTargets[i].sz = result.z;
            }
        };
        MRSToolTarget.prototype.stopScale = function () {
            this._startScaleVec.length = 0;
        };
        MRSToolTarget.prototype.getTransformData = function (transform) {
            return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
        };
        MRSToolTarget.prototype.rotateRotation = function (rotation, axis, angle) {
            var rotationmatrix3d = new feng3d.Matrix4x4();
            rotationmatrix3d.appendRotation(feng3d.Vector3.X_AXIS, rotation.x);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Y_AXIS, rotation.y);
            rotationmatrix3d.appendRotation(feng3d.Vector3.Z_AXIS, rotation.z);
            rotationmatrix3d.appendRotation(axis, angle);
            var newrotation = rotationmatrix3d.decompose()[1];
            newrotation.scaleNumber(180 / Math.PI);
            var v = Math.round((newrotation.x - rotation.x) / 180);
            if (v % 2 != 0) {
                newrotation.x += 180;
                newrotation.y = 180 - newrotation.y;
                newrotation.z += 180;
            }
            function toround(a, b, c) {
                if (c === void 0) { c = 360; }
                return Math.round((b - a) / c) * c + a;
            }
            newrotation.x = toround(newrotation.x, rotation.x);
            newrotation.y = toround(newrotation.y, rotation.y);
            newrotation.z = toround(newrotation.z, rotation.z);
            return newrotation;
        };
        return MRSToolTarget;
    }());
    editor.MRSToolTarget = MRSToolTarget;
    editor.mrsToolTarget = new MRSToolTarget();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 移动工具模型组件
     */
    var MToolModel = /** @class */ (function (_super) {
        __extends(MToolModel, _super);
        function MToolModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MToolModel.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "GameObjectMoveModel";
            this.initModels();
        };
        MToolModel.prototype.initModels = function () {
            this.xAxis = Object.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = Object.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = Object.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);
            this.yzPlane = Object.setValue(new feng3d.GameObject(), { name: "yzPlane" }).addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0, 1);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);
            this.xzPlane = Object.setValue(new feng3d.GameObject(), { name: "xzPlane" }).addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.xzPlane.gameObject);
            this.xyPlane = Object.setValue(new feng3d.GameObject(), { name: "xyPlane" }).addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);
            this.oCube = Object.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(CoordinateCube);
            this.gameObject.addChild(this.oCube.gameObject);
        };
        return MToolModel;
    }(feng3d.Component));
    editor.MToolModel = MToolModel;
    var CoordinateAxis = /** @class */ (function (_super) {
        __extends(CoordinateAxis, _super);
        function CoordinateAxis() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            _this.length = 100;
            //
            _this.selected = false;
            return _this;
        }
        CoordinateAxis.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Model);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.length, 0) });
            this.segmentMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true } });
            this.gameObject.addChild(xLine);
            //
            this.xArrow = new feng3d.GameObject();
            model = this.xArrow.addComponent(feng3d.Model);
            model.geometry = Object.setValue(new feng3d.ConeGeometry(), { bottomRadius: 5, height: 18 });
            this.material = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
            this.material.renderParams.enableBlend = true;
            this.xArrow.transform.y = this.length;
            this.gameObject.addChild(this.xArrow);
            var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hitCoordinateAxis" });
            model = mouseHit.addComponent(feng3d.Model);
            model.geometry = Object.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length });
            //model.material = materialFactory.create("color");
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        };
        CoordinateAxis.prototype.update = function () {
            if (!this.isinit)
                return;
            var color = this.selected ? this.selectedColor : this.color;
            this.segmentMaterial.uniforms.u_segmentColor = color;
            //
            this.material.uniforms.u_diffuseInput = color;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateAxis.prototype, "selected", void 0);
        return CoordinateAxis;
    }(feng3d.Component));
    editor.CoordinateAxis = CoordinateAxis;
    var CoordinateCube = /** @class */ (function (_super) {
        __extends(CoordinateCube, _super);
        function CoordinateCube() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isinit = false;
            _this.color = new feng3d.Color4(1, 1, 1, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            _this.selected = false;
            return _this;
        }
        CoordinateCube.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            //
            this.oCube = new feng3d.GameObject();
            var model = this.oCube.addComponent(feng3d.Model);
            model.geometry = Object.setValue(new feng3d.CubeGeometry(), { width: 8, height: 8, depth: 8 });
            this.colorMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
            this.colorMaterial.renderParams.enableBlend = true;
            this.oCube.mouseEnabled = true;
            this.gameObject.addChild(this.oCube);
            this.isinit = true;
            this.update();
        };
        CoordinateCube.prototype.update = function () {
            if (!this.isinit)
                return;
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateCube.prototype, "selected", void 0);
        return CoordinateCube;
    }(feng3d.Component));
    editor.CoordinateCube = CoordinateCube;
    var CoordinatePlane = /** @class */ (function (_super) {
        __extends(CoordinatePlane, _super);
        function CoordinatePlane() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = new feng3d.Color4(1, 0, 0, 0.2);
            _this.borderColor = new feng3d.Color4(1, 0, 0, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 0, 0, 0.5);
            _this.selectedborderColor = new feng3d.Color4(1, 1, 0, 0.99);
            _this._width = 20;
            //
            _this.selected = false;
            return _this;
        }
        Object.defineProperty(CoordinatePlane.prototype, "width", {
            //
            get: function () { return this._width; },
            enumerable: true,
            configurable: true
        });
        CoordinatePlane.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var plane = Object.setValue(new feng3d.GameObject(), { name: "plane" });
            var model = plane.addComponent(feng3d.Model);
            plane.transform.x = plane.transform.z = this._width / 2;
            model.geometry = Object.setValue(new feng3d.PlaneGeometry(), { width: this._width, height: this._width });
            this.colorMaterial = model.material = Object.setValue(new feng3d.Material(), { shaderName: "color" });
            this.colorMaterial.renderParams.cullFace = feng3d.CullFace.NONE;
            this.colorMaterial.renderParams.enableBlend = true;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);
            var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Model);
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.gameObject.addChild(border);
            this.isinit = true;
            this.update();
        };
        CoordinatePlane.prototype.update = function () {
            if (!this.isinit)
                return;
            this.colorMaterial.uniforms.u_diffuseInput = this.selected ? this.selectedColor : this.color;
            var color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(0, 0, 0), end: new feng3d.Vector3(this._width, 0, 0), startColor: color, endColor: color }];
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, 0), end: new feng3d.Vector3(this._width, 0, this._width), startColor: color, endColor: color });
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(this._width, 0, this._width), end: new feng3d.Vector3(0, 0, this._width), startColor: color, endColor: color });
            color = this.selected ? this.selectedborderColor : this.borderColor;
            this.segmentGeometry.segments.push({ start: new feng3d.Vector3(0, 0, this._width), end: new feng3d.Vector3(0, 0, 0), startColor: color, endColor: color });
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinatePlane.prototype, "selected", void 0);
        return CoordinatePlane;
    }(feng3d.Component));
    editor.CoordinatePlane = CoordinatePlane;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 旋转工具模型组件
     */
    var RToolModel = /** @class */ (function (_super) {
        __extends(RToolModel, _super);
        function RToolModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RToolModel.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "GameObjectRotationModel";
            this.initModels();
        };
        RToolModel.prototype.initModels = function () {
            this.xAxis = Object.setValue(new feng3d.GameObject(), { name: "xAxis" }).addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = Object.setValue(new feng3d.GameObject(), { name: "yAxis" }).addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = Object.setValue(new feng3d.GameObject(), { name: "zAxis" }).addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);
            this.cameraAxis = Object.setValue(new feng3d.GameObject(), { name: "cameraAxis" }).addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);
            this.freeAxis = Object.setValue(new feng3d.GameObject(), { name: "freeAxis" }).addComponent(CoordinateRotationFreeAxis);
            this.freeAxis.color.setTo(1, 1, 1);
            this.freeAxis.update();
            this.gameObject.addChild(this.freeAxis.gameObject);
        };
        return RToolModel;
    }(feng3d.Component));
    editor.RToolModel = RToolModel;
    var CoordinateRotationAxis = /** @class */ (function (_super) {
        __extends(CoordinateRotationAxis, _super);
        function CoordinateRotationAxis() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.radius = 80;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            _this.selected = false;
            return _this;
        }
        CoordinateRotationAxis.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initModels();
        };
        CoordinateRotationAxis.prototype.initModels = function () {
            var border = new feng3d.GameObject();
            var model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = Object.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            this.torusGeometry = model.geometry = Object.setValue(new feng3d.TorusGeometry(), { radius: this.radius, tubeRadius: 2 });
            model.material = new feng3d.Material();
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        };
        CoordinateRotationAxis.prototype.update = function () {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            this.torusGeometry.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            if (this.filterNormal) {
                var localNormal = inverseGlobalMatrix3D.deltaTransformVector(this.filterNormal);
            }
            this.segmentGeometry.segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    var show = true;
                    if (localNormal) {
                        show = points[i - 1].dot(localNormal) > 0 && points[i].dot(localNormal) > 0;
                    }
                    if (show) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                    }
                    else if (this.selected) {
                        this.segmentGeometry.segments.push({ start: points[i - 1], end: points[i], startColor: this.backColor, endColor: this.backColor });
                    }
                }
            }
        };
        CoordinateRotationAxis.prototype.showSector = function (startPos, endPos) {
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var localStartPos = inverseGlobalMatrix3D.transformVector(startPos);
            var localEndPos = inverseGlobalMatrix3D.transformVector(endPos);
            var startAngle = Math.atan2(localStartPos.y, localStartPos.x) * feng3d.FMath.RAD2DEG;
            var endAngle = Math.atan2(localEndPos.y, localEndPos.x) * feng3d.FMath.RAD2DEG;
            //
            var min = Math.min(startAngle, endAngle);
            var max = Math.max(startAngle, endAngle);
            if (max - min > 180) {
                min += 360;
            }
            this.sector.update(min, max);
            this.gameObject.addChild(this.sector.gameObject);
        };
        CoordinateRotationAxis.prototype.hideSector = function () {
            if (this.sector.gameObject.parent)
                this.sector.gameObject.parent.removeChild(this.sector.gameObject);
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationAxis.prototype, "selected", void 0);
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationAxis.prototype, "filterNormal", void 0);
        return CoordinateRotationAxis;
    }(feng3d.Component));
    editor.CoordinateRotationAxis = CoordinateRotationAxis;
    /**
     * 扇形对象
     */
    var SectorGameObject = /** @class */ (function (_super) {
        __extends(SectorGameObject, _super);
        function SectorGameObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.borderColor = new feng3d.Color4(0, 1, 1, 0.6);
            _this.radius = 80;
            _this._start = 0;
            _this._end = 0;
            return _this;
        }
        /**
         * 构建3D对象
         */
        SectorGameObject.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "sector";
            var model = this.gameObject.addComponent(feng3d.Model);
            this.geometry = model.geometry = new feng3d.CustomGeometry();
            model.material = Object.setValue(new feng3d.Material(), { shaderName: "color", uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            model.material.renderParams.enableBlend = true;
            model.material.renderParams.cullFace = feng3d.CullFace.NONE;
            var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
            model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.isinit = true;
            this.update(0, 0);
        };
        SectorGameObject.prototype.update = function (start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 0; }
            if (!this.isinit)
                return;
            this._start = Math.min(start, end);
            this._end = Math.max(start, end);
            var length = Math.floor(this._end - this._start);
            if (length == 0)
                length = 1;
            var vertexPositionData = [];
            var indices = [];
            vertexPositionData[0] = 0;
            vertexPositionData[1] = 0;
            vertexPositionData[2] = 0;
            for (var i = 0; i < length; i++) {
                vertexPositionData[i * 3 + 3] = this.radius * Math.cos((i + this._start) * feng3d.FMath.DEG2RAD);
                vertexPositionData[i * 3 + 4] = this.radius * Math.sin((i + this._start) * feng3d.FMath.DEG2RAD);
                vertexPositionData[i * 3 + 5] = 0;
                if (i > 0) {
                    indices[(i - 1) * 3] = 0;
                    indices[(i - 1) * 3 + 1] = i;
                    indices[(i - 1) * 3 + 2] = i + 1;
                }
            }
            if (indices.length == 0)
                indices = [0, 0, 0];
            this.geometry.setVAData("a_position", vertexPositionData, 3);
            this.geometry.indices = indices;
            //绘制边界
            var startPoint = new feng3d.Vector3(this.radius * Math.cos((this._start - 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._start - 0.1) * feng3d.FMath.DEG2RAD), 0);
            var endPoint = new feng3d.Vector3(this.radius * Math.cos((this._end + 0.1) * feng3d.FMath.DEG2RAD), this.radius * Math.sin((this._end + 0.1) * feng3d.FMath.DEG2RAD), 0);
            //
            this.segmentGeometry.segments = [
                { start: new feng3d.Vector3(), end: startPoint, startColor: this.borderColor, endColor: this.borderColor },
                { start: new feng3d.Vector3(), end: endPoint, startColor: this.borderColor, endColor: this.borderColor },
            ];
        };
        return SectorGameObject;
    }(feng3d.Component));
    editor.SectorGameObject = SectorGameObject;
    var CoordinateRotationFreeAxis = /** @class */ (function (_super) {
        __extends(CoordinateRotationFreeAxis, _super);
        function CoordinateRotationFreeAxis() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.radius = 80;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.backColor = new feng3d.Color4(0.6, 0.6, 0.6, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            //
            _this.selected = false;
            return _this;
        }
        CoordinateRotationFreeAxis.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initModels();
        };
        CoordinateRotationFreeAxis.prototype.initModels = function () {
            var border = Object.setValue(new feng3d.GameObject(), { name: "border" });
            var model = border.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) }
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = Object.setValue(new feng3d.GameObject(), { name: "sector" }).addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.gameObject.addChild(this.sector.gameObject);
            this.isinit = true;
            this.update();
        };
        CoordinateRotationFreeAxis.prototype.update = function () {
            if (!this.isinit)
                return;
            this.sector.radius = this.radius;
            var color = this.selected ? this.selectedColor : this.color;
            var inverseGlobalMatrix3D = this.transform.worldToLocalMatrix;
            var segments = [];
            var points = [];
            for (var i = 0; i <= 360; i++) {
                points[i] = new feng3d.Vector3(Math.sin(i * feng3d.FMath.DEG2RAD), Math.cos(i * feng3d.FMath.DEG2RAD), 0);
                points[i].scaleNumber(this.radius);
                if (i > 0) {
                    segments.push({ start: points[i - 1], end: points[i], startColor: color, endColor: color });
                }
            }
            this.segmentGeometry.segments = segments;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateRotationFreeAxis.prototype, "selected", void 0);
        return CoordinateRotationFreeAxis;
    }(feng3d.Component));
    editor.CoordinateRotationFreeAxis = CoordinateRotationFreeAxis;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 缩放工具模型组件
     */
    var SToolModel = /** @class */ (function (_super) {
        __extends(SToolModel, _super);
        function SToolModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SToolModel.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.gameObject.name = "GameObjectScaleModel";
            this.initModels();
        };
        SToolModel.prototype.initModels = function () {
            this.xCube = Object.setValue(new feng3d.GameObject(), { name: "xCube" }).addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);
            this.yCube = Object.setValue(new feng3d.GameObject(), { name: "yCube" }).addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);
            this.zCube = Object.setValue(new feng3d.GameObject(), { name: "zCube" }).addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);
            this.oCube = Object.setValue(new feng3d.GameObject(), { name: "oCube" }).addComponent(editor.CoordinateCube);
            this.oCube.gameObject.transform.scale = new feng3d.Vector3(1.2, 1.2, 1.2);
            this.gameObject.addChild(this.oCube.gameObject);
        };
        return SToolModel;
    }(feng3d.Component));
    editor.SToolModel = SToolModel;
    var CoordinateScaleCube = /** @class */ (function (_super) {
        __extends(CoordinateScaleCube, _super);
        function CoordinateScaleCube() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = new feng3d.Color4(1, 0, 0, 0.99);
            _this.selectedColor = new feng3d.Color4(1, 1, 0, 0.99);
            _this.length = 100;
            //
            _this.selected = false;
            //
            _this.scaleValue = 1;
            return _this;
        }
        CoordinateScaleCube.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var xLine = new feng3d.GameObject();
            var model = xLine.addComponent(feng3d.Model);
            var material = model.material = Object.setValue(new feng3d.Material(), {
                shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
                uniforms: { u_segmentColor: new feng3d.Color4(1, 1, 1, 0.99) },
            });
            material.renderParams.enableBlend = true;
            this.segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = Object.setValue(new feng3d.GameObject(), { name: "coordinateCube" }).addComponent(editor.CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);
            var mouseHit = Object.setValue(new feng3d.GameObject(), { name: "hit" });
            model = mouseHit.addComponent(feng3d.Model);
            model.geometry = Object.setValue(new feng3d.CylinderGeometry(), { topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            this.gameObject.addChild(mouseHit);
            this.isinit = true;
            this.update();
        };
        CoordinateScaleCube.prototype.update = function () {
            if (!this.isinit)
                return;
            this.coordinateCube.color = this.color;
            this.coordinateCube.selectedColor = this.selectedColor;
            this.coordinateCube.update();
            this.segmentGeometry.segments = [{ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.scaleValue * this.length, 0), startColor: this.color, endColor: this.color }];
            //
            this.coordinateCube.transform.y = this.length * this.scaleValue;
            this.coordinateCube.selected = this.selected;
        };
        __decorate([
            feng3d.watch("update")
        ], CoordinateScaleCube.prototype, "selected", void 0);
        __decorate([
            feng3d.watch("update")
        ], CoordinateScaleCube.prototype, "scaleValue", void 0);
        return CoordinateScaleCube;
    }(feng3d.Component));
    editor.CoordinateScaleCube = CoordinateScaleCube;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MRSToolBase = /** @class */ (function (_super) {
        __extends(MRSToolBase, _super);
        function MRSToolBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ismouseDown = false;
            return _this;
        }
        MRSToolBase.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var holdSizeComponent = this.gameObject.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.holdSize = 1;
            holdSizeComponent.camera = editor.editorCamera;
            //
            this.on("addedToScene", this.onAddedToScene, this);
            this.on("removedFromScene", this.onRemovedFromScene, this);
        };
        MRSToolBase.prototype.onAddedToScene = function () {
            editor.mrsToolTarget.controllerTool = this.transform;
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            feng3d.ticker.onframe(this.updateToolModel, this);
        };
        MRSToolBase.prototype.onRemovedFromScene = function () {
            editor.mrsToolTarget.controllerTool = null;
            //
            feng3d.windowEventProxy.off("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.off("mouseup", this.onMouseUp, this);
            feng3d.ticker.offframe(this.updateToolModel, this);
        };
        MRSToolBase.prototype.onItemMouseDown = function (event) {
            feng3d.shortcut.activityState("inTransforming");
        };
        Object.defineProperty(MRSToolBase.prototype, "toolModel", {
            get: function () {
                return this._toolModel;
            },
            set: function (value) {
                if (this._toolModel)
                    this.gameObject.removeChild(this._toolModel.gameObject);
                this._toolModel = value;
                ;
                if (this._toolModel) {
                    this.gameObject.addChild(this._toolModel.gameObject);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MRSToolBase.prototype, "selectedItem", {
            get: function () {
                return this._selectedItem;
            },
            set: function (value) {
                if (this._selectedItem == value)
                    return;
                if (this._selectedItem)
                    this._selectedItem.selected = false;
                this._selectedItem = value;
                if (this._selectedItem)
                    this._selectedItem.selected = true;
            },
            enumerable: true,
            configurable: true
        });
        MRSToolBase.prototype.updateToolModel = function () {
        };
        MRSToolBase.prototype.onMouseDown = function () {
            this.selectedItem = null;
            this.ismouseDown = true;
        };
        MRSToolBase.prototype.onMouseUp = function () {
            this.ismouseDown = false;
            this.movePlane3D = null;
            this.startSceneTransform = null;
            feng3d.ticker.nextframe(function () {
                feng3d.shortcut.deactivityState("inTransforming");
            });
        };
        /**
         * 获取鼠标射线与移动平面的交点（模型空间）
         */
        MRSToolBase.prototype.getLocalMousePlaneCross = function () {
            //射线与平面交点
            var crossPos = this.getMousePlaneCross();
            //把交点从世界转换为模型空间
            var inverseGlobalMatrix3D = this.startSceneTransform.clone();
            inverseGlobalMatrix3D.invert();
            crossPos = inverseGlobalMatrix3D.transformVector(crossPos);
            return crossPos;
        };
        MRSToolBase.prototype.getMousePlaneCross = function () {
            var line3D = editor.editorCamera.getMouseRay3D();
            //射线与平面交点
            var crossPos = this.movePlane3D.intersectWithLine3D(line3D);
            return crossPos;
        };
        return MRSToolBase;
    }(feng3d.Component));
    editor.MRSToolBase = MRSToolBase;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 位移工具
     */
    var MTool = /** @class */ (function (_super) {
        __extends(MTool, _super);
        function MTool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 用于判断是否改变了XYZ
             */
            _this.changeXYZ = new feng3d.Vector3();
            return _this;
        }
        MTool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.toolModel = new feng3d.GameObject().addComponent(editor.MToolModel);
        };
        MTool.prototype.onAddedToScene = function () {
            _super.prototype.onAddedToScene.call(this);
            this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        };
        MTool.prototype.onRemovedFromScene = function () {
            _super.prototype.onRemovedFromScene.call(this);
            this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yzPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xzPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.xyPlane.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
        };
        MTool.prototype.onItemMouseDown = function (event) {
            if (!editor.engine.mouseinview)
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            _super.prototype.onItemMouseDown.call(this, event);
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix3D.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix3D.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane3D();
            //
            switch (event.currentTarget) {
                case this.toolModel.xAxis:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.init(1, 0, 0);
                    break;
                case this.toolModel.yAxis:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.init(0, 1, 0);
                    break;
                case this.toolModel.zAxis:
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.init(0, 0, 1);
                    break;
                case this.toolModel.yzPlane:
                    this.selectedItem = this.toolModel.yzPlane;
                    this.movePlane3D.fromPoints(po, py, pz);
                    this.changeXYZ.init(0, 1, 1);
                    break;
                case this.toolModel.xzPlane:
                    this.selectedItem = this.toolModel.xzPlane;
                    this.movePlane3D.fromPoints(po, px, pz);
                    this.changeXYZ.init(1, 0, 1);
                    break;
                case this.toolModel.xyPlane:
                    this.selectedItem = this.toolModel.xyPlane;
                    this.movePlane3D.fromPoints(po, px, py);
                    this.changeXYZ.init(1, 1, 0);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, po);
                    this.changeXYZ.init(1, 1, 1);
                    break;
            }
            //
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            this.startPos = this.toolModel.transform.position;
            editor.mrsToolTarget.startTranslation();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        };
        MTool.prototype.onMouseMove = function () {
            var crossPos = this.getLocalMousePlaneCross();
            var addPos = crossPos.subTo(this.startPlanePos);
            addPos.x *= this.changeXYZ.x;
            addPos.y *= this.changeXYZ.y;
            addPos.z *= this.changeXYZ.z;
            var sceneTransform = this.startSceneTransform.clone();
            sceneTransform.prependTranslation(addPos.x, addPos.y, addPos.z);
            var sceneAddpos = sceneTransform.position.subTo(this.startSceneTransform.position);
            editor.mrsToolTarget.translation(sceneAddpos);
        };
        MTool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            editor.mrsToolTarget.stopTranslation();
            this.startPos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        };
        MTool.prototype.updateToolModel = function () {
            //鼠标按下时不更新
            if (this.ismouseDown)
                return;
            var cameraPos = editor.editorCamera.transform.scenePosition;
            var localCameraPos = this.toolModel.transform.worldToLocalMatrix.transformVector(cameraPos);
            this.toolModel.xyPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xyPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.xyPlane.width;
            this.toolModel.xzPlane.transform.x = localCameraPos.x > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.xzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.xzPlane.width;
            this.toolModel.yzPlane.transform.y = localCameraPos.y > 0 ? 0 : -this.toolModel.yzPlane.width;
            this.toolModel.yzPlane.transform.z = localCameraPos.z > 0 ? 0 : -this.toolModel.yzPlane.width;
        };
        return MTool;
    }(editor.MRSToolBase));
    editor.MTool = MTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var RTool = /** @class */ (function (_super) {
        __extends(RTool, _super);
        function RTool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RTool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.toolModel = new feng3d.GameObject().addComponent(editor.RToolModel);
        };
        RTool.prototype.onAddedToScene = function () {
            _super.prototype.onAddedToScene.call(this);
            this.toolModel.xAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.on("mousedown", this.onItemMouseDown, this);
        };
        RTool.prototype.onRemovedFromScene = function () {
            _super.prototype.onRemovedFromScene.call(this);
            this.toolModel.xAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.freeAxis.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.cameraAxis.off("mousedown", this.onItemMouseDown, this);
        };
        RTool.prototype.onItemMouseDown = function (event) {
            if (!editor.engine.mouseinview)
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            _super.prototype.onItemMouseDown.call(this, event);
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var pos = globalMatrix3D.position;
            var xDir = globalMatrix3D.right;
            var yDir = globalMatrix3D.up;
            var zDir = globalMatrix3D.forward;
            //摄像机前方方向
            var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            var cameraPos = cameraSceneTransform.position;
            this.movePlane3D = new feng3d.Plane3D();
            switch (event.currentTarget) {
                case this.toolModel.xAxis:
                    this.selectedItem = this.toolModel.xAxis;
                    this.movePlane3D.fromNormalAndPoint(xDir, pos);
                    break;
                case this.toolModel.yAxis:
                    this.selectedItem = this.toolModel.yAxis;
                    this.movePlane3D.fromNormalAndPoint(yDir, pos);
                    break;
                case this.toolModel.zAxis:
                    this.selectedItem = this.toolModel.zAxis;
                    this.selectedItem = this.toolModel.zAxis;
                    this.movePlane3D.fromNormalAndPoint(zDir, pos);
                    break;
                case this.toolModel.freeAxis:
                    this.selectedItem = this.toolModel.freeAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
                case this.toolModel.cameraAxis:
                    this.selectedItem = this.toolModel.cameraAxis;
                    this.movePlane3D.fromNormalAndPoint(cameraDir, pos);
                    break;
            }
            this.startPlanePos = this.getMousePlaneCross();
            this.stepPlaneCross = this.startPlanePos.clone();
            //
            this.startMousePos = editor.engine.mousePos.clone();
            this.startSceneTransform = globalMatrix3D.clone();
            editor.mrsToolTarget.startRotate();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        };
        RTool.prototype.onMouseMove = function () {
            switch (this.selectedItem) {
                case this.toolModel.xAxis:
                case this.toolModel.yAxis:
                case this.toolModel.zAxis:
                case this.toolModel.cameraAxis:
                    var origin = this.startSceneTransform.position;
                    var planeCross = this.getMousePlaneCross();
                    var startDir = this.stepPlaneCross.subTo(origin);
                    startDir.normalize();
                    var endDir = planeCross.subTo(origin);
                    endDir.normalize();
                    //计算夹角
                    var cosValue = startDir.dot(endDir);
                    var angle = Math.acos(cosValue) * feng3d.FMath.RAD2DEG;
                    //计算是否顺时针
                    var sign = this.movePlane3D.getNormal().cross(startDir).dot(endDir);
                    sign = sign > 0 ? 1 : -1;
                    angle = angle * sign;
                    //
                    editor.mrsToolTarget.rotate1(angle, this.movePlane3D.getNormal());
                    this.stepPlaneCross.copy(planeCross);
                    editor.mrsToolTarget.startRotate();
                    //绘制扇形区域
                    if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                        this.selectedItem.showSector(this.startPlanePos, planeCross);
                    }
                    break;
                case this.toolModel.freeAxis:
                    var endPoint = editor.engine.mousePos.clone();
                    var offset = endPoint.subTo(this.startMousePos);
                    var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
                    var right = cameraSceneTransform.right;
                    var up = cameraSceneTransform.up;
                    editor.mrsToolTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    editor.mrsToolTarget.startRotate();
                    break;
            }
        };
        RTool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                this.selectedItem.hideSector();
            }
            editor.mrsToolTarget.stopRote();
            this.startMousePos = null;
            this.startPlanePos = null;
            this.startSceneTransform = null;
        };
        RTool.prototype.updateToolModel = function () {
            var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix.clone();
            var cameraDir = cameraSceneTransform.forward;
            cameraDir.negate();
            //
            var xyzAxis = [this.toolModel.xAxis, this.toolModel.yAxis, this.toolModel.zAxis];
            for (var i = 0; i < xyzAxis.length; i++) {
                var axis = xyzAxis[i];
                axis.filterNormal = cameraDir;
            }
            //朝向摄像机
            var temp = cameraSceneTransform.clone();
            temp.append(this.toolModel.transform.worldToLocalMatrix);
            var rotation = temp.decompose()[1];
            rotation.scaleNumber(feng3d.FMath.RAD2DEG);
            this.toolModel.freeAxis.transform.rotation = rotation;
            this.toolModel.cameraAxis.transform.rotation = rotation;
        };
        return RTool;
    }(editor.MRSToolBase));
    editor.RTool = RTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var STool = /** @class */ (function (_super) {
        __extends(STool, _super);
        function STool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 用于判断是否改变了XYZ
             */
            _this.changeXYZ = new feng3d.Vector3();
            return _this;
        }
        STool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.toolModel = new feng3d.GameObject().addComponent(editor.SToolModel);
        };
        STool.prototype.onAddedToScene = function () {
            _super.prototype.onAddedToScene.call(this);
            this.toolModel.xCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.on("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.on("mousedown", this.onItemMouseDown, this);
        };
        STool.prototype.onRemovedFromScene = function () {
            _super.prototype.onRemovedFromScene.call(this);
            this.toolModel.xCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.yCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.zCube.off("mousedown", this.onItemMouseDown, this);
            this.toolModel.oCube.off("mousedown", this.onItemMouseDown, this);
        };
        STool.prototype.onItemMouseDown = function (event) {
            if (!editor.engine.mouseinview)
                return;
            if (feng3d.shortcut.keyState.getKeyState("alt"))
                return;
            _super.prototype.onItemMouseDown.call(this, event);
            //全局矩阵
            var globalMatrix3D = this.transform.localToWorldMatrix;
            //中心与X,Y,Z轴上点坐标
            var po = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 0));
            var px = globalMatrix3D.transformVector(new feng3d.Vector3(1, 0, 0));
            var py = globalMatrix3D.transformVector(new feng3d.Vector3(0, 1, 0));
            var pz = globalMatrix3D.transformVector(new feng3d.Vector3(0, 0, 1));
            //
            var ox = px.subTo(po);
            var oy = py.subTo(po);
            var oz = pz.subTo(po);
            //摄像机前方方向
            var cameraSceneTransform = editor.editorCamera.transform.localToWorldMatrix;
            var cameraDir = cameraSceneTransform.forward;
            this.movePlane3D = new feng3d.Plane3D();
            switch (event.currentTarget) {
                case this.toolModel.xCube:
                    this.selectedItem = this.toolModel.xCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(ox).crossTo(ox), po);
                    this.changeXYZ.init(1, 0, 0);
                    break;
                case this.toolModel.yCube:
                    this.selectedItem = this.toolModel.yCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oy).crossTo(oy), po);
                    this.changeXYZ.init(0, 1, 0);
                    break;
                case this.toolModel.zCube:
                    this.selectedItem = this.toolModel.zCube;
                    this.movePlane3D.fromNormalAndPoint(cameraDir.crossTo(oz).crossTo(oz), po);
                    this.changeXYZ.init(0, 0, 1);
                    break;
                case this.toolModel.oCube:
                    this.selectedItem = this.toolModel.oCube;
                    this.startMousePos = editor.engine.mousePos.clone();
                    this.changeXYZ.init(1, 1, 1);
                    break;
            }
            this.startSceneTransform = globalMatrix3D.clone();
            this.startPlanePos = this.getLocalMousePlaneCross();
            editor.mrsToolTarget.startScale();
            //
            feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
        };
        STool.prototype.onMouseMove = function () {
            var addPos = new feng3d.Vector3();
            var addScale = new feng3d.Vector3();
            if (this.selectedItem == this.toolModel.oCube) {
                var currentMouse = editor.engine.mousePos;
                var distance = currentMouse.x - currentMouse.y - this.startMousePos.x + this.startMousePos.y;
                addPos.init(distance, distance, distance);
                var scale = 1 + (addPos.x + addPos.y) / (editor.engine.viewRect.height);
                addScale.init(scale, scale, scale);
            }
            else {
                var crossPos = this.getLocalMousePlaneCross();
                var offset = crossPos.subTo(this.startPlanePos);
                if (this.changeXYZ.x && this.startPlanePos.x && offset.x != 0) {
                    addScale.x = offset.x / this.startPlanePos.x;
                }
                if (this.changeXYZ.y && this.startPlanePos.y && offset.y != 0) {
                    addScale.y = offset.y / this.startPlanePos.y;
                }
                if (this.changeXYZ.z && this.startPlanePos.z && offset.z != 0) {
                    addScale.z = offset.z / this.startPlanePos.z;
                }
                addScale.x += 1;
                addScale.y += 1;
                addScale.z += 1;
            }
            editor.mrsToolTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        };
        STool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            editor.mrsToolTarget.stopScale();
            this.startPlanePos = null;
            this.startSceneTransform = null;
            //
            this.toolModel.xCube.scaleValue = 1;
            this.toolModel.yCube.scaleValue = 1;
            this.toolModel.zCube.scaleValue = 1;
        };
        return STool;
    }(editor.MRSToolBase));
    editor.STool = STool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 设置永久可见
     */
    function setAwaysVisible(component) {
        var models = component.getComponentsInChildren(feng3d.Model);
        models.forEach(function (element) {
            if (element.material && !element.material.assetsId) {
                element.material.renderParams.depthtest = false;
            }
        });
    }
    /**
     * 位移旋转缩放工具
     */
    var MRSTool = /** @class */ (function (_super) {
        __extends(MRSTool, _super);
        function MRSTool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MRSTool.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.mrsToolObject = Object.setValue(new feng3d.GameObject(), { name: "MRSTool" });
            this.mTool = Object.setValue(new feng3d.GameObject(), { name: "MTool" }).addComponent(editor.MTool);
            this.rTool = Object.setValue(new feng3d.GameObject(), { name: "RTool" }).addComponent(editor.RTool);
            this.sTool = Object.setValue(new feng3d.GameObject(), { name: "STool" }).addComponent(editor.STool);
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);
            //
            this.currentTool = this.mTool;
            //
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.feng3dDispatcher.on("editor.toolTypeChanged", this.onToolTypeChange, this);
        };
        MRSTool.prototype.dispose = function () {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            //
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.feng3dDispatcher.off("editor.selectedObjectsChanged", this.onSelectedGameObjectChange, this);
            feng3d.feng3dDispatcher.off("editor.toolTypeChanged", this.onToolTypeChange, this);
            _super.prototype.dispose.call(this);
        };
        MRSTool.prototype.onSelectedGameObjectChange = function () {
            var objects = editor.editorData.selectedGameObjects.filter(function (v) { return !(v.hideFlags & feng3d.HideFlags.DontTransform); });
            //筛选出 工具控制的对象
            if (objects.length > 0) {
                this.gameObject.addChild(this.mrsToolObject);
            }
            else {
                this.mrsToolObject.remove();
            }
        };
        MRSTool.prototype.onToolTypeChange = function () {
            switch (editor.editorData.toolType) {
                case editor.MRSToolType.MOVE:
                    this.currentTool = this.mTool;
                    break;
                case editor.MRSToolType.ROTATION:
                    this.currentTool = this.rTool;
                    break;
                case editor.MRSToolType.SCALE:
                    this.currentTool = this.sTool;
                    break;
            }
        };
        Object.defineProperty(MRSTool.prototype, "currentTool", {
            set: function (value) {
                if (this._currentTool == value)
                    return;
                if (this._currentTool) {
                    this._currentTool.gameObject.remove();
                }
                this._currentTool = value;
                if (this._currentTool) {
                    this.mrsToolObject.addChild(this._currentTool.gameObject);
                }
            },
            enumerable: true,
            configurable: true
        });
        return MRSTool;
    }(feng3d.Component));
    editor.MRSTool = MRSTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var HierarchyNode = /** @class */ (function (_super) {
        __extends(HierarchyNode, _super);
        function HierarchyNode(obj) {
            var _this = _super.call(this, obj) || this;
            _this.isOpen = false;
            /**
             * 父结点
             */
            _this.parent = null;
            /**
             * 子结点列表
             */
            _this.children = [];
            feng3d.watcher.watch(_this.gameobject, "name", _this.update, _this);
            _this.update();
            return _this;
        }
        /**
         * 销毁
         */
        HierarchyNode.prototype.destroy = function () {
            feng3d.watcher.unwatch(this.gameobject, "name", this.update, this);
            this.gameobject = null;
            _super.prototype.destroy.call(this);
        };
        HierarchyNode.prototype.update = function () {
            this.label = this.gameobject.name;
        };
        return HierarchyNode;
    }(editor.TreeNode));
    editor.HierarchyNode = HierarchyNode;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Hierarchy = /** @class */ (function () {
        function Hierarchy() {
            this._selectedGameObjects = [];
            feng3d.feng3dDispatcher.on("editor.selectedObjectsChanged", this.onSelectedGameObjectChanged, this);
        }
        /**
         * 获取选中结点
         */
        Hierarchy.prototype.getSelectedNode = function () {
            var _this = this;
            var node = editor.editorData.selectedGameObjects.reduce(function (pv, cv) { pv = pv || _this.getNode(cv); return pv; }, null);
            return node;
        };
        /**
         * 获取结点
         */
        Hierarchy.prototype.getNode = function (gameObject) {
            var node = nodeMap.get(gameObject);
            return node;
        };
        Hierarchy.prototype.delete = function (gameobject) {
            var node = nodeMap.get(gameobject);
            if (node) {
                node.destroy();
                nodeMap.delete(gameobject);
            }
        };
        Hierarchy.prototype.addGameoObjectFromAsset = function (gameobject, parent) {
            gameobject = feng3d.serialization.clone(gameobject);
            if (parent)
                parent.addChild(gameobject);
            else
                this.rootnode.gameobject.addChild(gameobject);
            editor.editorData.selectObject(gameobject);
        };
        Hierarchy.prototype.rootGameObjectChanged = function (property, oldValue, newValue) {
            if (oldValue) {
                oldValue.off("addChild", this.ongameobjectadded, this);
                oldValue.off("removeChild", this.ongameobjectremoved, this);
            }
            if (newValue) {
                this.init(newValue);
                newValue.on("addChild", this.ongameobjectadded, this);
                newValue.on("removeChild", this.ongameobjectremoved, this);
            }
        };
        Hierarchy.prototype.onSelectedGameObjectChanged = function () {
            var _this = this;
            this._selectedGameObjects.forEach(function (element) {
                var node = _this.getNode(element);
                if (node)
                    node.selected = false;
                else
                    debugger; // 为什么为空，是否被允许？
            });
            this._selectedGameObjects = editor.editorData.selectedGameObjects.concat();
            this._selectedGameObjects.forEach(function (element) {
                var node = _this.getNode(element);
                node.selected = true;
                node.openParents();
            });
        };
        Hierarchy.prototype.ongameobjectadded = function (event) {
            this.add(event.data);
        };
        Hierarchy.prototype.ongameobjectremoved = function (event) {
            var node = nodeMap.get(event.data);
            this.remove(node);
        };
        Hierarchy.prototype.init = function (gameobject) {
            var _this = this;
            if (this.rootnode)
                this.rootnode.destroy();
            nodeMap.clear();
            var node = new editor.HierarchyNode({ gameobject: gameobject });
            nodeMap.set(gameobject, node);
            node.isOpen = true;
            this.rootnode = node;
            gameobject.children.forEach(function (element) {
                _this.add(element);
            });
        };
        Hierarchy.prototype.add = function (gameobject) {
            var _this = this;
            if (gameobject.hideFlags & feng3d.HideFlags.HideInHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node) {
                node.remove();
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode) {
                if (!node) {
                    node = new editor.HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                parentnode.addChild(node);
            }
            gameobject.children.forEach(function (element) {
                _this.add(element);
            });
            return node;
        };
        Hierarchy.prototype.remove = function (node) {
            var _this = this;
            if (!node)
                return;
            node.children.forEach(function (element) {
                _this.remove(element);
            });
            node.remove();
        };
        __decorate([
            feng3d.watch("rootGameObjectChanged")
        ], Hierarchy.prototype, "rootGameObject", void 0);
        return Hierarchy;
    }());
    editor.Hierarchy = Hierarchy;
    var nodeMap = new Map();
    editor.hierarchy = new Hierarchy();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var SceneRotateTool = /** @class */ (function (_super) {
        __extends(SceneRotateTool, _super);
        function SceneRotateTool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneRotateTool.prototype.init = function (gameObject) {
            var _this = this;
            _super.prototype.init.call(this, gameObject);
            var thisObj = this;
            feng3d.loader.loadText(editor.editorData.getEditorAssetsPath("gameobjects/SceneRotateTool.gameobject.json"), function (content) {
                var rotationToolModel = feng3d.serialization.deserialize(JSON.parse(content));
                _this.onLoaded(rotationToolModel);
            });
        };
        SceneRotateTool.prototype.onLoaded = function (rotationToolModel) {
            var arrowsX = rotationToolModel.find("arrowsX");
            var arrowsY = rotationToolModel.find("arrowsY");
            var arrowsZ = rotationToolModel.find("arrowsZ");
            var arrowsNX = rotationToolModel.find("arrowsNX");
            var arrowsNY = rotationToolModel.find("arrowsNY");
            var arrowsNZ = rotationToolModel.find("arrowsNZ");
            var planeX = rotationToolModel.find("planeX");
            var planeY = rotationToolModel.find("planeY");
            var planeZ = rotationToolModel.find("planeZ");
            var planeNX = rotationToolModel.find("planeNX");
            var planeNY = rotationToolModel.find("planeNY");
            var planeNZ = rotationToolModel.find("planeNZ");
            var _a = newEngine(), toolEngine = _a.toolEngine, canvas = _a.canvas;
            toolEngine.root.addChild(rotationToolModel);
            rotationToolModel.transform.sx = 0.01;
            rotationToolModel.transform.sy = 0.01;
            rotationToolModel.transform.sz = 0.01;
            rotationToolModel.transform.z = 0.80;
            var arr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ, planeX, planeY, planeZ, planeNX, planeNY, planeNZ];
            arr.forEach(function (element) {
                element.on("click", onclick);
            });
            var arrowsArr = [arrowsX, arrowsY, arrowsZ, arrowsNX, arrowsNY, arrowsNZ];
            feng3d.ticker.onframe(function () {
                var rect = editor.engine.canvas.getBoundingClientRect();
                canvas.style.top = rect.top + "px";
                canvas.style.left = (rect.left + rect.width - canvas.width) + "px";
                var rotation = editor.editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scaleNumber(180 / Math.PI);
                rotationToolModel.transform.rotation = rotation;
                //隐藏角度
                var visibleAngle = Math.cos(15 * feng3d.FMath.DEG2RAD);
                //隐藏正面箭头
                arrowsArr.forEach(function (element) {
                    if (Math.abs(element.transform.localToWorldMatrix.up.dot(feng3d.Vector3.Z_AXIS)) < visibleAngle)
                        element.visible = true;
                    else
                        element.visible = false;
                });
                //
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                    feng3d.shortcut.activityState("mouseInSceneRotateTool");
                }
                else {
                    feng3d.shortcut.deactivityState("mouseInSceneRotateTool");
                }
            });
            feng3d.windowEventProxy.on("mouseup", function (e) {
                var canvasRect = canvas.getBoundingClientRect();
                var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
                if (!bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY))
                    return;
                //右键点击菜单
                if (e.button == 2) {
                    editor.menu.popup([
                        {
                            label: "左视图", click: function () {
                                clickItem(arrowsX);
                            }
                        },
                        {
                            label: "右视图", click: function () {
                                clickItem(arrowsNX);
                            }
                        },
                        {
                            label: "顶视图", click: function () {
                                clickItem(arrowsY);
                            }
                        },
                        {
                            label: "底视图", click: function () {
                                clickItem(arrowsNY);
                            }
                        },
                        {
                            label: "前视图", click: function () {
                                clickItem(arrowsZ);
                            }
                        },
                        {
                            label: "后视图", click: function () {
                                clickItem(arrowsNZ);
                            }
                        },
                    ]);
                }
            });
            function newEngine() {
                var canvas = document.getElementById("sceneRotateToolCanvas");
                ;
                // can
                canvas.width = 80;
                canvas.height = 80;
                var toolEngine = new feng3d.Engine(canvas);
                toolEngine.scene.background.a = 0.0;
                toolEngine.scene.ambientColor.setTo(0.2, 0.2, 0.2);
                toolEngine.root.addChild(feng3d.gameObjectFactory.createPointLight());
                return { toolEngine: toolEngine, canvas: canvas };
            }
            function onclick(e) {
                clickItem(e.currentTarget);
            }
            function clickItem(item) {
                var front_view = new feng3d.Vector3(0, 0, 0); //前视图
                var back_view = new feng3d.Vector3(0, 180, 0); //后视图
                var right_view = new feng3d.Vector3(0, -90, 0); //右视图
                var left_view = new feng3d.Vector3(0, 90, 0); //左视图
                var top_view = new feng3d.Vector3(-90, 0, 180); //顶视图
                var bottom_view = new feng3d.Vector3(-90, 180, 0); //底视图
                var rotation;
                switch (item) {
                    case arrowsX:
                        rotation = left_view;
                        break;
                    case arrowsNX:
                        rotation = right_view;
                        break;
                    case arrowsY:
                        rotation = top_view;
                        break;
                    case arrowsNY:
                        rotation = bottom_view;
                        break;
                    case arrowsZ:
                        rotation = back_view;
                        break;
                    case arrowsNZ:
                        rotation = front_view;
                        break;
                }
                if (rotation) {
                    var cameraTargetMatrix3D = feng3d.Matrix4x4.fromRotation(rotation.x, rotation.y, rotation.z);
                    cameraTargetMatrix3D.invert();
                    var result = cameraTargetMatrix3D.decompose()[1];
                    result.scaleNumber(180 / Math.PI);
                    feng3d.feng3dDispatcher.dispatch("editorCameraRotate", result);
                }
            }
        };
        return SceneRotateTool;
    }(feng3d.Component));
    editor.SceneRotateTool = SceneRotateTool;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 地面网格
     */
    var GroundGrid = /** @class */ (function (_super) {
        __extends(GroundGrid, _super);
        function GroundGrid() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.num = 100;
            return _this;
        }
        GroundGrid.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            var groundGridObject = Object.setValue(new feng3d.GameObject(), { name: "GroundGrid" });
            groundGridObject.mouseEnabled = false;
            gameObject.addChild(groundGridObject);
            var __this = this;
            editor.editorCamera.transform.on("transformChanged", update, this);
            var model = groundGridObject.addComponent(feng3d.Model);
            var segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
            var material = model.material = Object.setValue(new feng3d.Material(), { shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.renderParams.enableBlend = true;
            update();
            function update() {
                var cameraGlobalPosition = editor.editorCamera.transform.scenePosition;
                var level = Math.floor(Math.log(Math.abs(cameraGlobalPosition.y)) / Math.LN10 + 1);
                var step = Math.pow(10, level - 1);
                var startX = Math.round(cameraGlobalPosition.x / (10 * step)) * 10 * step;
                var startZ = Math.round(cameraGlobalPosition.z / (10 * step)) * 10 * step;
                //设置在原点
                startX = startZ = 0;
                step = 1;
                var halfNum = __this.num / 2;
                var xcolor = new feng3d.Color4(1, 0, 0, 0.5);
                var zcolor = new feng3d.Color4(0, 0, 1, 0.5);
                var color;
                var segments = [];
                for (var i = -halfNum; i <= halfNum; i++) {
                    var color0 = new feng3d.Color4().fromUnit((i % 10) == 0 ? 0x888888 : 0x777777);
                    color0.a = ((i % 10) == 0) ? 0.5 : 0.1;
                    color = (i * step + startZ == 0) ? xcolor : color0;
                    segments.push({ start: new feng3d.Vector3(-halfNum * step + startX, 0, i * step + startZ), end: new feng3d.Vector3(halfNum * step + startX, 0, i * step + startZ), startColor: color, endColor: color });
                    color = (i * step + startX == 0) ? zcolor : color0;
                    segments.push({ start: new feng3d.Vector3(i * step + startX, 0, -halfNum * step + startZ), end: new feng3d.Vector3(i * step + startX, 0, halfNum * step + startZ), startColor: color, endColor: color });
                }
                segmentGeometry.segments = segments;
            }
        };
        __decorate([
            feng3d.oav()
        ], GroundGrid.prototype, "num", void 0);
        return GroundGrid;
    }(feng3d.Component));
    editor.GroundGrid = GroundGrid;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var EditorEngine = /** @class */ (function (_super) {
        __extends(EditorEngine, _super);
        function EditorEngine() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.wireframeColor = new feng3d.Color4(125 / 255, 176 / 255, 250 / 255);
            return _this;
        }
        Object.defineProperty(EditorEngine.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            set: function (value) {
                if (this._scene) {
                    this._scene.runEnvironment = feng3d.RunEnvironment.feng3d;
                }
                this._scene = value;
                if (this._scene) {
                    this._scene.runEnvironment = feng3d.RunEnvironment.editor;
                    editor.hierarchy.rootGameObject = this._scene.gameObject;
                }
                editor.editorComponent.scene = this._scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorEngine.prototype, "camera", {
            get: function () {
                return editor.editorCamera;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 绘制场景
         */
        EditorEngine.prototype.render = function () {
            var _this = this;
            _super.prototype.render.call(this);
            editor.editorScene.update();
            feng3d.forwardRenderer.draw(this.gl, editor.editorScene, this.camera);
            var selectedObject = this.mouse3DManager.pick(editor.editorScene, this.camera);
            if (selectedObject)
                this.selectedObject = selectedObject;
            editor.editorData.selectedGameObjects.forEach(function (element) {
                if (element.getComponent(feng3d.Model) && !element.getComponent(feng3d.ParticleSystem))
                    feng3d.wireframeRenderer.drawGameObject(_this.gl, element, _this.scene, _this.camera, _this.wireframeColor);
            });
        };
        return EditorEngine;
    }(feng3d.Engine));
    editor.EditorEngine = EditorEngine;
    /**
    * 编辑器3D入口
    */
    var Main3D = /** @class */ (function () {
        function Main3D() {
            this.init();
        }
        Main3D.prototype.init = function () {
            //
            editor.editorCamera = Object.setValue(new feng3d.GameObject(), { name: "editorCamera" }).addComponent(feng3d.Camera);
            editor.editorCamera.lens.far = 5000;
            editor.editorCamera.transform.x = 5;
            editor.editorCamera.transform.y = 3;
            editor.editorCamera.transform.z = 5;
            editor.editorCamera.transform.lookAt(new feng3d.Vector3());
            //
            editor.editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
            //
            editor.editorScene = Object.setValue(new feng3d.GameObject(), { name: "scene" }).addComponent(feng3d.Scene3D);
            editor.editorScene.runEnvironment = feng3d.RunEnvironment.all;
            //
            editor.editorScene.gameObject.addComponent(editor.SceneRotateTool);
            //
            //初始化模块
            editor.editorScene.gameObject.addComponent(editor.GroundGrid);
            editor.editorScene.gameObject.addComponent(editor.MRSTool);
            editor.editorComponent = editor.editorScene.gameObject.addComponent(editor.EditorComponent);
            feng3d.loader.loadText(editor.editorData.getEditorAssetsPath("gameobjects/Trident.gameobject.json"), function (content) {
                var trident = feng3d.serialization.deserialize(JSON.parse(content));
                editor.editorScene.gameObject.addChild(trident);
            });
            //
            feng3d.feng3dDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
            //
            var canvas = document.getElementById("glcanvas");
            editor.engine = new EditorEngine(canvas, null, editor.editorCamera);
            //
            editor.editorAssets.runProjectScript(function () {
                editor.editorAssets.readScene("default.scene.json", function (err, scene) {
                    if (err)
                        editor.engine.scene = creatNewScene();
                    else
                        editor.engine.scene = scene;
                });
            });
            window.addEventListener("beforeunload", function () {
                editor.editorFS.fs.writeObject("default.scene.json", editor.engine.scene.gameObject);
            });
        };
        Main3D.prototype.onEditorCameraRotate = function (e) {
            var resultRotation = e.data;
            var camera = editor.editorCamera;
            var forward = camera.transform.forwardVector;
            var lookDistance;
            if (editor.editorData.selectedGameObjects.length > 0) {
                //计算观察距离
                var selectedObj = editor.editorData.selectedGameObjects[0];
                var lookray = selectedObj.transform.scenePosition.subTo(camera.transform.scenePosition);
                lookDistance = Math.max(0, forward.dot(lookray));
            }
            else {
                lookDistance = editor.sceneControlConfig.lookDistance;
            }
            //旋转中心
            var rotateCenter = camera.transform.scenePosition.addTo(forward.scaleNumber(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new feng3d.Quaternion();
            resultRotation.scaleNumber(feng3d.FMath.DEG2RAD);
            targetQuat.fromEulerAngles(resultRotation.x, resultRotation.y, resultRotation.z);
            //
            var sourceQuat = new feng3d.Quaternion();
            sourceQuat.fromEulerAngles(camera.transform.rx * feng3d.FMath.DEG2RAD, camera.transform.ry * feng3d.FMath.DEG2RAD, camera.transform.rz * feng3d.FMath.DEG2RAD);
            var rate = { rate: 0.0 };
            egret.Tween.get(rate, {
                onChange: function () {
                    var cameraQuat = new feng3d.Quaternion();
                    cameraQuat.slerp(sourceQuat, targetQuat, rate.rate);
                    camera.transform.orientation = cameraQuat;
                    //
                    var translation = camera.transform.forwardVector;
                    translation.negate();
                    translation.scaleNumber(lookDistance);
                    camera.transform.position = rotateCenter.addTo(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        };
        return Main3D;
    }());
    editor.Main3D = Main3D;
    function creatNewScene() {
        var scene = Object.setValue(new feng3d.GameObject(), { name: "Untitled" }).addComponent(feng3d.Scene3D);
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);
        var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
        camera.addComponent(feng3d.AudioListener);
        camera.transform.position = new feng3d.Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);
        var directionalLight = Object.setValue(new feng3d.GameObject(), { name: "DirectionalLight" });
        directionalLight.addComponent(feng3d.DirectionalLight).shadowType = feng3d.ShadowType.Hard_Shadows;
        directionalLight.transform.rx = 50;
        directionalLight.transform.ry = -30;
        directionalLight.transform.y = 3;
        scene.gameObject.addChild(directionalLight);
        return scene;
    }
    editor.creatNewScene = creatNewScene;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var EditorComponent = /** @class */ (function (_super) {
        __extends(EditorComponent, _super);
        function EditorComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.directionLightIconMap = new Map();
            _this.pointLightIconMap = new Map();
            _this.spotLightIconMap = new Map();
            _this.cameraIconMap = new Map();
            return _this;
        }
        Object.defineProperty(EditorComponent.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            set: function (v) {
                var _this = this;
                if (this._scene) {
                    this.scene.off("addComponent", this.onAddComponent, this);
                    this.scene.off("removeComponent", this.onRemoveComponent, this);
                    this.scene.getComponentsInChildren(feng3d.Component).forEach(function (element) {
                        _this.removeComponent(element);
                    });
                }
                this._scene = v;
                if (this._scene) {
                    this.scene.getComponentsInChildren(feng3d.Component).forEach(function (element) {
                        _this.addComponent(element);
                    });
                    this.scene.on("addComponent", this.onAddComponent, this);
                    this.scene.on("removeComponent", this.onRemoveComponent, this);
                    this.scene.on("addChild", this.onAddChild, this);
                    this.scene.on("removeChild", this.onRemoveChild, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        EditorComponent.prototype.init = function (gameobject) {
            _super.prototype.init.call(this, gameobject);
        };
        /**
         * 销毁
         */
        EditorComponent.prototype.dispose = function () {
            this.scene = null;
            _super.prototype.dispose.call(this);
        };
        EditorComponent.prototype.onAddChild = function (event) {
            var _this = this;
            var components = event.data.getComponentsInChildren();
            components.forEach(function (v) {
                _this.addComponent(v);
            });
        };
        EditorComponent.prototype.onRemoveChild = function (event) {
            var _this = this;
            var components = event.data.getComponentsInChildren();
            components.forEach(function (v) {
                _this.removeComponent(v);
            });
        };
        EditorComponent.prototype.onAddComponent = function (event) {
            this.addComponent(event.data);
        };
        EditorComponent.prototype.onRemoveComponent = function (event) {
            this.removeComponent(event.data);
        };
        EditorComponent.prototype.addComponent = function (component) {
            if (component instanceof feng3d.DirectionalLight) {
                var directionLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "DirectionLightIcon", }).addComponent(editor.DirectionLightIcon), { light: component, });
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(component, directionLightIcon);
            }
            else if (component instanceof feng3d.PointLight) {
                var pointLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "PointLightIcon" }).addComponent(editor.PointLightIcon), { light: component });
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(component, pointLightIcon);
            }
            else if (component instanceof feng3d.SpotLight) {
                var spotLightIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "SpotLightIcon" }).addComponent(editor.SpotLightIcon), { light: component });
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(component, spotLightIcon);
            }
            else if (component instanceof feng3d.Camera) {
                var cameraIcon = Object.setValue(Object.setValue(new feng3d.GameObject(), { name: "CameraIcon" }).addComponent(editor.CameraIcon), { camera: component });
                this.gameObject.addChild(cameraIcon.gameObject);
                this.cameraIconMap.set(component, cameraIcon);
            }
        };
        EditorComponent.prototype.removeComponent = function (component) {
            if (component instanceof feng3d.DirectionalLight) {
                Object.setValue(this.directionLightIconMap.get(component), { light: null }).gameObject.remove();
                this.directionLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.PointLight) {
                Object.setValue(this.pointLightIconMap.get(component), { light: null }).gameObject.remove();
                this.pointLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.SpotLight) {
                Object.setValue(this.spotLightIconMap.get(component), { light: null }).gameObject.remove();
                this.spotLightIconMap.delete(component);
            }
            else if (component instanceof feng3d.Camera) {
                Object.setValue(this.cameraIconMap.get(component), { camera: null }).gameObject.remove();
                this.cameraIconMap.delete(component);
            }
        };
        return EditorComponent;
    }(feng3d.Component));
    editor.EditorComponent = EditorComponent;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * feng3d缩略图工具
     */
    var Feng3dScreenShot = /** @class */ (function () {
        function Feng3dScreenShot() {
            this.defaultGeometry = feng3d.Geometry.sphere;
            this.defaultMaterial = feng3d.Material.default;
            this.materialObject = Object.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshModel" }] });
            this.geometryObject = Object.setValue(new feng3d.GameObject(), { components: [{ __class__: "feng3d.MeshModel", }, { __class__: "feng3d.WireframeComponent", }] });
            // 初始化3d
            var engine = this.engine = new feng3d.Engine();
            engine.canvas.style.visibility = "hidden";
            engine.setSize(64, 64);
            //
            var scene = this.scene = engine.scene;
            scene.background.fromUnit(0xff525252);
            scene.ambientColor.setTo(0.4, 0.4, 0.4);
            //
            var camera = this.camera = engine.camera;
            camera.lens = new feng3d.PerspectiveLens(45);
            //
            var light = Object.setValue(new feng3d.GameObject(), {
                name: "DirectionalLight",
                components: [{ __class__: "feng3d.Transform", rx: 50, ry: -30 }, { __class__: "feng3d.DirectionalLight" },]
            });
            scene.gameObject.addChild(light);
            engine.stop();
        }
        // /**
        //  * 绘制贴图
        //  * @param texture 贴图
        //  */
        // drawTexture(texture: feng3d.UrlImageTexture2D, width?: number, height?: number)
        // {
        //     var image: ImageData | HTMLImageElement = <any>texture.activePixels;
        //     var w = width || (image && image.width) || 64;
        //     var h = height || (image && image.height) || 64;
        //     var canvas2D = document.createElement("canvas");
        //     canvas2D.width = w;
        //     canvas2D.height = h;
        //     var context2D = canvas2D.getContext("2d");
        //     context2D.fillStyle = "black";
        //     if (image instanceof HTMLImageElement)
        //         context2D.drawImage(image, 0, 0, w, h);
        //     else if (image instanceof ImageData)
        //         context2D.putImageData(image, 0, 0);
        //     else
        //         context2D.fillRect(0, 0, w, h);
        //     //
        //     var dataUrl = canvas2D.toDataURL();
        //     return dataUrl;
        // }
        /**
         * 绘制立方体贴图
         * @param textureCube 立方体贴图
         */
        Feng3dScreenShot.prototype.drawTextureCube = function (textureCube) {
            var pixels = textureCube["_pixels"];
            var canvas2D = document.createElement("canvas");
            var width = 64;
            canvas2D.width = width;
            canvas2D.height = width;
            var context2D = canvas2D.getContext("2d");
            context2D.fillStyle = "black";
            // context2D.fillRect(10, 10, 100, 100);
            var w4 = Math.round(width / 4);
            var Yoffset = w4 / 2;
            //
            var X = w4 * 2;
            var Y = w4;
            if (pixels[0])
                context2D.drawImage(pixels[0], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = 0;
            if (pixels[1])
                context2D.drawImage(pixels[1], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4;
            if (pixels[2])
                context2D.drawImage(pixels[2], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = 0;
            Y = w4;
            if (pixels[3])
                context2D.drawImage(pixels[3], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4;
            Y = w4 * 2;
            if (pixels[4])
                context2D.drawImage(pixels[4], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            X = w4 * 3;
            Y = w4;
            if (pixels[5])
                context2D.drawImage(pixels[5], X, Y + Yoffset, w4, w4);
            else
                context2D.fillRect(X, Y + Yoffset, w4, w4);
            //
            var dataUrl = canvas2D.toDataURL();
            return dataUrl;
        };
        /**
         * 绘制材质
         * @param material 材质
         */
        Feng3dScreenShot.prototype.drawMaterial = function (material, cameraRotation) {
            if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(20, -90, 0); }
            var mode = this.materialObject.getComponent(feng3d.Model);
            mode.geometry = this.defaultGeometry;
            mode.material = material;
            //
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(this.materialObject);
            return this;
        };
        /**
         * 绘制材质
         * @param geometry 材质
         */
        Feng3dScreenShot.prototype.drawGeometry = function (geometry, cameraRotation) {
            if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(-20, 120, 0); }
            var model = this.geometryObject.getComponent(feng3d.Model);
            model.geometry = geometry;
            model.material = this.defaultMaterial;
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(this.geometryObject);
            return this;
        };
        /**
         * 绘制游戏对象
         * @param gameObject 游戏对象
         */
        Feng3dScreenShot.prototype.drawGameObject = function (gameObject, cameraRotation) {
            if (cameraRotation === void 0) { cameraRotation = new feng3d.Vector3(20, -120, 0); }
            cameraRotation && (this.camera.transform.rotation = cameraRotation);
            this._drawGameObject(gameObject);
            return this;
        };
        /**
         * 转换为DataURL
         */
        Feng3dScreenShot.prototype.toDataURL = function () {
            this.engine.render();
            var dataUrl = this.engine.canvas.toDataURL();
            return dataUrl;
        };
        Feng3dScreenShot.prototype.updateCameraPosition = function () {
            //
            var bounds = this.currentObject.worldBounds;
            var scenePosition = bounds.getCenter();
            var size = bounds.getSize().length;
            size = Math.max(size, 1);
            var lookDistance = size;
            var lens = this.camera.lens;
            if (lens instanceof feng3d.PerspectiveLens) {
                lookDistance = 0.6 * size / Math.tan(lens.fov * Math.PI / 360);
            }
            //
            var lookPos = this.camera.transform.localToWorldMatrix.forward;
            lookPos.scaleNumber(-lookDistance);
            lookPos.add(scenePosition);
            var localLookPos = lookPos.clone();
            if (this.camera.transform.parent) {
                localLookPos = this.camera.transform.parent.worldToLocalMatrix.transformVector(lookPos);
            }
            this.camera.transform.position = localLookPos;
        };
        Feng3dScreenShot.prototype._drawGameObject = function (gameObject) {
            if (this.currentObject) {
                this.scene.gameObject.removeChild(this.currentObject);
                this.currentObject = null;
            }
            //
            this.scene.gameObject.addChild(gameObject);
            this.currentObject = gameObject;
            //
            this.updateCameraPosition();
        };
        return Feng3dScreenShot;
    }());
    editor.Feng3dScreenShot = Feng3dScreenShot;
    editor.feng3dScreenShot = new Feng3dScreenShot();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 导航代理
     */
    var NavigationAgent = /** @class */ (function () {
        function NavigationAgent() {
            /**
             * 距离边缘半径
             */
            this.radius = 0.5;
            /**
             * 允许行走高度
             */
            this.height = 2;
            /**
             * 允许爬上的阶梯高度
             */
            this.stepHeight = 0.4;
            /**
             * 允许行走坡度
             */
            this.maxSlope = 45; //[0,60]
        }
        __decorate([
            feng3d.oav()
        ], NavigationAgent.prototype, "radius", void 0);
        __decorate([
            feng3d.oav()
        ], NavigationAgent.prototype, "height", void 0);
        __decorate([
            feng3d.oav()
        ], NavigationAgent.prototype, "stepHeight", void 0);
        __decorate([
            feng3d.oav()
        ], NavigationAgent.prototype, "maxSlope", void 0);
        return NavigationAgent;
    }());
    editor.NavigationAgent = NavigationAgent;
    /**
     * 导航组件，提供生成导航网格功能
     */
    var Navigation = /** @class */ (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.agent = new NavigationAgent();
            return _this;
        }
        Navigation.prototype.init = function (gameobject) {
            _super.prototype.init.call(this, gameobject);
            this.hideFlags = this.hideFlags | feng3d.HideFlags.DontSaveInBuild;
            this._navobject = Object.setValue(new feng3d.GameObject(), { name: "NavObject", hideFlags: feng3d.HideFlags.DontSave });
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "allowedVoxels",
                components: [{
                        __class__: "feng3d.MeshModel",
                        material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 1, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._allowedVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "rejectivedVoxels",
                components: [{
                        __class__: "feng3d.MeshModel",
                        material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(1, 0, 0), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._rejectivedVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
            var pointsObject = Object.setValue(new feng3d.GameObject(), {
                name: "debugVoxels",
                components: [{
                        __class__: "feng3d.MeshModel",
                        material: Object.setValue(new feng3d.Material(), { shaderName: "point", uniforms: { u_color: new feng3d.Color4(0, 0, 1), u_PointSize: 2 }, renderParams: { renderMode: feng3d.RenderMode.POINTS } }),
                        geometry: this._debugVoxelsPointGeometry = new feng3d.PointGeometry()
                    },]
            });
            this._navobject.addChild(pointsObject);
        };
        /**
         * 清楚oav网格模型
         */
        Navigation.prototype.clear = function () {
            this._navobject && this._navobject.remove();
        };
        /**
         * 计算导航网格数据
         */
        Navigation.prototype.bake = function () {
            var geometrys = this._getNavGeometrys(this.gameObject.scene.gameObject);
            if (geometrys.length == 0) {
                this._navobject && this._navobject.remove();
                return;
            }
            this.gameObject.scene.gameObject.addChild(this._navobject);
            this._navobject.transform.position = new feng3d.Vector3();
            var geometry = feng3d.geometryUtils.mergeGeometry(geometrys);
            this._recastnavigation = this._recastnavigation || new editor.Recastnavigation();
            this._recastnavigation.doRecastnavigation(geometry, this.agent);
            var voxels = this._recastnavigation.getVoxels();
            var voxels0 = voxels.filter(function (v) { return v.flag == editor.VoxelFlag.Default; });
            var voxels1 = voxels.filter(function (v) { return v.flag != editor.VoxelFlag.Default; });
            var voxels2 = voxels.filter(function (v) { return !!(v.flag & editor.VoxelFlag.IsContour); });
            this._allowedVoxelsPointGeometry.points = voxels0.map(function (v) { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
            this._rejectivedVoxelsPointGeometry.points = voxels1.map(function (v) { return { position: new feng3d.Vector3(v.x, v.y, v.z) }; });
            // this._debugVoxelsPointGeometry.points = voxels2.map(v => { return { position: new feng3d.Vector3(v.x, v.y, v.z) } });
        };
        /**
         * 获取参与导航的几何体列表
         * @param gameobject
         * @param geometrys
         */
        Navigation.prototype._getNavGeometrys = function (gameobject, geometrys) {
            var _this = this;
            geometrys = geometrys || [];
            if (!gameobject.visible)
                return geometrys;
            var model = gameobject.getComponent(feng3d.Model);
            var geometry = model && model.geometry;
            if (geometry && gameobject.navigationArea != -1) {
                var matrix3d = gameobject.transform.localToWorldMatrix;
                var positions = Array.apply(null, geometry.positions);
                matrix3d.transformVectors(positions, positions);
                var indices = Array.apply(null, geometry.indices);
                //
                geometrys.push({ positions: positions, indices: indices });
            }
            gameobject.children.forEach(function (element) {
                _this._getNavGeometrys(element, geometrys);
            });
            return geometrys;
        };
        __decorate([
            feng3d.oav({ component: "OAVObjectView" })
        ], Navigation.prototype, "agent", void 0);
        __decorate([
            feng3d.oav()
        ], Navigation.prototype, "clear", null);
        __decorate([
            feng3d.oav()
        ], Navigation.prototype, "bake", null);
        return Navigation;
    }(feng3d.Component));
    editor.Navigation = Navigation;
})(editor || (editor = {}));
// see https://github.com/sshirokov/ThreeBSP
var feng3d;
(function (feng3d) {
    /**
     * 精度值
     */
    var EPSILON = 1e-5;
    /**
     * 共面
     */
    var COPLANAR = 0;
    /**
     * 正面
     */
    var FRONT = 1;
    /**
     * 反面
     */
    var BACK = 2;
    /**
     * 横跨
     */
    var SPANNING = 3;
    var ThreeBSP = /** @class */ (function () {
        function ThreeBSP(geometry) {
            if (geometry instanceof ThreeBSPNode) {
                this.tree = geometry;
            }
            else {
                this.tree = new ThreeBSPNode(geometry);
            }
        }
        ThreeBSP.prototype.toGeometry = function () {
            var data = this.tree.getGeometryData();
            return data;
        };
        /**
         * 相减
         * @param other
         */
        ThreeBSP.prototype.subtract = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.invert().clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };
        ;
        /**
         * 相加
         * @param other
         */
        ThreeBSP.prototype.union = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            us.clipTo(them);
            them.clipTo(us).invert().clipTo(us).invert();
            return new ThreeBSP(us.build(them.allPolygons()));
        };
        ;
        /**
         * 相交
         * @param other
         */
        ThreeBSP.prototype.intersect = function (other) {
            var them = other.tree.clone(), us = this.tree.clone();
            them.clipTo(us.invert()).invert().clipTo(us.clipTo(them));
            return new ThreeBSP(us.build(them.allPolygons()).invert());
        };
        ;
        return ThreeBSP;
    }());
    feng3d.ThreeBSP = ThreeBSP;
    /**
     * 顶点
     */
    var ThreeBSPVertex = /** @class */ (function () {
        function ThreeBSPVertex(position, normal, uv) {
            this.position = position;
            this.normal = normal || new feng3d.Vector3();
            this.uv = uv || new feng3d.Vector2();
        }
        /**
         * 克隆
         */
        ThreeBSPVertex.prototype.clone = function () {
            return new ThreeBSPVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
        };
        ;
        /**
         *
         * @param v 线性插值
         * @param alpha
         */
        ThreeBSPVertex.prototype.lerp = function (v, alpha) {
            this.position.lerpNumber(v.position, alpha);
            this.uv.lerpNumber(v.uv, alpha);
            this.normal.lerpNumber(v.position, alpha);
            return this;
        };
        ;
        ThreeBSPVertex.prototype.interpolate = function (v, alpha) {
            return this.clone().lerp(v, alpha);
        };
        ;
        return ThreeBSPVertex;
    }());
    feng3d.ThreeBSPVertex = ThreeBSPVertex;
    /**
     * 多边形
     */
    var ThreeBSPPolygon = /** @class */ (function () {
        function ThreeBSPPolygon(vertices) {
            this.vertices = vertices || [];
            if (this.vertices.length) {
                this.calculateProperties();
            }
        }
        /**
         * 获取多边形几何体数据
         * @param data
         */
        ThreeBSPPolygon.prototype.getGeometryData = function (data) {
            data = data || { positions: [], uvs: [], normals: [] };
            var vertices = data.positions = data.positions || [];
            var uvs = data.uvs = data.uvs || [];
            var normals = data.normals = data.normals || [];
            for (var i = 2, n = this.vertices.length; i < n; i++) {
                var v0 = this.vertices[0], v1 = this.vertices[i - 1], v2 = this.vertices[i];
                vertices.push(v0.position.x, v0.position.y, v0.position.z, v1.position.x, v1.position.y, v1.position.z, v2.position.x, v2.position.y, v2.position.z);
                uvs.push(v0.uv.x, v0.uv.y, v1.uv.x, v1.uv.y, v2.uv.x, v2.uv.y);
                normals.push(this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z, this.normal.x, this.normal.y, this.normal.z);
            }
            return data;
        };
        /**
         * 计算法线与w值
         */
        ThreeBSPPolygon.prototype.calculateProperties = function () {
            var a = this.vertices[0].position, b = this.vertices[1].position, c = this.vertices[2].position;
            this.normal = b.clone().subTo(a).crossTo(c.clone().subTo(a)).normalize();
            this.w = this.normal.clone().dot(a);
            return this;
        };
        ;
        /**
         * 克隆
         */
        ThreeBSPPolygon.prototype.clone = function () {
            var vertices = this.vertices.map(function (v) { return v.clone(); });
            return new ThreeBSPPolygon(vertices);
        };
        ;
        /**
         * 翻转多边形
         */
        ThreeBSPPolygon.prototype.invert = function () {
            this.normal.scaleNumber(-1);
            this.w *= -1;
            this.vertices.reverse();
            return this;
        };
        ;
        /**
         * 获取顶点与多边形所在平面相对位置
         * @param vertex
         */
        ThreeBSPPolygon.prototype.classifyVertex = function (vertex) {
            var side = this.normal.dot(vertex.position) - this.w;
            if (side < -EPSILON)
                return BACK;
            if (side > EPSILON)
                return FRONT;
            return COPLANAR;
        };
        /**
         * 计算与另外一个多边形的相对位置
         * @param polygon
         */
        ThreeBSPPolygon.prototype.classifySide = function (polygon) {
            var _this = this;
            var front = 0, back = 0;
            polygon.vertices.forEach(function (v) {
                var side = _this.classifyVertex(v);
                if (side == FRONT)
                    front += 1;
                else if (side == BACK)
                    back += 1;
            });
            if (front > 0 && back === 0) {
                return FRONT;
            }
            if (front === 0 && back > 0) {
                return BACK;
            }
            if (front === back && back === 0) {
                return COPLANAR;
            }
            return SPANNING;
        };
        /**
         * 切割多边形
         * @param poly
         */
        ThreeBSPPolygon.prototype.tessellate = function (poly) {
            var _this = this;
            if (this.classifySide(poly) !== SPANNING) {
                return [poly];
            }
            var f = [];
            var b = [];
            var count = poly.vertices.length;
            //切割多边形的每条边
            poly.vertices.forEach(function (item, i) {
                var vi = poly.vertices[i];
                var vj = poly.vertices[(i + 1) % count];
                var ti = _this.classifyVertex(vi);
                var tj = _this.classifyVertex(vj);
                if (ti !== BACK) {
                    f.push(vi);
                }
                if (ti !== FRONT) {
                    b.push(vi);
                }
                // 切割横跨多边形的边
                if ((ti | tj) === SPANNING) {
                    var t = (_this.w - _this.normal.dot(vi.position)) / _this.normal.dot(vj.clone().position.subTo(vi.position));
                    var v = vi.interpolate(vj, t);
                    f.push(v);
                    b.push(v);
                }
            });
            // 处理切割后的多边形
            var polys = [];
            if (f.length >= 3) {
                polys.push(new ThreeBSPPolygon(f));
            }
            if (b.length >= 3) {
                polys.push(new ThreeBSPPolygon(b));
            }
            return polys;
        };
        /**
         * 切割多边形并进行分类
         * @param polygon 被切割多边形
         * @param coplanar_front    切割后的平面正面多边形
         * @param coplanar_back     切割后的平面反面多边形
         * @param front 多边形在正面
         * @param back 多边形在反面
         */
        ThreeBSPPolygon.prototype.subdivide = function (polygon, coplanar_front, coplanar_back, front, back) {
            var _this = this;
            this.tessellate(polygon).forEach(function (poly) {
                var side = _this.classifySide(poly);
                switch (side) {
                    case FRONT:
                        front.push(poly);
                        break;
                    case BACK:
                        back.push(poly);
                        break;
                    case COPLANAR:
                        if (_this.normal.dot(poly.normal) > 0) {
                            coplanar_front.push(poly);
                        }
                        else {
                            coplanar_back.push(poly);
                        }
                        break;
                    default:
                        throw new Error("BUG: Polygon of classification " + side + " in subdivision");
                }
            });
        };
        ;
        return ThreeBSPPolygon;
    }());
    feng3d.ThreeBSPPolygon = ThreeBSPPolygon;
    /**
     * 结点
     */
    var ThreeBSPNode = /** @class */ (function () {
        function ThreeBSPNode(data) {
            this.polygons = [];
            if (!data)
                return;
            var positions = data.positions;
            var normals = data.normals;
            var uvs = data.uvs;
            var indices = data.indices;
            // 初始化多边形
            var polygons = [];
            for (var i = 0, n = indices.length; i < n; i += 3) {
                var polygon = new ThreeBSPPolygon();
                var i0 = indices[i];
                var i1 = indices[i + 1];
                var i2 = indices[i + 2];
                polygon.vertices = [
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]), new feng3d.Vector3(normals[i0 * 3], normals[i0 * 3 + 1], normals[i0 * 3 + 2]), new feng3d.Vector2(uvs[i0 * 2], uvs[i0 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]), new feng3d.Vector3(normals[i1 * 3], normals[i1 * 3 + 1], normals[i1 * 3 + 2]), new feng3d.Vector2(uvs[i1 * 2], uvs[i1 * 2 + 1])),
                    new ThreeBSPVertex(new feng3d.Vector3(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]), new feng3d.Vector3(normals[i2 * 3], normals[i2 * 3 + 1], normals[i2 * 3 + 2]), new feng3d.Vector2(uvs[i2 * 2], uvs[i2 * 2 + 1])),
                ];
                polygon.calculateProperties();
                polygons.push(polygon);
            }
            if (polygons.length) {
                this.build(polygons);
            }
        }
        /**
         * 获取几何体数据
         */
        ThreeBSPNode.prototype.getGeometryData = function () {
            var data = { positions: [], uvs: [], normals: [], indices: [] };
            var polygons = this.allPolygons();
            polygons.forEach(function (polygon) {
                polygon.getGeometryData(data);
            });
            for (var i = 0, indices = data.indices, n = data.positions.length / 3; i < n; i++) {
                indices.push(i);
            }
            return data;
        };
        /**
         * 克隆
         */
        ThreeBSPNode.prototype.clone = function () {
            var node = new ThreeBSPNode();
            node.divider = this.divider && this.divider.clone();
            node.polygons = this.polygons.map(function (element) {
                return element.clone();
            });
            node.front = this.front && this.front.clone();
            node.back = this.back && this.back.clone();
            return node;
        };
        ;
        /**
         * 构建树结点
         * @param polygons 多边形列表
         */
        ThreeBSPNode.prototype.build = function (polygons) {
            var _this = this;
            // 以第一个多边形为切割面
            if (this.divider == null) {
                this.divider = polygons[0].clone();
            }
            var front = [], back = [];
            //进行切割并分类
            polygons.forEach(function (poly) {
                _this.divider.subdivide(poly, _this.polygons, _this.polygons, front, back);
            });
            // 继续切割平面前的多边形
            if (front.length > 0) {
                this.front = this.front || new ThreeBSPNode();
                this.front.build(front);
            }
            // 继续切割平面后的多边形
            if (back.length > 0) {
                this.back = this.back || new ThreeBSPNode();
                this.back.build(back);
            }
            return this;
        };
        ;
        /**
         * 判定是否为凸面体
         * @param polys
         */
        ThreeBSPNode.prototype.isConvex = function (polys) {
            polys.every(function (inner) {
                return polys.every(function (outer) {
                    if (inner !== outer && outer.classifySide(inner) !== BACK) {
                        return false;
                    }
                    return true;
                });
            });
            return true;
        };
        ;
        /**
         * 所有多边形
         */
        ThreeBSPNode.prototype.allPolygons = function () {
            var front = (this.front && this.front.allPolygons()) || [];
            var back = (this.back && this.back.allPolygons()) || [];
            var polygons = this.polygons.slice().concat(front).concat(back);
            return polygons;
        };
        ;
        /**
         * 翻转
         */
        ThreeBSPNode.prototype.invert = function () {
            this.polygons.forEach(function (poly) {
                poly.invert();
            });
            this.divider && this.divider.invert();
            this.front && this.front.invert();
            this.back && this.back.invert();
            var temp = this.back;
            this.back = this.front;
            this.front = temp;
            return this;
        };
        ;
        /**
         * 裁剪多边形
         * @param polygons
         */
        ThreeBSPNode.prototype.clipPolygons = function (polygons) {
            var _this = this;
            if (!this.divider) {
                return polygons.slice();
            }
            var front = [];
            var back = [];
            polygons.forEach(function (polygon) {
                _this.divider.subdivide(polygon, front, back, front, back);
            });
            if (this.front) {
                front = this.front.clipPolygons(front);
            }
            if (this.back) {
                back = this.back.clipPolygons(back);
            }
            if (this.back) {
                return front.concat(back);
            }
            return front;
        };
        ;
        ThreeBSPNode.prototype.clipTo = function (node) {
            this.polygons = node.clipPolygons(this.polygons);
            this.front && this.front.clipTo(node);
            this.back && this.back.clipTo(node);
            return this;
        };
        ;
        return ThreeBSPNode;
    }());
    feng3d.ThreeBSPNode = ThreeBSPNode;
})(feng3d || (feng3d = {}));
var navigation;
(function (navigation) {
    var NavigationProcess = /** @class */ (function () {
        function NavigationProcess(geometry) {
            this.data = new NavigationData();
            this.data.init(geometry);
        }
        NavigationProcess.prototype.checkMaxSlope = function (maxSlope) {
            var _this = this;
            var up = new feng3d.Vector3(0, 1, 0);
            var mincos = Math.cos(maxSlope * feng3d.FMath.DEG2RAD);
            var keys = this.data.trianglemap.getKeys();
            keys.forEach(function (element) {
                var normal = _this.data.trianglemap.get(element).getNormal();
                var dot = normal.dot(up);
                if (dot < mincos) {
                    _this.data.trianglemap.delete(element);
                }
            });
        };
        NavigationProcess.prototype.checkAgentRadius = function (agentRadius) {
            var trianglemap = this.data.trianglemap;
            var linemap = this.data.linemap;
            var pointmap = this.data.pointmap;
            var line0map = new Map();
            //获取所有独立边
            var lines = this.getAllSingleLine();
            //调试独立边
            this.debugShowLines(lines);
            // 计算创建边缘边
            var line0s = lines.map(createLine0);
            // 调试边缘边内部方向
            this.debugShowLines1(line0s, agentRadius);
            // 方案1：遍历每个点，使得该点对所有边缘边保持大于agentRadius的距离
            // pointmap.getValues().forEach(handlePoint);
            // 方案2：遍历所有边缘边，把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上，
            line0s.forEach(handleLine0);
            trianglemap.getValues().forEach(function (triangle) {
                if (triangle.getNormal().dot(new feng3d.Vector3(0, 1, 0)) < 0)
                    trianglemap.delete(triangle.index);
            }); //删除面向-y方向的三角形
            // 方案3：在原有模型上减去 以独立边为轴以agentRadius为半径的圆柱（此处需要基于模型之间的剔除等运算）
            /**
             * 把所有在边缘边左边角内的点移到左边角平分线上，所有在边缘边右边角内的移到右边角平分线上
             * @param line0
             */
            function handleLine0(line0) {
                // 三条线段
                var ls = line0map.get(line0.leftline).segment;
                var cs = line0.segment;
                var rs = line0map.get(line0.rightline).segment;
                //
                var ld = line0map.get(line0.leftline).direction;
                var cd = line0.direction;
                var rd = line0map.get(line0.rightline).direction;
                // 顶点坐标
                var p0 = [ls.p0, ls.p1].filter(function (p) { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                var p1 = [ls.p0, ls.p1].filter(function (p) { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p2 = [rs.p0, rs.p1].filter(function (p) { return cs.p0.equals(p) || cs.p1.equals(p); })[0];
                var p3 = [rs.p0, rs.p1].filter(function (p) { return !cs.p0.equals(p) && !cs.p1.equals(p); })[0];
                // 角平分线上点坐标
                var lp = getHalfAnglePoint(p1, ld, cd, agentRadius);
                var rp = getHalfAnglePoint(p2, cd, rd, agentRadius);
                //debug
                pointGeometry.points.push({ position: lp });
                pointGeometry.points.push({ position: rp });
                pointGeometry.invalidateGeometry();
                //
                var hpmap = {};
                var points = linemap.get(line0.index).points.concat();
                handlePoints();
                function handlePoints() {
                    if (points.length == 0)
                        return;
                    var point = pointmap.get(points.shift());
                    //
                    var ld = ls.getPointDistance(point.getPoint());
                    var cd = cs.getPointDistance(point.getPoint());
                    var rd = rs.getPointDistance(point.getPoint());
                    //
                    if (cd < agentRadius) {
                        if (ld < agentRadius) //处理左夹角内点点
                         {
                            point.setPoint(lp);
                        }
                        else if (rd < agentRadius) //处理右夹角内点点
                         {
                            point.setPoint(rp);
                        }
                        else {
                            point.setPoint(point.getPoint().addTo(line0.direction.clone().scaleNumber(agentRadius - cd)));
                        }
                        //标记该点以被处理
                        hpmap[point.index] = true;
                        // 搜索临近点
                        point.getNearbyPoints().forEach(function (p) {
                            if (hpmap[p])
                                return;
                            if (points.indexOf(p) != -1)
                                return;
                            points.push(p);
                        });
                    }
                    handlePoints();
                }
                /**
                 * 获取对角线上距离角的两边距离为 distance 的点
                 * @param pa 角的第一个点
                 * @param d1 角点
                 * @param d2 角的第二个点
                 * @param distance 距离
                 */
                function getHalfAnglePoint(p0, d1, d2, distance) {
                    //对角线方向
                    var djx = d1.addTo(d2).normalize();
                    var cos = djx.dot(d1);
                    var targetPoint = p0.addTo(djx.clone().normalize(distance / cos));
                    return targetPoint;
                }
            }
            /**
             * 使得该点对所有边缘边保持大于agentRadius的距离
             * @param point
             */
            function handlePoint(point) {
                var p = point.getPoint();
                var crossline0s = line0s.reduce(function (result, line0) {
                    var distance = line0.segment.getPointDistance(p);
                    if (distance < agentRadius) {
                        result.push([line0, distance]);
                    }
                    return result;
                }, []);
                if (crossline0s.length == 0)
                    return;
                if (crossline0s.length == 1) {
                    point.setPoint(point.getPoint().addTo(crossline0s[0][0].direction.clone().scaleNumber(agentRadius - crossline0s[0][1])));
                }
                else {
                    //如果多于两条线段，取距离最近两条
                    if (crossline0s.length > 2) {
                        crossline0s.sort(function (a, b) { return a[1] - b[1]; });
                    }
                    //对角线方向
                    var djx = crossline0s[0][0].direction.addTo(crossline0s[1][0].direction).normalize();
                    //查找两条线段的共同点
                    var points0 = linemap.get(crossline0s[0][0].index).points;
                    var points1 = linemap.get(crossline0s[1][0].index).points;
                    var ps = points0.filter(function (v) { return points1.indexOf(v) != -1; });
                    if (ps.length == 1) {
                        var cross = pointmap.get(ps[0]).getPoint();
                        var cos = djx.dot(crossline0s[0][0].segment.p1.subTo(crossline0s[0][0].segment.p0).normalize());
                        var sin = Math.sqrt(1 - cos * cos);
                        var length = agentRadius / sin;
                        var targetPoint = cross.addTo(djx.clone().scaleNumber(length));
                        point.setPoint(targetPoint);
                    }
                    else {
                        ps.length;
                    }
                }
            }
            /**
             * 创建边缘边
             * @param line
             */
            function createLine0(line) {
                var line0 = new Line0();
                line0.index = line.index;
                var points = line.points.map(function (v) { var point = pointmap.get(v); return new feng3d.Vector3(point.value[0], point.value[1], point.value[2]); });
                line0.segment = new feng3d.Segment3D(points[0], points[1]);
                //
                var triangle = trianglemap.get(line.triangles[0]);
                if (!triangle)
                    return;
                var linepoints = line.points.map(function (v) { return pointmap.get(v); });
                var otherPoint = pointmap.get(triangle.points.filter(function (v) {
                    return line.points.indexOf(v) == -1;
                })[0]).getPoint();
                line0.direction = line0.segment.getNormalWithPoint(otherPoint);
                line0.leftline = pointmap.get(line.points[0]).lines.filter(function (line) {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter(function (l) {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0.rightline = pointmap.get(line.points[1]).lines.filter(function (line) {
                    if (line == line0.index)
                        return false;
                    var prelines = lines.filter(function (l) {
                        return l.index == line;
                    });
                    return prelines.length == 1;
                })[0];
                line0map.set(line0.index, line0);
                return line0;
            }
        };
        NavigationProcess.prototype.checkAgentHeight = function (agentHeight) {
            this.data.resetData();
            //
            var pointmap = this.data.pointmap;
            var linemap = this.data.linemap;
            var trianglemap = this.data.trianglemap;
            //
            var triangle0s = trianglemap.getValues().map(createTriangle);
            pointmap.getValues().forEach(handlePoint);
            //
            function createTriangle(triangle) {
                var triangle3D = triangle.getTriangle3D();
                return { triangle3D: triangle3D, index: triangle.index };
            }
            //
            function handlePoint(point) {
                // 测试点是否通过所有三角形测试
                var result = triangle0s.every(function (triangle0) {
                    return true;
                });
                // 测试失败时删除该点关联的三角形
                if (!result) {
                    point.triangles.forEach(function (triangleindex) {
                        trianglemap.delete(triangleindex);
                    });
                }
            }
        };
        NavigationProcess.prototype.getGeometry = function () {
            return this.data.getGeometry();
        };
        NavigationProcess.prototype.debugShowLines1 = function (line0s, length) {
            var segments = [];
            line0s.forEach(function (element) {
                var p0 = element.segment.p0.addTo(element.segment.p1).scaleNumber(0.5);
                var p1 = p0.addTo(element.direction.clone().normalize(length));
                segments.push({ start: p0, end: p1, startColor: new feng3d.Color4(1), endColor: new feng3d.Color4(0, 1) });
            });
            segmentGeometry.segments = segments;
        };
        NavigationProcess.prototype.debugShowLines = function (lines) {
            var _this = this;
            createSegment();
            var segments = [];
            lines.forEach(function (element) {
                var points = element.points.map(function (pointindex) {
                    var value = _this.data.pointmap.get(pointindex).value;
                    return new feng3d.Vector3(value[0], value[1], value[2]);
                });
                segments.push({ start: points[0], end: points[1] });
            });
            segmentGeometry.segments = segments;
        };
        /**
         * 获取所有独立边
         */
        NavigationProcess.prototype.getAllSingleLine = function () {
            var _this = this;
            var lines = [];
            var needLine = [];
            this.data.linemap.forEach(function (element) {
                element.triangles = element.triangles.filter(function (triangleIndex) { return _this.data.trianglemap.has(triangleIndex); });
                if (element.triangles.length == 1)
                    lines.push(element);
                else if (element.triangles.length == 0)
                    needLine.push(element);
            });
            needLine.forEach(function (element) {
                _this.data.linemap.delete(element.index);
            });
            return lines;
        };
        return NavigationProcess;
    }());
    navigation.NavigationProcess = NavigationProcess;
    /**
     * 点
     */
    var Point = /** @class */ (function () {
        function Point(pointmap, linemap, trianglemap) {
            /**
             * 点连接的线段索引列表
             */
            this.lines = [];
            /**
             * 点连接的三角形索引列表
             */
            this.triangles = [];
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }
        /**
         * 设置该点位置
         * @param p
         */
        Point.prototype.setPoint = function (p) {
            this.value = [p.x, p.y, p.z];
        };
        /**
         * 获取该点位置
         */
        Point.prototype.getPoint = function () {
            return new feng3d.Vector3(this.value[0], this.value[1], this.value[2]);
        };
        /**
         * 获取相邻点索引列表
         */
        Point.prototype.getNearbyPoints = function () {
            var _this = this;
            var points = this.triangles.reduce(function (points, triangleid) {
                var triangle = _this.trianglemap.get(triangleid);
                if (!triangle)
                    return points;
                triangle.points.forEach(function (point) {
                    if (point != _this.index)
                        points.push(point);
                });
                return points;
            }, []);
            return points;
        };
        return Point;
    }());
    /**
     * 边
     */
    var Line = /** @class */ (function () {
        function Line() {
            /**
             * 线段连接的三角形索引列表
             */
            this.triangles = [];
        }
        return Line;
    }());
    /**
     * 三角形
     */
    var Triangle = /** @class */ (function () {
        function Triangle(pointmap, linemap, trianglemap) {
            /**
             * 包含的三个边索引
             */
            this.lines = [];
            this.pointmap = pointmap;
            this.linemap = linemap;
            this.trianglemap = trianglemap;
        }
        Triangle.prototype.getTriangle3D = function () {
            var _this = this;
            var points = [];
            this.points.forEach(function (element) {
                var pointvalue = _this.pointmap.get(element).value;
                points.push(new feng3d.Vector3(pointvalue[0], pointvalue[1], pointvalue[2]));
            });
            var triangle3D = new feng3d.Triangle3D(points[0], points[1], points[2]);
            return triangle3D;
        };
        /**
         * 获取法线
         */
        Triangle.prototype.getNormal = function () {
            var normal = this.getTriangle3D().getNormal();
            return normal;
        };
        return Triangle;
    }());
    /**
     * 边
     */
    var Line0 = /** @class */ (function () {
        function Line0() {
        }
        return Line0;
    }());
    var NavigationData = /** @class */ (function () {
        function NavigationData() {
        }
        NavigationData.prototype.init = function (geometry) {
            var positions = geometry.positions;
            var indices = geometry.indices;
            feng3d.assert(indices.length % 3 == 0);
            var pointmap = this.pointmap = new Map();
            var linemap = this.linemap = new Map();
            var trianglemap = this.trianglemap = new Map();
            // 合并相同点
            var pointAutoIndex = 0;
            var pointcache = {};
            var pointindexmap = {}; //通过点原来索引映射到新索引
            //
            var lineAutoIndex = 0;
            var linecache = {};
            //
            for (var i = 0, n = positions.length; i < n; i += 3) {
                var point = createPoint(positions[i], positions[i + 1], positions[i + 2]);
                pointindexmap[i / 3] = point.index;
            }
            indices = indices.map(function (pointindex) { return pointindexmap[pointindex]; });
            //
            for (var i = 0, n = indices.length; i < n; i += 3) {
                var triangle = new Triangle(pointmap, linemap, trianglemap);
                triangle.index = i / 3;
                triangle.points = [indices[i], indices[i + 1], indices[i + 2]];
                trianglemap.set(triangle.index, triangle);
                //
                pointmap.get(indices[i]).triangles.push(triangle.index);
                pointmap.get(indices[i + 1]).triangles.push(triangle.index);
                pointmap.get(indices[i + 2]).triangles.push(triangle.index);
                //
                var points = triangle.points.concat().sort().map(function (value) { return pointmap.get(value); });
                createLine(points[0], points[1], triangle);
                createLine(points[0], points[2], triangle);
                createLine(points[1], points[2], triangle);
            }
            function createLine(point0, point1, triangle) {
                linecache[point0.index] = linecache[point0.index] || {};
                var line = linecache[point0.index][point1.index];
                if (!line) {
                    line = linecache[point0.index][point1.index] = new Line();
                    line.index = lineAutoIndex++;
                    line.points = [point0.index, point1.index];
                    linemap.set(line.index, line);
                    //
                    point0.lines.push(line.index);
                    point1.lines.push(line.index);
                }
                line.triangles.push(triangle.index);
                //
                triangle.lines.push(line.index);
            }
            function createPoint(x, y, z) {
                var xs = x.toPrecision(6);
                var ys = y.toPrecision(6);
                var zs = z.toPrecision(6);
                pointcache[xs] = pointcache[xs] || {};
                pointcache[xs][ys] = pointcache[xs][ys] || {};
                var point = pointcache[xs][ys][zs];
                if (!point) {
                    point = pointcache[xs][ys][zs] = new Point(pointmap, linemap, trianglemap);
                    point.index = pointAutoIndex++;
                    point.value = [x, y, z];
                    pointmap.set(point.index, point);
                }
                return point;
            }
        };
        NavigationData.prototype.getGeometry = function () {
            var _this = this;
            var positions = [];
            var pointIndexMap = new Map();
            var autoId = 0;
            var indices = [];
            this.trianglemap.forEach(function (element) {
                var points = element.points.map(function (pointIndex) {
                    if (pointIndexMap.has(pointIndex)) {
                        return pointIndexMap.get(pointIndex);
                    }
                    positions.push.apply(positions, _this.pointmap.get(pointIndex).value);
                    pointIndexMap.set(pointIndex, autoId++);
                    return autoId - 1;
                });
                indices.push.apply(indices, points);
            });
            return { positions: positions, indices: indices };
        };
        NavigationData.prototype.resetData = function () {
            var geometry = this.getGeometry();
            this.clearData();
            this.init(geometry);
        };
        NavigationData.prototype.clearData = function () {
            this.pointmap.forEach(function (point) {
                point.pointmap = point.linemap = point.trianglemap = null;
            });
            this.pointmap.clear();
            this.linemap.forEach(function (line) {
            });
            this.linemap.clear();
            this.trianglemap.forEach(function (triangle) {
            });
            this.trianglemap.clear();
        };
        return NavigationData;
    }());
})(navigation || (navigation = {}));
var segmentGeometry;
var debugSegment;
//
var pointGeometry;
var debugPoint;
function createSegment() {
    var parentobject = editor.engine.root.find("editorObject") || editor.engine.root;
    if (!debugSegment) {
        debugSegment = Object.setValue(new feng3d.GameObject(), { name: "segment" });
        debugSegment.mouseEnabled = false;
        //初始化材质
        var model = debugSegment.addComponent(feng3d.Model);
        var material = model.material = Object.setValue(new feng3d.Material(), {
            shaderName: "segment", renderParams: { renderMode: feng3d.RenderMode.LINES },
            uniforms: { u_segmentColor: new feng3d.Color4(1.0, 0, 0) },
        });
        segmentGeometry = model.geometry = new feng3d.SegmentGeometry();
    }
    parentobject.addChild(debugSegment);
    //
    if (!debugPoint) {
        debugPoint = Object.setValue(new feng3d.GameObject(), { name: "points" });
        debugPoint.mouseEnabled = false;
        var model = debugPoint.addComponent(feng3d.Model);
        pointGeometry = model.geometry = new feng3d.PointGeometry();
        var materialp = model.material = Object.setValue(new feng3d.Material(), {
            shaderName: "point", renderParams: { renderMode: feng3d.RenderMode.POINTS },
            uniforms: { u_PointSize: 5, u_color: new feng3d.Color4() },
        });
    }
    pointGeometry.points = [];
    parentobject.addChild(debugPoint);
}
var editor;
(function (editor) {
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
    var Recastnavigation = /** @class */ (function () {
        function Recastnavigation() {
            /**
             * 用于体素区分是否同属一个三角形
             */
            this._triangleId = 0;
        }
        /**
         * 执行重铸导航
         */
        Recastnavigation.prototype.doRecastnavigation = function (mesh, agent, voxelSize) {
            if (agent === void 0) { agent = new editor.NavigationAgent(); }
            this._aabb = feng3d.Box.formPositions(mesh.positions);
            this._voxelSize = voxelSize || new feng3d.Vector3(agent.radius / 3, agent.radius / 3, agent.radius / 3);
            this._agent = agent;
            // 
            var size = this._aabb.getSize().divide(this._voxelSize).ceil();
            this._numX = size.x + 1;
            this._numY = size.y + 1;
            this._numZ = size.z + 1;
            //
            this._voxels = [];
            for (var x = 0; x < this._numX; x++) {
                this._voxels[x] = [];
                for (var y = 0; y < this._numY; y++) {
                    this._voxels[x][y] = [];
                }
            }
            this._voxelizationMesh(mesh.indices, mesh.positions);
            this._applyAgent();
        };
        /**
         * 获取体素列表
         */
        Recastnavigation.prototype.getVoxels = function () {
            var voxels = [];
            for (var x = 0; x < this._numX; x++) {
                for (var y = 0; y < this._numY; y++) {
                    for (var z = 0; z < this._numZ; z++) {
                        if (this._voxels[x][y][z])
                            voxels.push(this._voxels[x][y][z]);
                    }
                }
            }
            return voxels;
        };
        /**
         * 栅格化网格
         */
        Recastnavigation.prototype._voxelizationMesh = function (indices, positions) {
            for (var i = 0, n = indices.length; i < n; i += 3) {
                var pi0 = indices[i] * 3;
                var p0 = [positions[pi0], positions[pi0 + 1], positions[pi0 + 2]];
                var pi1 = indices[i + 1] * 3;
                var p1 = [positions[pi1], positions[pi1 + 1], positions[pi1 + 2]];
                var pi2 = indices[i + 2] * 3;
                var p2 = [positions[pi2], positions[pi2 + 1], positions[pi2 + 2]];
                this._voxelizationTriangle(p0, p1, p2);
            }
        };
        /**
         * 栅格化三角形
         * @param p0 三角形第一个顶点
         * @param p1 三角形第二个顶点
         * @param p2 三角形第三个顶点
         */
        Recastnavigation.prototype._voxelizationTriangle = function (p0, p1, p2) {
            var _this = this;
            var triangle = feng3d.Triangle3D.fromPositions(p0.concat(p1).concat(p2));
            var normal = triangle.getNormal();
            var result = triangle.rasterizeCustom(this._voxelSize, this._aabb.min);
            result.forEach(function (v, i) {
                _this._voxels[v.xi][v.yi][v.zi] = {
                    x: v.xv,
                    y: v.yv,
                    z: v.zv,
                    normal: normal,
                    triangleId: _this._triangleId,
                    flag: VoxelFlag.Default,
                };
            });
            this._triangleId++;
        };
        /**
         * 应用代理进行计算出可行走体素
         */
        Recastnavigation.prototype._applyAgent = function () {
            this._agent.maxSlope;
            this._applyAgentMaxSlope();
            this._applyAgentHeight();
            // this._applyAgentRadius();
        };
        /**
         * 筛选出允许行走坡度的体素
         */
        Recastnavigation.prototype._applyAgentMaxSlope = function () {
            var mincos = Math.cos(this._agent.maxSlope * feng3d.FMath.DEG2RAD);
            this.getVoxels().forEach(function (v) {
                var dot = v.normal.dot(feng3d.Vector3.Y_AXIS);
                if (dot < mincos)
                    v.flag = v.flag | VoxelFlag.DontMaxSlope;
            });
        };
        Recastnavigation.prototype._applyAgentHeight = function () {
            for (var x = 0; x < this._numX; x++) {
                for (var z = 0; z < this._numZ; z++) {
                    var preVoxel = null;
                    for (var y = this._numY - 1; y >= 0; y--) {
                        var voxel = this._voxels[x][y][z];
                        if (!voxel)
                            continue;
                        // 不同属一个三角形且上下距离小于指定高度
                        if (preVoxel != null && preVoxel.triangleId != voxel.triangleId && preVoxel.y - voxel.y < this._agent.height) {
                            voxel.flag = voxel.flag | VoxelFlag.DontHeight;
                        }
                        preVoxel = voxel;
                    }
                }
            }
        };
        Recastnavigation.prototype._applyAgentRadius = function () {
            this._calculateContour();
        };
        Recastnavigation.prototype._calculateContour = function () {
            for (var x = 0; x < this._numX; x++) {
                for (var y = 0; y < this._numY; y++) {
                    for (var z = 0; z < this._numZ; z++) {
                        this._checkContourVoxel(x, y, z);
                    }
                }
            }
        };
        Recastnavigation.prototype._checkContourVoxel = function (x, y, z) {
            var voxel = this._voxels[x][y][z];
            if (!voxel)
                return;
            if (x == 0 || x == this._numX - 1 || y == 0 || y == this._numY - 1 || z == 0 || z == this._numZ - 1) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            }
            // this._getRoundVoxels();
            // 获取周围格子
            if (voxel.normal.equals(feng3d.Vector3.Z_AXIS)) {
            }
            voxel.normal;
            voxel.normal;
            if (!(this._isVoxelFlagDefault(x, y, z + 1) || this._voxels[x][y + 1][z + 1] || this._voxels[x][y - 1][z + 1])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 前
            if (!(this._voxels[x][y][z - 1] || this._voxels[x][y + 1][z - 1] || this._voxels[x][y - 1][z - 1])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 后
            if (!(this._voxels[x - 1][y][z] || this._voxels[x - 1][y + 1][z] || this._voxels[x - 1][y - 1][z])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 左
            if (!(this._voxels[x + 1][y][z] || this._voxels[x + 1][y + 1][z] || this._voxels[x + 1][y - 1][z])) {
                voxel.flag = voxel.flag | VoxelFlag.IsContour;
                return;
            } // 右
        };
        Recastnavigation.prototype._isVoxelFlagDefault = function (x, y, z) {
            var voxel = this._voxels[x][y][z];
            if (!voxel)
                return false;
            return voxel.flag == VoxelFlag.Default;
        };
        return Recastnavigation;
    }());
    editor.Recastnavigation = Recastnavigation;
    var VoxelFlag;
    (function (VoxelFlag) {
        VoxelFlag[VoxelFlag["Default"] = 0] = "Default";
        VoxelFlag[VoxelFlag["DontMaxSlope"] = 1] = "DontMaxSlope";
        VoxelFlag[VoxelFlag["DontHeight"] = 2] = "DontHeight";
        VoxelFlag[VoxelFlag["IsContour"] = 4] = "IsContour";
    })(VoxelFlag = editor.VoxelFlag || (editor.VoxelFlag = {}));
})(editor || (editor = {}));
var egret;
(function (egret) {
    (function () {
        document.body.oncontextmenu = function () { return false; };
        //给反射添加查找的空间
        feng3d.classUtils.addClassNameSpace("editor");
        feng3d.classUtils.addClassNameSpace("egret");
    })();
    //-----------------------------------------------------------
    (function () {
        //调整默认字体大小
        egret.TextField.default_size = 12;
        // 扩展焦点在文本中时 禁止出发快捷键
        var oldfocusHandler = egret.InputController.prototype["focusHandler"];
        egret.InputController.prototype["focusHandler"] = function (event) {
            oldfocusHandler.call(this, event);
            feng3d.shortcut.enable = !this._isFocus;
        };
        var oldblurHandler = egret.InputController.prototype["blurHandler"];
        egret.InputController.prototype["blurHandler"] = function (event) {
            oldblurHandler.call(this, event);
            feng3d.shortcut.enable = !this._isFocus;
        };
    })();
    // (() =>
    // {
    //     // 扩展 TextInput , 焦点在文本中时，延缓外部通过text属性赋值到失去焦点时生效
    //     var descriptor = Object.getOwnPropertyDescriptor(eui.TextInput.prototype, "text");
    //     var oldTextSet = descriptor.set;
    //     descriptor.set = function (value)
    //     {
    //         if (this["isFocus"])
    //         {
    //             this["__temp_value__"] = value;
    //         }
    //         else
    //         {
    //             oldTextSet.call(this, value);
    //         }
    //     }
    //     Object.defineProperty(eui.TextInput.prototype, "text", descriptor);
    //     var oldFocusOutHandler = eui.TextInput.prototype["focusOutHandler"];
    //     eui.TextInput.prototype["focusOutHandler"] = function (event)
    //     {
    //         oldFocusOutHandler.call(this, event);
    //         if (this["__temp_value__"] != undefined)
    //         {
    //             this["text"] = this["__temp_value__"];
    //             delete this["__temp_value__"];
    //         }
    //     }
    // })();
    // 扩展 Scroller 组件，添加鼠标滚轮事件
    (function () {
        var oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
        eui.Scroller.prototype.$onAddToStage = function (stage, nestLevel) {
            oldOnAddToStage.call(this, stage, nestLevel);
            feng3d.windowEventProxy.on("wheel", onMouseWheel, this);
        };
        var oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
        eui.Scroller.prototype.$onRemoveFromStage = function () {
            oldOnRemoveFromStage.call(this);
            feng3d.windowEventProxy.off("wheel", onMouseWheel, this);
        };
        // 阻止拖拽滚动面板
        eui.Scroller.prototype["onTouchBeginCapture"] = function () {
        };
        function onMouseWheel(event) {
            var scroller = this;
            if (scroller.hitTestPoint(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                scroller.viewport.scrollV = feng3d.FMath.clamp(scroller.viewport.scrollV + event.deltaY * 0.3, 0, scroller.viewport.contentHeight - scroller.height);
            }
        }
    })();
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.MouseEvent = egret.TouchEvent;
    (function () {
        //映射事件名称
        egret.MouseEvent.MOUSE_DOWN = "mousedown";
        egret.MouseEvent.MIDDLE_MOUSE_DOWN = "middlemousedown";
        egret.MouseEvent.MOUSE_UP = "mouseup";
        egret.MouseEvent.MIDDLE_MOUSE_UP = "middlemouseup";
        egret.MouseEvent.RIGHT_MOUSE_UP = "rightmouseup";
        egret.MouseEvent.MOUSE_MOVE = "mousemove";
        egret.MouseEvent.CLICK = "click";
        egret.MouseEvent.MIDDLE_Click = "middleclick";
        egret.MouseEvent.MOUSE_OUT = "mouseout";
        egret.MouseEvent.RIGHT_MOUSE_DOWN = "rightmousedown";
        egret.MouseEvent.RIGHT_CLICK = "rightclick";
        egret.MouseEvent.DOUBLE_CLICK = "dblclick";
        //
    })();
    var overDisplayObject;
    egret.mouseEventEnvironment = function () {
        var webTouchHandler;
        var canvas;
        var touch;
        // 鼠标按下时选中对象
        var mousedownObject;
        // /**
        //  * 鼠标按下的按钮编号
        //  */
        // var mousedownButton: number;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;
        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);
        feng3d.windowEventProxy.on("mousedown", function (e) {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            // mousedownButton = e.button;
            mousedownObject = target;
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_DOWN, true, true, x, y);
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_DOWN, true, true, x, y);
            }
        });
        feng3d.windowEventProxy.on("mouseup", function (e) {
            //右键按下
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            if (e.button == 0) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.CLICK, true, true, x, y);
                }
            }
            else if (e.button == 1) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MIDDLE_Click, true, true, x, y);
                }
            }
            else if (e.button == 2) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_MOUSE_UP, true, true, x, y);
                if (mousedownObject == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
                }
            }
            mousedownObject = null;
        });
        feng3d.windowEventProxy.on("dblclick", function (e) {
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.DOUBLE_CLICK, true, true, x, y);
        });
        // 调试，查看鼠标下的对象
        feng3d.windowEventProxy.on("keyup", function (e) {
            if (e.key == "p") {
                var location = webTouchHandler.getLocation(e);
                var target = touch["findTarget"](location.x, location.y);
                var arr = [target];
                while (target.parent) {
                    target = target.parent;
                    arr.push(target);
                }
                window["earr"] = arr;
                console.log(arr);
            }
        });
        function onMouseMove(event) {
            var location = webTouchHandler.getLocation(event);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.MOUSE_MOVE, true, true, x, y);
            if (target == overDisplayObject)
                return;
            var preOverDisplayObject = overDisplayObject;
            overDisplayObject = target;
            if (preOverDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(preOverDisplayObject, egret.MouseEvent.MOUSE_OUT, true, true, x, y);
            }
            if (overDisplayObject) {
                egret.TouchEvent.dispatchTouchEvent(overDisplayObject, egret.MouseEvent.MOUSE_OVER, true, true, x, y);
            }
        }
        function getWebTouchHandler() {
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            var player = null;
            for (var i = 0; i < length; i++) {
                var container = list[i];
                player = container["egret-player"];
                if (player)
                    break;
            }
            return player.webTouchHandler;
        }
    };
})(egret || (egret = {}));
var editor;
(function (editor) {
    /**
     * 编辑器脚本
     */
    var EditorScript = /** @class */ (function (_super) {
        __extends(EditorScript, _super);
        function EditorScript() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.flag = feng3d.RunEnvironment.editor;
            return _this;
        }
        return EditorScript;
    }(feng3d.Behaviour));
    editor.EditorScript = EditorScript;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var MouseRayTestScript = /** @class */ (function (_super) {
        __extends(MouseRayTestScript, _super);
        function MouseRayTestScript() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MouseRayTestScript.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            feng3d.windowEventProxy.on("click", this.onclick, this);
        };
        MouseRayTestScript.prototype.onclick = function () {
            var gameobject = Object.setValue(new feng3d.GameObject(), { name: "test" });
            var model = gameobject.addComponent(feng3d.Model);
            model.material = new feng3d.Material();
            model.geometry = Object.setValue(new feng3d.SphereGeometry(), { radius: 10 });
            gameobject.mouseEnabled = false;
            var mouseRay3D = editor.engine.camera.getMouseRay3D();
            this.gameObject.addChild(gameobject);
            var position = mouseRay3D.position.clone();
            var direction = mouseRay3D.direction.clone();
            position = gameobject.transform.inverseTransformPoint(position);
            direction = gameobject.transform.inverseTransformDirection(direction);
            gameobject.transform.position = position;
            var num = 1000;
            var translate = function () {
                gameobject.transform.translate(direction, 15);
                if (num > 0) {
                    setTimeout(function () {
                        translate();
                    }, 1000 / 60);
                }
                else {
                    gameobject.remove();
                }
                num--;
            };
            translate();
        };
        MouseRayTestScript.prototype.update = function () {
        };
        /**
         * 销毁
         */
        MouseRayTestScript.prototype.dispose = function () {
            feng3d.windowEventProxy.off("click", this.onclick, this);
        };
        return MouseRayTestScript;
    }(editor.EditorScript));
    editor.MouseRayTestScript = MouseRayTestScript;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var DirectionLightIcon = /** @class */ (function (_super) {
        __extends(DirectionLightIcon, _super);
        function DirectionLightIcon() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.__class__ = "editor.DirectionLightIcon";
            return _this;
        }
        DirectionLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        DirectionLightIcon.prototype.initicon = function () {
            var linesize = 10;
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "Icon", components: [{ __class__: "feng3d.BillboardComponent", camera: editor.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: { s_texture: { __class__: "feng3d.UrlImageTexture2D", url: editor.editorData.getEditorAssetsPath("assets/3d/icons/sun.png"), format: feng3d.TextureFormat.RGBA, premulAlpha: true, }, }, renderParams: { enableBlend: true }
                        },
                    },],
            });
            this._textureMaterial = lightIcon.addComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);
            //
            var num = 10;
            var segments = [];
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
            }
            num = 36;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1) * linesize;
                var y1 = Math.cos(angle1) * linesize;
                segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{ __class__: "feng3d.HoldSizeComponent", camera: editor.editorCamera, holdSize: 1 },
                    {
                        __class__: "feng3d.MeshModel",
                        material: { __class__: "feng3d.Material", shaderName: "segment", uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 163 / 255, g: 162 / 255, b: 107 / 255 } }, renderParams: { renderMode: feng3d.RenderMode.LINES } },
                        geometry: { __class__: "feng3d.SegmentGeometry", segments: segments },
                    },],
            });
            this.gameObject.addChild(lightLines);
            this.enabled = true;
        };
        DirectionLightIcon.prototype.update = function () {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this._lightLines.visible = editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        };
        DirectionLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            _super.prototype.dispose.call(this);
        };
        DirectionLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        };
        DirectionLightIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        };
        DirectionLightIcon.prototype.onMousedown = function () {
            editor.editorData.selectObject(this.light.gameObject);
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onLightChanged")
        ], DirectionLightIcon.prototype, "light", void 0);
        return DirectionLightIcon;
    }(editor.EditorScript));
    editor.DirectionLightIcon = DirectionLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var PointLightIcon = /** @class */ (function (_super) {
        __extends(PointLightIcon, _super);
        function PointLightIcon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PointLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        PointLightIcon.prototype.initicon = function () {
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "Icon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: editor.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                        material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.UrlImageTexture2D",
                                    url: editor.editorData.getEditorAssetsPath("assets/3d/icons/light.png"),
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                },
                            },
                            renderParams: { enableBlend: true },
                        },
                    },
                ],
            });
            this._textureMaterial = lightIcon.getComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material",
                            shaderName: "segment",
                            uniforms: {
                                u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 },
                            }, renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true, }
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    }]
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = Object.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshModel",
                        geometry: {
                            __class__: "feng3d.PointGeometry",
                            points: [
                                { position: { __class__: "feng3d.Vector3", x: 1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                                { position: { __class__: "feng3d.Vector3", x: -1 }, color: { __class__: "feng3d.Color4", r: 1 } },
                                { position: { __class__: "feng3d.Vector3", y: 1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                                { position: { __class__: "feng3d.Vector3", y: -1 }, color: { __class__: "feng3d.Color4", g: 1 } },
                                { position: { __class__: "feng3d.Vector3", z: 1 }, color: { __class__: "feng3d.Color4", b: 1 } },
                                { position: { __class__: "feng3d.Vector3", z: -1 }, color: { __class__: "feng3d.Color4", b: 1 } }
                            ],
                        },
                        material: {
                            __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { renderMode: feng3d.RenderMode.POINTS, enableBlend: true, },
                        },
                    }],
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        PointLightIcon.prototype.update = function () {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this._lightLines.transform.scale =
                this._lightpoints.transform.scale =
                    new feng3d.Vector3(this.light.range, this.light.range, this.light.range);
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(editor.editorCamera.gameObject.transform.scenePosition);
                //
                var segments = [];
                var alpha = 1;
                var backalpha = 0.5;
                var num = 36;
                var point0;
                var point1;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(0, x, y);
                    point1 = new feng3d.Vector3(0, x1, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                    point0 = new feng3d.Vector3(x, 0, y);
                    point1 = new feng3d.Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                    point0 = new feng3d.Vector3(x, y, 0);
                    point1 = new feng3d.Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
                }
                this._segmentGeometry.segments = segments;
                this._pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this._pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        };
        PointLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            _super.prototype.dispose.call(this);
        };
        PointLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        };
        PointLightIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        };
        PointLightIcon.prototype.onMousedown = function () {
            editor.editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onLightChanged")
        ], PointLightIcon.prototype, "light", void 0);
        return PointLightIcon;
    }(editor.EditorScript));
    editor.PointLightIcon = PointLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var SpotLightIcon = /** @class */ (function (_super) {
        __extends(SpotLightIcon, _super);
        function SpotLightIcon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpotLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        SpotLightIcon.prototype.initicon = function () {
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "Icon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: editor.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.UrlImageTexture2D",
                                    url: editor.editorData.getEditorAssetsPath("assets/3d/icons/spot.png"),
                                    format: feng3d.TextureFormat.RGBA,
                                    premulAlpha: true,
                                }
                            },
                            renderParams: { enableBlend: true },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this._textureMaterial = lightIcon.getComponent(feng3d.Model).material;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material", shaderName: "segment",
                            uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                            renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    },
                ],
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = Object.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshModel",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        SpotLightIcon.prototype.update = function () {
            if (!this.light)
                return;
            this._textureMaterial.uniforms.u_color = this.light.color.toColor4();
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var points = [];
                var segments = [];
                var num = 36;
                var point0;
                var point1;
                var radius = this.light.range * Math.tan(this.light.angle * feng3d.FMath.DEG2RAD * 0.5);
                var distance = this.light.range;
                for (var i = 0; i < num; i++) {
                    var angle = i * Math.PI * 2 / num;
                    var x = Math.sin(angle);
                    var y = Math.cos(angle);
                    var angle1 = (i + 1) * Math.PI * 2 / num;
                    var x1 = Math.sin(angle1);
                    var y1 = Math.cos(angle1);
                    //
                    point0 = new feng3d.Vector3(x * radius, y * radius, distance);
                    point1 = new feng3d.Vector3(x1 * radius, y1 * radius, distance);
                    segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                }
                //
                points.push({ position: new feng3d.Vector3(0, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, -radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, -radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(-radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(-radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, radius, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(0, radius, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(radius, 0, distance), startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                points.push({ position: new feng3d.Vector3(radius, 0, distance), color: new feng3d.Color4(1, 1, 0, 1) });
                this._pointGeometry.points = points;
                this._segmentGeometry.segments = segments;
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        };
        SpotLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this._textureMaterial = null;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            _super.prototype.dispose.call(this);
        };
        SpotLightIcon.prototype.onLightChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
            }
        };
        SpotLightIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.light.transform.localToWorldMatrix;
        };
        SpotLightIcon.prototype.onMousedown = function () {
            editor.editorData.selectObject(this.light.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onLightChanged")
        ], SpotLightIcon.prototype, "light", void 0);
        return SpotLightIcon;
    }(editor.EditorScript));
    editor.SpotLightIcon = SpotLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var CameraIcon = /** @class */ (function (_super) {
        __extends(CameraIcon, _super);
        function CameraIcon() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._lensChanged = true;
            return _this;
        }
        CameraIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        CameraIcon.prototype.initicon = function () {
            var lightIcon = this._lightIcon = Object.setValue(new feng3d.GameObject(), {
                name: "Icon", components: [
                    { __class__: "feng3d.BillboardComponent", camera: editor.editorCamera },
                    {
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material",
                            shaderName: "texture",
                            uniforms: {
                                s_texture: {
                                    __class__: "feng3d.UrlImageTexture2D",
                                    url: editor.editorData.getEditorAssetsPath("assets/3d/icons/camera.png"),
                                    format: feng3d.TextureFormat.RGBA,
                                }
                            },
                            renderParams: { enableBlend: true, depthMask: false },
                        },
                        geometry: { __class__: "feng3d.PlaneGeometry", width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false },
                    },
                ]
            });
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this._lightLines = Object.setValue(new feng3d.GameObject(), {
                name: "Lines", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide,
                components: [{
                        __class__: "feng3d.MeshModel", material: {
                            __class__: "feng3d.Material",
                            shaderName: "segment",
                            uniforms: { u_segmentColor: { __class__: "feng3d.Color4", r: 1, g: 1, b: 1, a: 0.5 } },
                            renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.LINES },
                        },
                        geometry: { __class__: "feng3d.SegmentGeometry" },
                    },
                ],
            });
            this._segmentGeometry = lightLines.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this._lightpoints = Object.setValue(new feng3d.GameObject(), {
                name: "points", mouseEnabled: false, hideFlags: feng3d.HideFlags.Hide, components: [
                    {
                        __class__: "feng3d.MeshModel",
                        material: { __class__: "feng3d.Material", shaderName: "point", uniforms: { u_PointSize: 5 }, renderParams: { enableBlend: true, renderMode: feng3d.RenderMode.POINTS } },
                        geometry: { __class__: "feng3d.PointGeometry", },
                    },
                ]
            });
            this._pointGeometry = lightpoints.getComponent(feng3d.Model).geometry;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        CameraIcon.prototype.update = function () {
            if (!this.camera)
                return;
            if (editor.editorData.selectedGameObjects.indexOf(this.camera.gameObject) != -1) {
                if (this._lensChanged) {
                    //
                    var points = [];
                    var segments = [];
                    var lens = this.camera.lens;
                    var near = lens.near;
                    var far = lens.far;
                    var aspect = lens.aspect;
                    if (lens instanceof feng3d.PerspectiveLens) {
                        var fov = lens.fov;
                        var tan = Math.tan(fov * Math.PI / 360);
                        //
                        var nearLeft = -tan * near * aspect;
                        var nearRight = tan * near * aspect;
                        var nearTop = tan * near;
                        var nearBottom = -tan * near;
                        var farLeft = -tan * far * aspect;
                        var farRight = tan * far * aspect;
                        var farTop = tan * far;
                        var farBottom = -tan * far;
                        //
                    }
                    else if (lens instanceof feng3d.OrthographicLens) {
                        var size = lens.size;
                        //
                        var nearLeft = -size * aspect;
                        var nearRight = size;
                        var nearTop = size;
                        var nearBottom = -size;
                        var farLeft = -size;
                        var farRight = size;
                        var farTop = size;
                        var farBottom = -size;
                    }
                    points.push({ position: new feng3d.Vector3(0, farBottom, far) }, { position: new feng3d.Vector3(0, farTop, far) }, { position: new feng3d.Vector3(farLeft, 0, far) }, { position: new feng3d.Vector3(farRight, 0, far) });
                    segments.push({ start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearRight, nearBottom, near) }, { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(nearLeft, nearTop, near) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(nearRight, nearTop, near) }, 
                    //
                    { start: new feng3d.Vector3(nearLeft, nearBottom, near), end: new feng3d.Vector3(farLeft, farBottom, far) }, { start: new feng3d.Vector3(nearLeft, nearTop, near), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(nearRight, nearBottom, near), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(nearRight, nearTop, near), end: new feng3d.Vector3(farRight, farTop, far) }, 
                    //
                    { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farRight, farBottom, far) }, { start: new feng3d.Vector3(farLeft, farBottom, far), end: new feng3d.Vector3(farLeft, farTop, far) }, { start: new feng3d.Vector3(farLeft, farTop, far), end: new feng3d.Vector3(farRight, farTop, far) }, { start: new feng3d.Vector3(farRight, farBottom, far), end: new feng3d.Vector3(farRight, farTop, far) });
                    this._pointGeometry.points = points;
                    this._segmentGeometry.segments = segments;
                    this._lensChanged = false;
                }
                //
                this._lightLines.visible = true;
                this._lightpoints.visible = true;
            }
            else {
                this._lightLines.visible = false;
                this._lightpoints.visible = false;
            }
        };
        CameraIcon.prototype.dispose = function () {
            this.enabled = false;
            //
            this._lightIcon.dispose();
            this._lightLines.dispose();
            this._lightpoints.dispose();
            this._lightIcon = null;
            this._lightLines = null;
            this._lightpoints = null;
            this._segmentGeometry = null;
            _super.prototype.dispose.call(this);
        };
        CameraIcon.prototype.onCameraChanged = function (property, oldValue, value) {
            if (oldValue) {
                oldValue.off("scenetransformChanged", this.onScenetransformChanged, this);
                oldValue.off("lensChanged", this.onLensChanged, this);
            }
            if (value) {
                this.onScenetransformChanged();
                value.on("scenetransformChanged", this.onScenetransformChanged, this);
                value.on("lensChanged", this.onLensChanged, this);
            }
        };
        CameraIcon.prototype.onLensChanged = function () {
            this._lensChanged = true;
        };
        CameraIcon.prototype.onScenetransformChanged = function () {
            this.transform.localToWorldMatrix = this.camera.transform.localToWorldMatrix;
        };
        CameraIcon.prototype.onMousedown = function () {
            editor.editorData.selectObject(this.camera.gameObject);
            // 防止再次调用鼠标拾取
            feng3d.shortcut.activityState("selectInvalid");
            feng3d.ticker.once(100, function () {
                feng3d.shortcut.deactivityState("selectInvalid");
            });
        };
        __decorate([
            feng3d.watch("onCameraChanged")
        ], CameraIcon.prototype, "camera", void 0);
        return CameraIcon;
    }(editor.EditorScript));
    editor.CameraIcon = CameraIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var ThreejsLoader = /** @class */ (function () {
        function ThreejsLoader() {
        }
        ThreejsLoader.prototype.load = function (url, completed) {
            editor.editorFS.fs.readArrayBuffer(url, function (err, data) {
                load(data, function (gameobject) {
                    gameobject.name = feng3d.pathUtils.getName(url);
                    feng3d.feng3dDispatcher.dispatch("assets.parsed", gameobject);
                });
            });
        };
        return ThreejsLoader;
    }());
    editor.ThreejsLoader = ThreejsLoader;
    editor.threejsLoader = new ThreejsLoader();
    var usenumberfixed = true;
    function load(url, onParseComplete) {
        var skeletonComponent;
        prepare(function () {
            //
            var loader = new window["THREE"].FBXLoader();
            if (typeof url == "string") {
                loader.load(url, onLoad, onProgress, onError);
            }
            else if (url instanceof ArrayBuffer) {
                var scene = loader.parse(url);
                onLoad(scene);
            }
            else {
                var reader = new FileReader();
                reader.addEventListener('load', function (event) {
                    var scene = loader.parse(event.target["result"]);
                    onLoad(scene);
                }, false);
                reader.readAsArrayBuffer(url);
            }
        });
        function onLoad(scene) {
            var gameobject = parse(scene);
            gameobject.transform.sx = -1;
            onParseComplete && onParseComplete(gameobject);
            feng3d.log("onLoad");
        }
        function onProgress(event) {
            feng3d.log(event);
        }
        function onError(err) {
            feng3d.error(err);
        }
        function parse(object3d, parent) {
            if (object3d.type == "Bone")
                return null;
            var gameobject = Object.setValue(new feng3d.GameObject(), { name: object3d.name });
            gameobject.transform.position = new feng3d.Vector3(object3d.position.x, object3d.position.y, object3d.position.z);
            gameobject.transform.orientation = new feng3d.Quaternion(object3d.quaternion.x, object3d.quaternion.y, object3d.quaternion.z, object3d.quaternion.w);
            gameobject.transform.scale = new feng3d.Vector3(object3d.scale.x, object3d.scale.y, object3d.scale.z);
            if (parent)
                parent.addChild(gameobject);
            switch (object3d.type) {
                case "PerspectiveCamera":
                    gameobject.addComponent(feng3d.Camera).lens = parsePerspectiveCamera(object3d);
                    break;
                case "SkinnedMesh":
                    var skinnedModel = gameobject.addComponent(feng3d.SkinnedModel);
                    skinnedModel.geometry = parseGeometry(object3d.geometry);
                    skinnedModel.material.renderParams.cullFace = feng3d.CullFace.NONE;
                    feng3d.assert(object3d.bindMode == "attached");
                    skinnedModel.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                    if (parent)
                        skinnedModel.initMatrix3d = gameobject.transform.localToWorldMatrix.clone();
                    break;
                case "Mesh":
                    var model = gameobject.addComponent(feng3d.Model);
                    model.geometry = parseGeometry(object3d.geometry);
                    model.material.renderParams.cullFace = feng3d.CullFace.NONE;
                    break;
                case "Group":
                    if (object3d.skeleton) {
                        skeletonComponent = gameobject.addComponent(feng3d.SkeletonComponent);
                        skeletonComponent.joints = parseSkeleton(object3d.skeleton);
                    }
                    break;
                case "Bone":
                    //Bone 由SkeletonComponent自动生成，不用解析
                    break;
                default:
                    feng3d.warn("\u6CA1\u6709\u63D0\u4F9B " + object3d.type + " \u7C7B\u578B\u5BF9\u8C61\u7684\u89E3\u6790");
                    break;
            }
            if (object3d.animations && object3d.animations.length > 0) {
                var animation = gameobject.addComponent(feng3d.Animation);
                for (var i = 0; i < object3d.animations.length; i++) {
                    var animationClip = parseAnimations(object3d.animations[i]);
                    animation.animations.push(animationClip);
                    animation.animation = animation.animations[0];
                }
            }
            object3d.children.forEach(function (element) {
                parse(element, gameobject);
            });
            return gameobject;
        }
    }
    function parseAnimations(animationClipData) {
        var matrixTemp = new window["THREE"].Matrix4();
        var quaternionTemp = new window["THREE"].Quaternion();
        var fmatrix3d = new feng3d.Matrix4x4();
        //
        var animationClip = new feng3d.AnimationClip();
        animationClip.name = animationClipData.name;
        animationClip.length = animationClipData.duration * 1000;
        animationClip.propertyClips = [];
        var tracks = animationClipData.tracks;
        var len = tracks.length;
        for (var i = 0; i < len; i++) {
            var propertyClip = parsePropertyClip(tracks[i]);
            animationClip.propertyClips.push(propertyClip);
        }
        return animationClip;
        function parsePropertyClip(keyframeTrack) {
            var propertyClip = new feng3d.PropertyClip();
            var trackName = keyframeTrack.name;
            var result = /\.bones\[(\w+)\]\.(\w+)/.exec(trackName);
            propertyClip.path = [
                [feng3d.PropertyClipPathItemType.GameObject, result[1]],
                [feng3d.PropertyClipPathItemType.Component, , "feng3d.Transform"],
            ];
            switch (result[2]) {
                case "position":
                    propertyClip.propertyName = "position";
                    break;
                case "scale":
                    propertyClip.propertyName = "scale";
                    break;
                case "quaternion":
                    propertyClip.propertyName = "orientation";
                    break;
                default:
                    feng3d.warn("\u6CA1\u6709\u5904\u7406 propertyName " + result[2]);
                    break;
            }
            propertyClip.propertyValues = [];
            var propertyValues = propertyClip.propertyValues;
            var times = keyframeTrack.times;
            var values = ds.utils.arrayFrom(keyframeTrack.values);
            if (usenumberfixed) {
                values = values.map(function (v) { return Number(v.toFixed(6)); });
            }
            var len = times.length;
            switch (keyframeTrack.ValueTypeName) {
                case "vector":
                    propertyClip.type = "Vector3";
                    for (var i = 0; i < len; i++) {
                        propertyValues.push([times[i] * 1000, [values[i * 3], values[i * 3 + 1], values[i * 3 + 2]]]);
                    }
                    break;
                case "quaternion":
                    propertyClip.type = "Quaternion";
                    for (var i = 0; i < len; i++) {
                        propertyValues.push([times[i] * 1000, [values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3]]]);
                    }
                    break;
                default:
                    feng3d.warn("\u6CA1\u6709\u63D0\u4F9B\u89E3\u6790 " + keyframeTrack.ValueTypeName + " \u7C7B\u578BTrack\u6570\u636E");
                    break;
            }
            return propertyClip;
        }
    }
    function parseSkeleton(skeleton) {
        var joints = [];
        var skeNameDic = {};
        var len = skeleton.bones.length;
        for (var i = 0; i < len; i++) {
            skeNameDic[skeleton.bones[i].name] = i;
        }
        for (var i = 0; i < len; i++) {
            var bone = skeleton.bones[i];
            var skeletonJoint = joints[i] = new feng3d.SkeletonJoint();
            //
            skeletonJoint.name = bone.name;
            skeletonJoint.matrix3D = new feng3d.Matrix4x4(bone.matrixWorld.elements);
            var parentId = skeNameDic[bone.parent.name];
            if (parentId === undefined)
                parentId = -1;
            skeletonJoint.parentIndex = parentId;
        }
        return joints;
    }
    function parseSkinnedSkeleton(skeleton, skinSkeletonData) {
        var skinSkeleton = new feng3d.SkinSkeletonTemp();
        var joints = skeleton.joints;
        var jointsMap = {};
        for (var i = 0; i < joints.length; i++) {
            jointsMap[joints[i].name] = [i, joints[i].name];
        }
        var bones = skinSkeletonData.bones;
        var len = bones.length;
        skinSkeleton.numJoint = len;
        for (var i = 0; i < len; i++) {
            var jointsMapitem = jointsMap[bones[i].name];
            if (jointsMapitem == null && bones[i].parent) {
                jointsMapitem = jointsMap[bones[i].parent.name];
            }
            if (jointsMapitem) {
                skinSkeleton.joints[i] = jointsMapitem;
                joints[jointsMapitem[0]].matrix3D = new feng3d.Matrix4x4(skinSkeletonData.boneInverses[i].elements).invert();
            }
            else {
                feng3d.warn("\u6CA1\u6709\u5728\u9AA8\u67B6\u4E2D\u627E\u5230 \u9AA8\u9ABC " + bones[i].name);
            }
        }
        return skinSkeleton;
    }
    function parseGeometry(geometry) {
        var attributes = geometry.attributes;
        var geo = new feng3d.CustomGeometry();
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                var element = attributes[key];
                var array = ds.utils.arrayFrom(element.array);
                if (usenumberfixed) {
                    array = array.map(function (v) { return Number(v.toFixed(6)); });
                }
                switch (key) {
                    case "position":
                        geo.positions = array;
                        break;
                    case "normal":
                        geo.normals = array;
                        break;
                    case "uv":
                        geo.uvs = array;
                        break;
                    case "skinIndex":
                        geo.setVAData("a_jointindex0", array, 4);
                        break;
                    case "skinWeight":
                        geo.setVAData("a_jointweight0", array, 4);
                        break;
                    default:
                        feng3d.warn("没有解析顶点数据", key);
                        break;
                }
            }
        }
        if (geometry.index) {
            geo.indices = geometry.index;
        }
        return geo;
    }
    function parsePerspectiveCamera(perspectiveCamera) {
        var perspectiveLen = new feng3d.PerspectiveLens();
        perspectiveLen.near = perspectiveCamera.near;
        perspectiveLen.far = perspectiveCamera.far;
        perspectiveLen.aspect = perspectiveCamera.aspect;
        perspectiveLen.fov = perspectiveCamera.fov;
        return perspectiveLen;
    }
    var prepare = (function () {
        var isprepare = false;
        var prepareCallbacks = [];
        var preparing = false;
        return function (callback) {
            if (isprepare) {
                callback();
                return;
            }
            prepareCallbacks.push(callback);
            if (preparing)
                return;
            preparing = true;
            feng3d.loadjs.load({
                paths: [
                    "threejs/three.js",
                    // <!-- FBX -->
                    "threejs/libs/inflate.min.js",
                    //
                    "threejs/loaders/AMFLoader.js",
                    "threejs/loaders/AWDLoader.js",
                    "threejs/loaders/BabylonLoader.js",
                    "threejs/loaders/ColladaLoader.js",
                    "threejs/loaders/FBXLoader.js",
                    "threejs/loaders/GLTFLoader.js",
                    "threejs/loaders/KMZLoader.js",
                    "threejs/loaders/MD2Loader.js",
                    "threejs/loaders/OBJLoader.js",
                    "threejs/loaders/MTLLoader.js",
                    "threejs/loaders/PlayCanvasLoader.js",
                    "threejs/loaders/PLYLoader.js",
                    "threejs/loaders/STLLoader.js",
                    "threejs/loaders/TGALoader.js",
                    "threejs/loaders/TDSLoader.js",
                    "threejs/loaders/UTF8Loader.js",
                    "threejs/loaders/VRMLLoader.js",
                    "threejs/loaders/VTKLoader.js",
                    "threejs/loaders/ctm/lzma.js",
                    "threejs/loaders/ctm/ctm.js",
                    "threejs/loaders/ctm/CTMLoader.js",
                ].map(function (value) { return editor.editorData.getEditorAssetsPath(value); }),
                bundleId: "threejs",
                success: function () {
                    Number.prototype["format"] = function () {
                        return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    };
                    // log("提供解析的 three.js 初始化完成，")
                    isprepare = true;
                    preparing = false;
                    prepareCallbacks.forEach(function (element) {
                        element();
                    });
                }
            });
        };
    })();
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.mainMenu = [
        {
            label: "新建项目", click: function () {
                editor.popupview.popupObject({ newprojectname: "newproject" }, function (data) {
                    if (data.newprojectname && data.newprojectname.length > 0) {
                        editor.editorcache.projectname = data.newprojectname;
                        window.location.reload();
                    }
                });
            }
        },
        {
            label: "打开项目",
            submenu: getProjectsMenu(),
            click: function () {
                editor.popupview.popupObject({ newprojectname: "newproject" }, function (data) {
                    if (data.newprojectname && data.newprojectname.length > 0) {
                        editor.editorcache.projectname = data.newprojectname;
                        window.location.reload();
                    }
                });
            }
        },
        {
            label: "保存场景", click: function () {
                var gameobject = editor.hierarchy.rootnode.gameobject;
                editor.editorAssets.saveObject(gameobject);
            }
        },
        {
            label: "导入项目", click: function () {
                editor.editorFS.selectFile(function (filelist) {
                    editor.editorFS.importProject(filelist.item(0), function () {
                        console.log("导入项目完成");
                        editor.editorAssets.initproject(function () {
                            editor.editorAssets.runProjectScript(function () {
                                editor.editorAssets.readScene("default.scene.json", function (err, scene) {
                                    editor.engine.scene = scene;
                                    editor.editorui.assetsview.invalidateAssetstree();
                                    console.log("导入项目完成!");
                                });
                            });
                        });
                    });
                });
            }
        },
        {
            label: "导出项目", click: function () {
                editor.editorFS.exportProject(function (err, content) {
                    // see FileSaver.js
                    saveAs(content, editor.editorcache.projectname + ".feng3d.zip");
                });
            }
        },
        {
            label: "打开网络项目",
            submenu: [
                {
                    label: "地形", click: function () {
                        openDownloadProject("terrain.feng3d.zip");
                    },
                },
                {
                    label: "自定义材质", click: function () {
                        openDownloadProject("customshader.feng3d.zip");
                    },
                },
                {
                    label: "水", click: function () {
                        openDownloadProject("water.feng3d.zip");
                    },
                },
                {
                    label: "灯光", click: function () {
                        openDownloadProject("light.feng3d.zip");
                    },
                },
            ],
        },
        {
            label: "下载网络项目",
            submenu: [
                {
                    label: "地形", click: function () {
                        downloadProject("terrain.feng3d.zip");
                    },
                },
                {
                    label: "自定义材质", click: function () {
                        downloadProject("customshader.feng3d.zip");
                    },
                },
                {
                    label: "水", click: function () {
                        downloadProject("water.feng3d.zip");
                    },
                },
                {
                    label: "灯光", click: function () {
                        downloadProject("light.feng3d.zip");
                    },
                },
            ],
        },
        {
            label: "升级项目",
            click: function () {
                editor.editorFS.upgradeProject(function () {
                    alert("升级完成！");
                });
            },
        },
        {
            label: "清空项目",
            click: function () {
                editor.editorAssets.rootFile.remove();
                editor.editorAssets.initproject(function () {
                    editor.editorAssets.runProjectScript(function () {
                        editor.engine.scene = editor.creatNewScene();
                        editor.editorui.assetsview.invalidateAssetstree();
                        console.log("清空项目完成!");
                    });
                });
            },
        }
    ];
    /**
     * 层级界面创建3D对象列表数据
     */
    editor.createObjectConfig = [
        //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
        {
            label: "游戏对象", click: function () {
                addToHierarchy(feng3d.gameObjectFactory.createGameObject());
            }
        },
        { type: "separator" },
        {
            label: "3D对象",
            submenu: [
                {
                    label: "平面", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createPlane());
                    }
                },
                {
                    label: "立方体", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createCube());
                    }
                },
                {
                    label: "球体", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createSphere());
                    }
                },
                {
                    label: "胶囊体", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createCapsule());
                    }
                },
                {
                    label: "圆柱体", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createCylinder());
                    }
                },
                {
                    label: "圆锥体", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createCone());
                    }
                },
                {
                    label: "圆环", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createTorus());
                    }
                },
                {
                    label: "地形", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createTerrain());
                    }
                },
                {
                    label: "水", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createWater());
                    }
                },
            ],
        },
        {
            label: "光源",
            submenu: [
                {
                    label: "点光源", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createPointLight());
                    }
                },
                {
                    label: "方向光源", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createDirectionalLight());
                    }
                },
                {
                    label: "聚光灯", click: function () {
                        addToHierarchy(feng3d.gameObjectFactory.createSpotLight());
                    }
                },
            ],
        },
        {
            label: "粒子系统", click: function () {
                addToHierarchy(feng3d.gameObjectFactory.createParticle());
            }
        },
        {
            label: "摄像机", click: function () {
                addToHierarchy(feng3d.gameObjectFactory.createCamera());
            }
        },
    ];
    function addToHierarchy(gameobject) {
        var selectedNode = editor.hierarchy.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            editor.hierarchy.rootnode.gameobject.addChild(gameobject);
        editor.editorData.selectObject(gameobject);
    }
    /**
     * 获取创建游戏对象组件菜单
     * @param gameobject 游戏对象
     */
    function getCreateComponentMenu(gameobject) {
        var menu = [
            //label:显示在创建列表中的名称 className:3d对象的类全路径，将通过classUtils.getDefinitionByName获取定义
            {
                label: "SkyBox",
                click: function () { gameobject.addComponent(feng3d.SkyBox); }
            },
            {
                label: "Animator",
                submenu: [
                    { label: "ParticleSystem", click: function () { gameobject.addComponent(feng3d.ParticleSystem); } },
                    { label: "Animation", click: function () { gameobject.addComponent(feng3d.Animation); } },
                ]
            },
            {
                label: "Rendering",
                submenu: [
                    { label: "Camera", click: function () { gameobject.addComponent(feng3d.Camera); } },
                    { label: "PointLight", click: function () { gameobject.addComponent(feng3d.PointLight); } },
                    { label: "DirectionalLight", click: function () { gameobject.addComponent(feng3d.DirectionalLight); } },
                    { label: "OutLineComponent", click: function () { gameobject.addComponent(feng3d.OutLineComponent); } },
                    { label: "CartoonComponent", click: function () { gameobject.addComponent(feng3d.CartoonComponent); } },
                ]
            },
            {
                label: "Controller",
                submenu: [
                    { label: "FPSController", click: function () { gameobject.addComponent(feng3d.FPSController); } },
                ]
            },
            {
                label: "Layout",
                submenu: [
                    { label: "HoldSizeComponent", click: function () { gameobject.addComponent(feng3d.HoldSizeComponent); } },
                    { label: "BillboardComponent", click: function () { gameobject.addComponent(feng3d.BillboardComponent); } },
                ]
            },
            {
                label: "Audio",
                submenu: [
                    { label: "AudioListener", click: function () { gameobject.addComponent(feng3d.AudioListener); } },
                    { label: "AudioSource", click: function () { gameobject.addComponent(feng3d.AudioSource); } },
                ]
            },
            {
                label: "Navigation",
                submenu: [
                    { label: "Navigation", click: function () { gameobject.addComponent(editor.Navigation); } },
                ]
            },
            {
                label: "Graphics",
                submenu: [
                    { label: "Water", click: function () { gameobject.addComponent(feng3d.Water); } },
                ]
            },
            {
                label: "Script",
                submenu: [
                    { label: "Script", click: function () { gameobject.addComponent(feng3d.ScriptComponent); } },
                ]
            },
        ];
        return menu;
    }
    editor.getCreateComponentMenu = getCreateComponentMenu;
    /**
     * 下载项目
     * @param projectname
     */
    function openDownloadProject(projectname, callback) {
        editor.editorAssets.rootFile.delete();
        downloadProject(projectname, callback);
    }
    /**
     * 下载项目
     * @param projectname
     */
    function downloadProject(projectname, callback) {
        var path = "projects/" + projectname;
        feng3d.loader.loadBinary(path, function (content) {
            editor.editorFS.importProject(content, function () {
                editor.editorAssets.initproject(function () {
                    editor.editorAssets.runProjectScript(function () {
                        editor.editorAssets.readScene("default.scene.json", function (err, scene) {
                            editor.engine.scene = scene;
                            editor.editorui.assetsview.invalidateAssetstree();
                            console.log(projectname + " \u9879\u76EE\u4E0B\u8F7D\u5B8C\u6210!");
                            callback && callback();
                        });
                    });
                });
            });
        });
    }
    /**
     * 获取项目菜单
     */
    function getProjectsMenu() {
        var projects = [];
        editor.editorFS.getProjectList(function (err, ps) {
            ps.forEach(function (element) {
                projects.push({
                    label: element, click: function () {
                        editor.editorcache.projectname = element;
                        window.location.reload();
                    }
                });
            });
        });
        return projects;
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    //
    feng3d.objectview.defaultBaseObjectViewClass = "OVBaseDefault";
    feng3d.objectview.defaultObjectViewClass = "OVDefault";
    feng3d.objectview.defaultObjectAttributeViewClass = "OAVDefault";
    feng3d.objectview.defaultObjectAttributeBlockView = "OBVDefault";
    //
    feng3d.objectview.setDefaultTypeAttributeView("Boolean", { component: "OAVBoolean" });
    feng3d.objectview.setDefaultTypeAttributeView("String", { component: "OAVString" });
    feng3d.objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector3", { component: "OAVVector3D" });
    feng3d.objectview.setDefaultTypeAttributeView("Array", { component: "OAVArray" });
    feng3d.objectview.setDefaultTypeAttributeView("Function", { component: "OAVFunction" });
    feng3d.objectview.setDefaultTypeAttributeView("Color3", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Color4", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("UrlImageTexture2D", { component: "OAVTexture2D" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxGradient", { component: "OAVMinMaxGradient" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurve", { component: "OAVMinMaxCurve" });
    feng3d.objectview.setDefaultTypeAttributeView("MinMaxCurveVector3", { component: "OAVMinMaxCurveVector3" });
    //
})(editor || (editor = {}));
/**
 * 快捷键配置
 */
var shortcutConfig = [
    //	key					[必须]	快捷键；用“+”连接多个按键，“!”表示没按下某键；例如 “a+!b”表示按下“a”与没按下“b”时触发。
    //	command				[可选]	要执行的command的id；使用“,”连接触发多个命令；例如 “commandA,commandB”表示满足触发条件后依次执行commandA与commandB命令。
    //	stateCommand		[可选]	要执行的状态命令id；使用“,”连接触发多个状态命令，没带“!”表示激活该状态，否则表示使其处于非激活状态；例如 “stateA,!stateB”表示满足触发条件后激活状态“stateA，使“stateB处于非激活状态。
    //	when				[可选]	快捷键激活的条件；使用“+”连接多个状态，没带“!”表示需要处于激活状态，否则需要处于非激活状态； 例如 “stateA+!stateB”表示stateA处于激活状态且stateB处于非激活状态时会判断按键是否满足条件。
    { key: "alt+rightmousedown", command: "sceneCameraForwardBackMouseMoveStart", stateCommand: "sceneCameraForwardBackMouseMoving", when: "mouseInView3D+!fpsViewing" },
    { key: "mousemove", command: "sceneCameraForwardBackMouseMove", when: "sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", stateCommand: "!sceneCameraForwardBackMouseMoving", when: "sceneCameraForwardBackMouseMoving" },
    { key: "rightmousedown", command: "fpsViewStart", stateCommand: "fpsViewing", when: "mouseInView3D+!sceneCameraForwardBackMouseMoving" },
    { key: "rightmouseup", command: "fpsViewStop", stateCommand: "!fpsViewing", when: "fpsViewing" },
    { key: "mousemove", command: "mouseRotateScene", when: "mouseRotateSceneing" },
    { key: "mouseup", stateCommand: "!mouseRotateSceneing", when: "mouseRotateSceneing" },
    { key: "middlemousedown", command: "dragSceneStart", stateCommand: "dragSceneing", when: "mouseInView3D" },
    { key: "mousemove", command: "dragScene", when: "dragSceneing" },
    { key: "middlemouseup", stateCommand: "!dragSceneing", when: "dragSceneing" },
    { key: "wheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "mouseInView3D" },
    { key: "f", command: "lookToSelectedGameObject", when: "" },
    { key: "w", command: "gameobjectMoveTool", when: "!fpsViewing" },
    { key: "e", command: "gameobjectRotationTool", when: "!fpsViewing" },
    { key: "r", command: "gameobjectScaleTool", when: "!fpsViewing" },
    { key: "del", command: "deleteSeletedGameObject", when: "" },
    { key: "!alt+mousedown", stateCommand: "selecting", when: "!inModal+mouseInView3D" },
    { key: "mousemove", stateCommand: "!selecting", when: "selecting" },
    { key: "mouseup", command: "selectGameObject", stateCommand: "!selecting", when: "mouseInView3D+selecting" },
    { key: "!alt+mousedown", command: "areaSelectStart", stateCommand: "areaSelecting", when: "!inModal+mouseInView3D" },
    { key: "mousemove", command: "areaSelect", when: "areaSelecting+!mouseInSceneRotateTool+!inTransforming+!selectInvalid" },
    { key: "mouseup", command: "areaSelectEnd", stateCommand: "!areaSelecting", when: "areaSelecting" },
];
/// <reference path="../libs/monaco-editor/monaco.d.ts" />
// 参考 https://microsoft.github.io/monaco-editor/api/index.html
// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html
var editor;
(function (editor) {
    var ScriptCompiler = /** @class */ (function () {
        function ScriptCompiler() {
            var _this = this;
            // ts 列表
            this.tslist = [];
            this.tslibs = [];
            feng3d.loadjs.load({
                paths: ["../feng3d/out/feng3d.d.ts"], onitemload: function (url, content) {
                    _this.tslibs.push({ path: url, code: content });
                },
            });
        }
        ScriptCompiler.prototype.edit = function (script) {
            this._script = script;
            if (codeeditoWin)
                codeeditoWin.close();
            codeeditoWin = window.open("codeeditor.html");
        };
        ScriptCompiler.prototype.compile = function (callback) {
            this.tslist = this.getScripts();
            try {
                var output = this.transpileModule();
                var outputStr = output.reduce(function (prev, item) {
                    return prev + item.text;
                }, "");
                outputStr += "\n//# sourceURL=project.js";
                callback && callback(outputStr);
                editor.editorFS.fs.writeString("project.js", outputStr);
                editor.editorAssets.runProjectScript(function () {
                    feng3d.feng3dDispatcher.dispatch("assets.scriptChanged");
                });
                return outputStr;
            }
            catch (e) {
                console.log("Error from compilation: " + e + "  " + (e.stack || ""));
            }
            callback && callback("");
        };
        ScriptCompiler.prototype.getScripts = function () {
            var tslist = editor.editorAssets.getScripts();
            this.tssort(tslist);
            return tslist;
        };
        ScriptCompiler.prototype.transpileModule = function () {
            var options = {
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noLib: true,
                noResolve: true,
                suppressOutputPathCheck: true,
                outFile: "project.js",
            };
            var tsSourceMap = {};
            var fileNames = [];
            this.tslibs.forEach(function (item) {
                fileNames.push(item.path);
                tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
            });
            this.tslist.forEach(function (item) {
                fileNames.push(item.assetsId + ".ts");
                tsSourceMap[item.assetsId + ".ts"] = ts.createSourceFile(item.assetsId + ".ts", item.textContent, options.target || ts.ScriptTarget.ES5);
            });
            // Output
            var outputs = [];
            var program = ts.createProgram(fileNames, options, {
                getSourceFile: function (fileName) {
                    return tsSourceMap[fileName];
                },
                writeFile: function (_name, text) {
                    outputs.push({ name: _name, text: text });
                },
                getDefaultLibFileName: function () { return "lib.d.ts"; },
                useCaseSensitiveFileNames: function () { return false; },
                getCanonicalFileName: function (fileName) { return fileName; },
                getCurrentDirectory: function () { return ""; },
                getNewLine: function () { return "\r\n"; },
                fileExists: function (fileName) {
                    return !!tsSourceMap[fileName];
                },
                readFile: function () { return ""; },
                directoryExists: function () { return true; },
                getDirectories: function () { return []; }
            });
            // Emit
            program.emit();
            return outputs;
        };
        /**
         * ts 文件排序
         */
        ScriptCompiler.prototype.tssort = function (filelist) {
            //按继承排序
            for (var i = 0; i < filelist.length; i++) {
                var item = filelist[i];
                var newpos = i;
                if (item.parentScriptName) {
                    for (var j = i + 1; j < filelist.length; j++) {
                        var itemk = filelist[j];
                        if (itemk.scriptName == item.parentScriptName && newpos < j) {
                            newpos = j;
                        }
                    }
                }
                if (newpos > i) {
                    filelist[i] = null;
                    filelist.splice(newpos + 1, 0, item);
                }
            }
        };
        return ScriptCompiler;
    }());
    editor.ScriptCompiler = ScriptCompiler;
    editor.scriptCompiler = new ScriptCompiler();
})(editor || (editor = {}));
var codeeditoWin;
var ts;
// Monaco uses a custom amd loader that overrides node's require.
// Keep a reference to node's require so we can restore it after executing the amd loader file.
var nodeRequire = window["require"];
var script = document.createElement("script");
script.src = "libs/monaco-editor/min/vs/loader.js";
script.onload = function () {
    // Save Monaco's amd require and restore Node's require
    var amdRequire = window["require"];
    window["require"] = nodeRequire;
    //
    amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
    amdRequire(['vs/language/typescript/lib/typescriptServices'], function () {
    });
};
document.body.appendChild(script);
var editor;
(function (editor) {
    /**
     * feng3d的版本号
     */
    editor.revision = "2018.08.22";
    feng3d.log("editor version " + editor.revision);
    /**
     * 编辑器
     */
    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor() {
            var _this = _super.call(this) || this;
            var mainui = new editor.MainUI(function () {
                editor.editorui.stage = _this.stage;
                //
                var tooltipLayer = new eui.UILayer();
                tooltipLayer.touchEnabled = false;
                _this.stage.addChild(tooltipLayer);
                editor.editorui.tooltipLayer = tooltipLayer;
                //
                var popupLayer = new eui.UILayer();
                popupLayer.touchEnabled = false;
                _this.stage.addChild(popupLayer);
                editor.editorui.popupLayer = popupLayer;
                _this.initproject(function () {
                    setTimeout(function () {
                        _this.init();
                    }, 1);
                });
                _this.removeChild(mainui);
            });
            _this.addChild(mainui);
            return _this;
        }
        Editor.prototype.init = function () {
            document.head.getElementsByTagName("title")[0].innerText = "editor -- " + editor.editorcache.projectname;
            this.initMainView();
            //初始化feng3d
            new editor.Main3D();
            feng3d.shortcut.addShortCuts(shortcutConfig);
            new editor.Editorshortcut();
            this.once(egret.Event.ENTER_FRAME, function () {
                //
                egret.mouseEventEnvironment();
            }, this);
            this.once(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        };
        Editor.prototype.initMainView = function () {
            //
            this.mainView = new editor.MainView();
            this.stage.addChildAt(this.mainView, 1);
            this.onresize();
            window.onresize = this.onresize.bind(this);
            editor.editorui.mainview = this.mainView;
        };
        Editor.prototype.onresize = function () {
            this.stage.setContentSize(window.innerWidth, window.innerHeight);
            this.mainView.width = this.stage.stageWidth;
            this.mainView.height = this.stage.stageHeight;
        };
        Editor.prototype.initproject = function (callback) {
            editor.editorcache.projectname = editor.editorcache.projectname || "newproject";
            editor.editorFS.hasProject(editor.editorcache.projectname, function (has) {
                if (has) {
                    editor.editorFS.initproject(editor.editorcache.projectname, callback);
                }
                else {
                    editor.editorFS.createproject(editor.editorcache.projectname, function () {
                        editor.editorFS.initproject(editor.editorcache.projectname, callback);
                    });
                }
            });
        };
        Editor.prototype._onAddToStage = function () {
            editor.editorData.stage = this.stage;
        };
        return Editor;
    }(eui.UILayer));
    editor.Editor = Editor;
})(editor || (editor = {}));
//# sourceMappingURL=editor.js.map