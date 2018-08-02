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
var editor;
(function (editor) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * 获取所有类
         */
        Utils.prototype.getAllClasss = function (root, rootpath, depth) {
            if (root === void 0) { root = window; }
            if (depth === void 0) { depth = 5; }
            Object.keys(root).forEach(function (key) {
            });
        };
        return Utils;
    }());
    editor.Utils = Utils;
    editor.utils = new Utils();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 常用正则表示式
     */
    var RegExps = /** @class */ (function () {
        function RegExps() {
            /**
             * json文件
             */
            this.json = /(\.json)\b/i;
            /**
             * 图片
             */
            this.image = /(\.jpg|\.png|\.jpeg|\.gif)\b/i;
            /**
             * 声音
             */
            this.audio = /(\.ogg|\.mp3|\.wav)\b/i;
            /**
             * 命名空间
             */
            this.namespace = /namespace\s+([\w$_\d\.]+)/;
            /**
             * 导出类
             */
            this.exportClass = /export\s+(abstract\s+)?class\s+([\w$_\d]+)(\s+extends\s+([\w$_\d]+))?/;
            /**
             * 脚本中的类
             */
            this.scriptClass = /(export\s+)?class\s+([\w$_\d]+)\s+extends\s+(([\w$_\d\.]+))/;
        }
        return RegExps;
    }());
    editor.RegExps = RegExps;
    editor.regExps = new RegExps();
})(editor || (editor = {}));
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
            editor.fs.readdir(this._path, function (err, files) {
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
            editor.fs.mkdir(this._path, function (err) {
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
                feng3d.dataTransform.stringToUint8Array(content, function (uint8Array) {
                    _this.saveFile(uint8Array, onComplete, onError, thisPtr);
                });
                return;
            }
            editor.fs.writeFile(this._path, content, function (err) {
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
            editor.fs.rename(oldPath, newPath, function (err) {
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
            editor.fs.move(this._path, newPath, function (err) {
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
            editor.fs.delete(this._path, function (err) {
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
            editor.fs.exists(path, function (exists) {
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
    var EditorAssets1 = /** @class */ (function (_super) {
        __extends(EditorAssets1, _super);
        function EditorAssets1(readWriteFS) {
            var _this = _super.call(this) || this;
            if (readWriteFS)
                _this.fs = readWriteFS;
            return _this;
        }
        /**
         * 是否存在指定项目
         * @param projectname 项目名称
         * @param callback 回调函数
         */
        EditorAssets1.prototype.hasProject = function (projectname, callback) {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBfs) {
                feng3d.storage.hasObjectStore(readWriteFS.DBname, projectname, callback);
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
        EditorAssets1.prototype.getProjectList = function (callback) {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBfs) {
                feng3d.storage.getObjectStoreNames(readWriteFS.DBname, callback);
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
        EditorAssets1.prototype.initproject = function (projectname, callback) {
            var readWriteFS = this.fs;
            if (readWriteFS instanceof feng3d.IndexedDBfs) {
                feng3d.storage.createObjectStore(readWriteFS.DBname, projectname, function (err) {
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
        EditorAssets1.prototype.createproject = function (projectname, callback) {
            editor.fs.initproject(projectname, function () {
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
                                    editor.fs.mkdir(filepath, readfiles);
                                }
                                else {
                                    file.async("arraybuffer").then(function (data) {
                                        editor.fs.writeFile(filepath, data, function (err) {
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
        EditorAssets1.prototype.upgradeProject = function (callback) {
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
                                editor.fs.mkdir(filepath, readfiles);
                            }
                            else {
                                file.async("arraybuffer").then(function (data) {
                                    editor.fs.writeFile(filepath, data, function (err) {
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
        EditorAssets1.prototype.selectFile = function (callback) {
            selectFileCallback = callback;
            isSelectFile = true;
        };
        /**
         * 导出项目
         */
        EditorAssets1.prototype.exportProject = function (callback) {
            var zip = new JSZip();
            editor.fs.getAllfilepathInFolder("", function (err, filepaths) {
                readfiles();
                function readfiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        editor.fs.readFile(filepath, function (err, data) {
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
        EditorAssets1.prototype.importProject = function (file, callback) {
            var zip = new JSZip();
            zip.loadAsync(file).then(function (value) {
                var filepaths = Object.keys(value.files);
                filepaths.sort();
                writeFiles();
                function writeFiles() {
                    if (filepaths.length > 0) {
                        var filepath = filepaths.shift();
                        if (value.files[filepath].dir) {
                            editor.fs.mkdir(filepath, function (err) {
                                writeFiles();
                            });
                        }
                        else {
                            zip.file(filepath).async("arraybuffer").then(function (data) {
                                editor.fs.writeFile(filepath, data, function (err) {
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
        return EditorAssets1;
    }(feng3d.ReadWriteAssets));
    editor.EditorAssets1 = EditorAssets1;
    if (typeof require == "undefined") {
        feng3d.assets = editor.fs = new EditorAssets1(feng3d.indexedDBfs);
    }
    else {
        var nativeFS = require(__dirname + "/io/NativeFS.js").nativeFS;
        feng3d.assets = editor.fs = new EditorAssets1(nativeFS);
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
        if (editor.codeeditoWin)
            editor.codeeditoWin.close();
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
        }
        Editorshortcut.prototype.init = function () {
            //监听命令
            feng3d.shortcut.on("deleteSeletedGameObject", onDeleteSeletedGameObject);
            feng3d.shortcut.on("gameobjectMoveTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.MOVE;
            });
            feng3d.shortcut.on("gameobjectRotationTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.ROTATION;
            });
            feng3d.shortcut.on("gameobjectScaleTool", function () {
                editor.mrsTool.toolType = editor.MRSToolType.SCALE;
            });
            feng3d.shortcut.on("selectGameObject", function () {
                var gameObject = editor.engine.mouse3DManager.selectedGameObject;
                if (!gameObject || !gameObject.scene) {
                    editor.editorData.selectedObjects = null;
                    return;
                }
                if (editor.editorData.mrsToolObject == gameObject)
                    return;
                var node = editor.hierarchyTree.getNode(gameObject);
                while (!node && gameObject.parent) {
                    if (editor.editorData.mrsToolObject == gameObject)
                        return;
                    gameObject = gameObject.parent;
                    node = editor.hierarchyTree.getNode(gameObject);
                }
                if (gameObject != gameObject.scene.gameObject) {
                    editor.editorData.selectObject(gameObject);
                }
                else {
                    editor.editorData.selectedObjects = null;
                }
            });
            var preMousePoint;
            feng3d.shortcut.on("sceneCameraForwardBackMouseMoveStart", function () {
                preMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            });
            feng3d.shortcut.on("sceneCameraForwardBackMouseMove", function () {
                var currentMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
                var moveDistance = (currentMousePoint.x + currentMousePoint.y - preMousePoint.x - preMousePoint.y) * editor.sceneControlConfig.sceneCameraForwardBackwardStep;
                editor.sceneControlConfig.lookDistance -= moveDistance;
                var forward = editor.editorCamera.transform.localToWorldMatrix.forward;
                var camerascenePosition = editor.editorCamera.transform.scenePosition;
                var newCamerascenePosition = new feng3d.Vector3(forward.x * moveDistance + camerascenePosition.x, forward.y * moveDistance + camerascenePosition.y, forward.z * moveDistance + camerascenePosition.z);
                var newCameraPosition = editor.editorCamera.transform.inverseTransformPoint(newCamerascenePosition);
                editor.editorCamera.transform.position = newCameraPosition;
                preMousePoint = currentMousePoint;
            });
            //
            feng3d.shortcut.on("lookToSelectedGameObject", onLookToSelectedGameObject);
            feng3d.shortcut.on("dragSceneStart", onDragSceneStart);
            feng3d.shortcut.on("dragScene", onDragScene);
            feng3d.shortcut.on("fpsViewStart", onFpsViewStart);
            feng3d.shortcut.on("fpsViewStop", onFpsViewStop);
            feng3d.shortcut.on("mouseRotateSceneStart", onMouseRotateSceneStart);
            feng3d.shortcut.on("mouseRotateScene", onMouseRotateScene);
            feng3d.shortcut.on("mouseWheelMoveSceneCamera", onMouseWheelMoveSceneCamera);
        };
        return Editorshortcut;
    }());
    editor.Editorshortcut = Editorshortcut;
    editor.editorshortcut = new Editorshortcut();
    var dragSceneMousePoint;
    var dragSceneCameraGlobalMatrix3D;
    var rotateSceneCenter;
    var rotateSceneCameraGlobalMatrix3D;
    var rotateSceneMousePoint;
    function onDeleteSeletedGameObject() {
        var selectedObject = editor.editorData.selectedObjects;
        if (!selectedObject)
            return;
        //删除文件引用计数
        var deletefileNum = 0;
        selectedObject.forEach(function (element) {
            if (element instanceof feng3d.GameObject) {
                element.remove();
            }
            else if (element instanceof editor.AssetsFile) {
                deletefileNum++;
                editor.editorAssets.deletefile(element.path, function () {
                    deletefileNum--;
                    // 等待删除所有文件 后清空选中对象
                    if (deletefileNum == 0) {
                        editor.editorData.selectedObjects = null;
                    }
                });
            }
        });
        // 等待删除所有文件 后清空选中对象
        if (deletefileNum == 0) {
            editor.editorData.selectedObjects = null;
        }
    }
    function onDragSceneStart() {
        dragSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        dragSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
    }
    function onDragScene() {
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var addPoint = mousePoint.subTo(dragSceneMousePoint);
        var scale = editor.editorCamera.getScaleByDepth(editor.sceneControlConfig.lookDistance);
        var up = dragSceneCameraGlobalMatrix3D.up;
        var right = dragSceneCameraGlobalMatrix3D.right;
        up.scale(addPoint.y * scale);
        right.scale(-addPoint.x * scale);
        var globalMatrix3D = dragSceneCameraGlobalMatrix3D.clone();
        globalMatrix3D.appendTranslation(up.x + right.x, up.y + right.y, up.z + right.z);
        editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    }
    function onFpsViewStart() {
        var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
        fpsController.onMousedown();
        feng3d.ticker.onframe(updateFpsView);
    }
    function onFpsViewStop() {
        var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
        fpsController.onMouseup();
        feng3d.ticker.offframe(updateFpsView);
    }
    function updateFpsView() {
        var fpsController = editor.editorCamera.getComponent(feng3d.FPSController);
        fpsController.update();
    }
    function onMouseRotateSceneStart() {
        rotateSceneMousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        rotateSceneCameraGlobalMatrix3D = editor.editorCamera.transform.localToWorldMatrix.clone();
        rotateSceneCenter = null;
        //获取第一个 游戏对象
        var firstObject = editor.editorData.firstSelectedGameObject;
        if (firstObject) {
            rotateSceneCenter = firstObject.transform.scenePosition;
        }
        else {
            rotateSceneCenter = rotateSceneCameraGlobalMatrix3D.forward;
            rotateSceneCenter.scale(editor.sceneControlConfig.lookDistance);
            rotateSceneCenter = rotateSceneCenter.addTo(rotateSceneCameraGlobalMatrix3D.position);
        }
    }
    function onMouseRotateScene() {
        var globalMatrix3D = rotateSceneCameraGlobalMatrix3D.clone();
        var mousePoint = new feng3d.Vector2(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
        var view3DRect = editor.engine.viewRect;
        var rotateX = (mousePoint.y - rotateSceneMousePoint.y) / view3DRect.height * 180;
        var rotateY = (mousePoint.x - rotateSceneMousePoint.x) / view3DRect.width * 180;
        globalMatrix3D.appendRotation(feng3d.Vector3.Y_AXIS, rotateY, rotateSceneCenter);
        var rotateAxisX = globalMatrix3D.right;
        globalMatrix3D.appendRotation(rotateAxisX, rotateX, rotateSceneCenter);
        editor.editorCamera.transform.localToWorldMatrix = globalMatrix3D;
    }
    function onLookToSelectedGameObject() {
        var selectedGameObject = editor.editorData.firstSelectedGameObject;
        if (selectedGameObject) {
            var worldBounds = selectedGameObject.getComponent(feng3d.Bounding).worldBounds;
            var size = 1;
            if (worldBounds)
                size = worldBounds.getSize().length;
            size = Math.max(size, 1);
            //
            var cameraGameObject = editor.editorCamera;
            editor.sceneControlConfig.lookDistance = size;
            var lookPos = cameraGameObject.transform.localToWorldMatrix.forward;
            lookPos.scale(-editor.sceneControlConfig.lookDistance);
            lookPos.add(selectedGameObject.transform.scenePosition);
            var localLookPos = lookPos.clone();
            if (cameraGameObject.transform.parent) {
                cameraGameObject.transform.parent.worldToLocalMatrix.transformVector(lookPos, localLookPos);
            }
            egret.Tween.get(editor.editorCamera.transform).to({ x: localLookPos.x, y: localLookPos.y, z: localLookPos.z }, 300, egret.Ease.sineIn);
        }
    }
    function onMouseWheelMoveSceneCamera() {
        var distance = feng3d.windowEventProxy.wheelDelta * editor.sceneControlConfig.mouseWheelMoveStep * editor.sceneControlConfig.lookDistance / 10;
        editor.editorCamera.transform.localToWorldMatrix = editor.editorCamera.transform.localToWorldMatrix.moveForward(distance);
        editor.sceneControlConfig.lookDistance -= distance;
    }
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
            return _this;
        }
        Feng3dView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.canvas = document.getElementById("glcanvas");
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            this.onResize();
            editor.drag.register(this, null, ["file_gameobject", "file_script"], function (dragdata) {
                if (dragdata.file_gameobject) {
                    editor.hierarchy.addGameoObjectFromAsset(dragdata.file_gameobject, editor.hierarchyTree.rootnode.gameobject);
                }
                if (dragdata.file_script) {
                    var gameobject = editor.engine.mouse3DManager.selectedGameObject;
                    if (!gameobject || !gameobject.scene)
                        gameobject = editor.hierarchyTree.rootnode.gameobject;
                    gameobject.addScript(dragdata.file_script);
                }
            });
        };
        Feng3dView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.canvas = null;
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            editor.drag.unregister(this);
        };
        Feng3dView.prototype.onResize = function () {
            if (!this.stage)
                return;
            var lt = this.localToGlobal(0, 0);
            var rb = this.localToGlobal(this.width, this.height);
            var bound1 = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            // var bound2 = this.getTransformedBounds(this.stage);
            var bound = bound1;
            var style = this.canvas.style;
            style.position = "absolute";
            style.left = bound.x + "px";
            style.top = bound.y + "px";
            style.width = bound.width + "px";
            style.height = bound.height + "px";
            style.cursor = "hand";
            feng3d.Stats.instance.dom.style.left = bound.x + "px";
            feng3d.Stats.instance.dom.style.top = bound.y + "px";
            var canvasRect = this.canvas.getBoundingClientRect();
            var bound = new feng3d.Rectangle(canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height);
            if (bound.contains(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                feng3d.shortcut.activityState("mouseInView3D");
            }
            else {
                feng3d.shortcut.deactivityState("mouseInView3D");
            }
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
            _this.visible = false;
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
            feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onDataChange, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            this.onResize();
            this.onDataChange();
        };
        CameraPreview.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onDataChange, this);
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
        };
        CameraPreview.prototype.onResize = function () {
            if (!this.stage)
                return;
            var lt = this.group.localToGlobal(0, 0);
            var rb = this.group.localToGlobal(this.group.width, this.group.height);
            var bound1 = new feng3d.Rectangle(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
            // var bound2 = this.getTransformedBounds(this.stage);
            var bound = bound1;
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
                        return;
                    }
                }
            }
            this.camera = null;
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
            this._onMouseMovethis = this.onMouseMove.bind(this);
            this._onMouseDownthis = this.onMouseDown.bind(this);
            this._onMouseUpthis = this.onMouseUp.bind(this);
            egretDiv.addEventListener("mousemove", this._onMouseMovethis);
            egretDiv.addEventListener("mousedown", this._onMouseDownthis);
            egretDiv.addEventListener("mouseup", this._onMouseUpthis);
        };
        SplitGroup.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            egretDiv.removeEventListener("mousemove", this._onMouseMovethis);
            egretDiv.removeEventListener("mousedown", this._onMouseDownthis);
            egretDiv.removeEventListener("mouseup", this._onMouseUpthis);
            this._onMouseMovethis = null;
            this._onMouseDownthis = null;
            this._onMouseUpthis = null;
        };
        SplitGroup.prototype.onMouseMove = function (e) {
            if (splitdragData.splitGroupState == SplitGroupState.default) {
                this._findSplit(e.layerX, e.layerY);
                return;
            }
            if (splitdragData.splitGroup != this)
                return;
            if (splitdragData.splitGroupState == SplitGroupState.onSplit) {
                this._findSplit(e.layerX, e.layerY);
            }
            else if (splitdragData.splitGroupState == SplitGroupState.draging) {
                var preElement = splitdragData.preElement;
                var nextElement = splitdragData.nextElement;
                if (splitdragData.layouttype == 1) {
                    var layerX = Math.max(splitdragData.dragRect.left, Math.min(splitdragData.dragRect.right, e.layerX));
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
                    var layerY = Math.max(splitdragData.dragRect.top, Math.min(splitdragData.dragRect.bottom, e.layerY));
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
                splitdragData.dragingMousePoint = new feng3d.Vector2(e.layerX, e.layerY);
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
                editor.editorui.popupLayer.addChildAt(maskReck, 0);
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
        Popupview.prototype.popup = function (object, closecallback, param) {
            param = param || {};
            var view = feng3d.objectview.getObjectView(object);
            var background = new eui.Rect(param.width || 300, param.height || 300, 0xf0f0f0);
            view.addChildAt(background, 0);
            editor.maskview.mask(view);
            view.x = (editor.editorui.stage.stageWidth - view.width) / 2;
            view.y = (editor.editorui.stage.stageHeight - view.height) / 2;
            editor.editorui.popupLayer.addChild(view);
            view.addEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);
            function removefromstage() {
                view.removeEventListener(egret.Event.REMOVED_FROM_STAGE, removefromstage, null);
                closecallback && closecallback(object);
            }
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
                if (this.picker)
                    this._value.fromUnit(this.picker.fillColor);
                return this._value;
            },
            set: function (v) {
                this._value.fromUnit(v.toInt());
                if (this.picker)
                    this.picker.fillColor = this._value.toInt();
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
            var c = document.getElementById("color");
            c.value = this.value.toHexString();
            c.click();
            c.onchange = function () {
                var v = c.value; //"#189a56"
                _this.value = new feng3d.Color3().fromUnit(Number("0x" + v.substr(1)));
                c.onchange = null;
                _this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            };
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
             * 子节点相对父节点的缩进值，以像素为单位。默认17。
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
            eui.Watcher.watch(this, ["data", "depth"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "isOpen"], this.updateView, this);
            eui.Watcher.watch(this, ["data", "hasChildren"], this.updateView, this);
            eui.Watcher.watch(this, ["indentation"], this.updateView, this);
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
            if (this.data.type == 'separator') {
                this.skin.currentState = "separator";
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
                this.menuUI.subMenuUI = editor.MenuUI.create(this.data.submenu, rect.right, rect.top);
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
    var TreeNode = /** @class */ (function () {
        function TreeNode(obj) {
            /**
             * 标签
             */
            this.label = "";
            /**
             * 目录深度
             */
            this.depth = 0;
            /**
             * 是否打开
             */
            this.isOpen = true;
            /**
             * 是否选中
             */
            this.selected = false;
            /**
             * 父节点
             */
            this.parent = null;
            if (obj) {
                Object.assign(this, obj);
            }
        }
        /**
         * 销毁
         */
        TreeNode.prototype.destroy = function () {
            this.parent = null;
            this.children = null;
        };
        TreeNode.prototype.selectedchange = function () {
            if (this.selected) {
                var p = this.parent;
                while (p) {
                    p.isOpen = true;
                    p = p.parent;
                }
            }
        };
        __decorate([
            feng3d.watch("selectedchange")
        ], TreeNode.prototype, "selected", void 0);
        return TreeNode;
    }());
    editor.TreeNode = TreeNode;
    var Tree = /** @class */ (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Tree.prototype, "rootnode", {
            get: function () {
                return this._rootnode;
            },
            set: function (value) {
                if (this._rootnode == value)
                    return;
                if (this._rootnode) {
                    feng3d.watcher.unwatch(this._rootnode, "isOpen", this.isopenchanged, this);
                }
                this._rootnode = value;
                if (this._rootnode) {
                    feng3d.watcher.watch(this._rootnode, "isOpen", this.isopenchanged, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 判断是否包含节点
         */
        Tree.prototype.contain = function (node, rootnode) {
            rootnode = rootnode || this.rootnode;
            var result = false;
            treeMap(rootnode, function (item) {
                if (item == node)
                    result = true;
            });
            return result;
        };
        Tree.prototype.addNode = function (node, parentnode) {
            parentnode = parentnode || this.rootnode;
            feng3d.debuger && feng3d.assert(!this.contain(parentnode, node), "无法添加到自身节点中!");
            node.parent = parentnode;
            parentnode.children.push(node);
            this.updateChildrenDepth(node);
            feng3d.watcher.watch(node, "isOpen", this.isopenchanged, this);
            this.dispatch("added", node);
            this.dispatch("changed", node);
        };
        Tree.prototype.removeNode = function (node) {
            var parentnode = node.parent;
            if (!parentnode)
                return;
            var index = parentnode.children.indexOf(node);
            feng3d.debuger && feng3d.assert(index != -1);
            parentnode.children.splice(index, 1);
            node.parent = null;
            feng3d.watcher.unwatch(node, "isOpen", this.isopenchanged, this);
            this.dispatch("removed", node);
            this.dispatch("changed", node);
        };
        Tree.prototype.destroy = function (node) {
            this.removeNode(node);
            if (node.children) {
                for (var i = node.children.length - 1; i >= 0; i--) {
                    this.destroy(node.children[i]);
                }
                node.children.length = 0;
            }
        };
        Tree.prototype.updateChildrenDepth = function (node) {
            node.depth = ~~node.parent.depth + 1;
            treeMap(node, function (node) {
                node.depth = ~~node.parent.depth + 1;
            });
        };
        Tree.prototype.getShowNodes = function (node) {
            var _this = this;
            node = node || this.rootnode;
            if (!node)
                return [];
            var nodes = [node];
            if (node.isOpen) {
                node.children.forEach(function (element) {
                    nodes = nodes.concat(_this.getShowNodes(element));
                });
            }
            return nodes;
        };
        Tree.prototype.isopenchanged = function (host, property, oldvalue) {
            this.dispatch("openChanged", host);
        };
        return Tree;
    }(feng3d.EventDispatcher));
    editor.Tree = Tree;
    function treeMap(treeNode, callback) {
        if (treeNode.children) {
            treeNode.children.forEach(function (element) {
                callback(element, treeNode);
                treeMap(element, callback);
            });
        }
    }
    editor.treeMap = treeMap;
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
            this.componentView = feng3d.objectview.getObjectView(this.component, false, ["enabled"]);
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
            else if (this.component instanceof feng3d.MeshRenderer) {
                this.componentIcon.source = "MeshRenderer_png";
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
                feng3d.watcher.watch(this.component, "script", this.onScriptChanged, this);
                var component = this.component;
                if (component.scriptInstance) {
                    this.scriptView = feng3d.objectview.getObjectView(component.scriptInstance, false);
                    this.accordion.addContent(this.scriptView);
                }
            }
        };
        ComponentView.prototype.removeScriptView = function () {
            // 移除Script属性面板
            if (this.component instanceof feng3d.ScriptComponent) {
                feng3d.watcher.unwatch(this.component, "script", this.onScriptChanged, this);
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
            editor.menu.popup(menus, this.stage.stageWidth - 150);
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
            this.componentView = feng3d.objectview.getObjectView(this.component, false, ["enabled"]);
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
            if (this.component instanceof feng3d.Behaviour)
                feng3d.watcher.watch(this.component, "enabled", this.updateEnableCB, this);
        };
        ParticleComponentView.prototype.onRemovedFromStage = function () {
            this.enabledCB.removeEventListener(egret.Event.CHANGE, this.onEnableCBChange, this);
            if (this.component instanceof feng3d.Behaviour)
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
        Menu.prototype.popup = function (menu, mousex, mousey, width) {
            if (width === void 0) { width = 150; }
            var menuUI = MenuUI.create(menu, mousex, mousey, width);
            editor.maskview.mask(menuUI);
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
        MenuUI.create = function (menu, mousex, mousey, width) {
            if (width === void 0) { width = 150; }
            var menuUI = new MenuUI();
            var dataProvider = new eui.ArrayCollection();
            dataProvider.replaceAll(menu);
            menuUI.dataProvider = dataProvider;
            editor.editorui.popupLayer.addChild(menuUI);
            if (width !== undefined)
                menuUI.width = width;
            menuUI.x = mousex || feng3d.windowEventProxy.clientX;
            menuUI.y = mousey || feng3d.windowEventProxy.clientY;
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
    // let template = [{
    //     label: 'Edit',
    //     submenu: [{
    //         label: 'Undo',
    //         accelerator: 'CmdOrCtrl+Z',
    //         role: 'undo'
    //     }, {
    //         label: 'Redo',
    //         accelerator: 'Shift+CmdOrCtrl+Z',
    //         role: 'redo'
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'Cut',
    //         accelerator: 'CmdOrCtrl+X',
    //         role: 'cut'
    //     }, {
    //         label: 'Copy',
    //         accelerator: 'CmdOrCtrl+C',
    //         role: 'copy'
    //     }, {
    //         label: 'Paste',
    //         accelerator: 'CmdOrCtrl+V',
    //         role: 'paste'
    //     }, {
    //         label: 'Select All',
    //         accelerator: 'CmdOrCtrl+A',
    //         role: 'selectall'
    //     }]
    // }, {
    //     label: 'View',
    //     submenu: [{
    //         label: 'Reload',
    //         accelerator: 'CmdOrCtrl+R',
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 // on reload, start fresh and close any old
    //                 // open secondary windows
    //                 if (focusedWindow.id === 1)
    //                 {
    //                     BrowserWindow.getAllWindows().forEach(function (win)
    //                     {
    //                         if (win.id > 1)
    //                         {
    //                             win.close()
    //                         }
    //                     })
    //                 }
    //                 focusedWindow.reload()
    //             }
    //         }
    //     }, {
    //         label: 'Toggle Full Screen',
    //         accelerator: (function ()
    //         {
    //             if (process.platform === 'darwin')
    //             {
    //                 return 'Ctrl+Command+F'
    //             } else
    //             {
    //                 return 'F11'
    //             }
    //         })(),
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
    //             }
    //         }
    //     }, {
    //         label: 'Toggle Developer Tools',
    //         accelerator: (function ()
    //         {
    //             if (process.platform === 'darwin')
    //             {
    //                 return 'Alt+Command+I'
    //             } else
    //             {
    //                 return 'Ctrl+Shift+I'
    //             }
    //         })(),
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 focusedWindow.toggleDevTools()
    //             }
    //         }
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'App Menu Demo',
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 const options = {
    //                     type: 'info',
    //                     title: 'Application Menu Demo',
    //                     buttons: ['Ok'],
    //                     message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
    //                 }
    //                 electron.dialog.showMessageBox(focusedWindow, options, function () { })
    //             }
    //         }
    //     }]
    // }, {
    //     label: 'Window',
    //     role: 'window',
    //     submenu: [{
    //         label: 'Minimize',
    //         accelerator: 'CmdOrCtrl+M',
    //         role: 'minimize'
    //     }, {
    //         label: 'Close',
    //         accelerator: 'CmdOrCtrl+W',
    //         role: 'close'
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'Reopen Window',
    //         accelerator: 'CmdOrCtrl+Shift+T',
    //         enabled: false,
    //         key: 'reopenMenuItem',
    //         click: function ()
    //         {
    //             app.emit('activate')
    //         }
    //     }]
    // }, {
    //     label: 'Help',
    //     role: 'help',
    //     submenu: [{
    //         label: 'Learn More',
    //         click: function ()
    //         {
    //             electron.shell.openExternal('http://electron.atom.io')
    //         }
    //     }]
    // }]
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
            this._ischeck = false;
        }
        ToolTip.prototype.register = function (displayObject, tip) {
            if (!displayObject)
                return;
            this.tipmap.set(displayObject, tip);
            this.ischeck = !!this.tipmap.size;
        };
        ToolTip.prototype.unregister = function (displayObject) {
            if (!displayObject)
                return;
            this.tipmap.delete(displayObject);
            this.ischeck = !!this.tipmap.size;
        };
        Object.defineProperty(ToolTip.prototype, "ischeck", {
            get: function () {
                return this._ischeck;
            },
            set: function (v) {
                if (this._ischeck == v)
                    return;
                this._ischeck = v;
                if (this._ischeck) {
                    feng3d.windowEventProxy.on("mousemove", this.onMouseMove, this);
                }
                else {
                    feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        ToolTip.prototype.onMouseMove = function (event) {
            var displayObjects = this.tipmap.getKeys().filter(function (item) {
                if (!item.stage)
                    return false;
                return item.getTransformedBounds(item.stage).contains(event.clientX, event.clientY);
            });
            var displayObject = displayObjects[0];
            if (displayObject) {
                var tip = this.tipmap.get(displayObject);
                var tipviewcls = this.tipviewmap.get(tip.constructor);
                if (!tipviewcls)
                    tipviewcls = this.defaultTipview();
                if (this.tipView) {
                    if (!(this.tipView instanceof tipviewcls)) {
                        this.removeTipview();
                    }
                }
                if (!this.tipView) {
                    this.tipView = new tipviewcls();
                }
                editor.editorui.tooltipLayer.addChild(this.tipView);
                this.tipView.value = tip;
                this.tipView.x = event.clientX;
                this.tipView.y = event.clientY - this.tipView.height;
            }
            else {
                this.removeTipview();
            }
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
    /**
     * String 提示框
     */
    var TipString = /** @class */ (function (_super) {
        __extends(TipString, _super);
        function TipString() {
            var _this = _super.call(this) || this;
            _this.value = "";
            _this.skinName = "TipString";
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
var editor;
(function (editor) {
    /**
     * 默认基础对象界面
     * @author feng 2016-3-11
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
        function ObjectViewEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        ObjectViewEvent.prototype.toString = function () {
            return "[{0} type=\"{1}\" space=\"{2}\"  attributeName=\"{3}\" attributeValue={4}]".replace("{0}", egret.getQualifiedClassName(this).split("::").pop()).replace("{1}", this.type).replace("{2}", egret.getQualifiedClassName(this).split("::").pop()).replace("{3}", this.attributeName).replace("{4}", JSON.stringify(this.attributeValue));
        };
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
            _this.attributeViewInfo = attributeViewInfo;
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
            var componentParam = this.attributeViewInfo.componentParam;
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
            if (componentParam && componentParam.tooltip)
                editor.toolTip.register(this.labelLab, componentParam.tooltip);
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
                this.updateView();
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
     * @author feng 2016-3-10
     */
    var OAVDefault = /** @class */ (function (_super) {
        __extends(OAVDefault, _super);
        function OAVDefault(attributeViewInfo) {
            var _this = _super.call(this, attributeViewInfo) || this;
            _this._textEnabled = undefined;
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
        Object.defineProperty(OAVDefault.prototype, "textEnabled", {
            set: function (v) {
                this.text.enabled = v;
                this._textEnabled = v;
            },
            enumerable: true,
            configurable: true
        });
        OAVDefault.prototype.initView = function () {
            this.text.percentWidth = 100;
            this.text.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.text.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.text.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
        };
        OAVDefault.prototype.dispose = function () {
            editor.drag.unregister(this);
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
            this.text.enabled = this.attributeViewInfo.writable;
            var value = this.attributeValue;
            if (this.attributeValue === undefined) {
                this.text.text = String(this.attributeValue);
            }
            else if (!(this.attributeValue instanceof Object)) {
                this.text.text = String(this.attributeValue);
            }
            else {
                this.text.enabled = false;
                var valuename = this.attributeValue["name"] || "";
                this.text.text = valuename + " (" + this.attributeValue.constructor.name + ")";
                this.once(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            }
            if (this._textEnabled !== undefined)
                this.text.enabled = this._textEnabled;
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
            this.checkBox.addEventListener(egret.Event.CHANGE, this.onChange, this);
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
     * @author feng 2016-3-10
     */
    var OAVNumber = /** @class */ (function (_super) {
        __extends(OAVNumber, _super);
        function OAVNumber() {
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
            _this.mouseDownPosition = new feng3d.Vector2();
            _this.mouseDownValue = 0;
            return _this;
        }
        OAVNumber.prototype.initView = function () {
            _super.prototype.initView.call(this);
            this.addEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
        };
        OAVNumber.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            _super.prototype.dispose.call(this);
        };
        /**
         * 更新界面
         */
        OAVNumber.prototype.updateView = function () {
            // 消除数字显示为类似 0.0000000001 的问题
            var fractionDigits = 1;
            while (fractionDigits * this.step < 1) {
                fractionDigits *= 10;
            }
            this.text.text = String(Math.round(fractionDigits * (Math.round(this.attributeValue / this.step) * this.step)) / fractionDigits);
        };
        OAVNumber.prototype.onMouseDown = function (e) {
            this.mouseDownPosition.init(e.stageX, e.stageY);
            this.mouseDownValue = this.attributeValue;
            editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
            editor.editorui.stage.addEventListener(egret.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
        };
        OAVNumber.prototype.onStageMouseMove = function (e) {
            this.attributeValue = this.mouseDownValue + ((e.stageX - this.mouseDownPosition.x) + (this.mouseDownPosition.y - e.stageY)) * this.step * this.stepScale;
        };
        OAVNumber.prototype.onStageMouseUp = function () {
            editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_MOVE, this.onStageMouseMove, this);
            editor.editorui.stage.removeEventListener(egret.MouseEvent.MOUSE_UP, this.onStageMouseUp, this);
        };
        OAVNumber.prototype.ontxtfocusin = function () {
            _super.prototype.ontxtfocusin.call(this);
            feng3d.windowEventProxy.on("keydown", this.onWindowKeyDown, this);
        };
        OAVNumber.prototype.ontxtfocusout = function () {
            _super.prototype.ontxtfocusout.call(this);
            feng3d.windowEventProxy.off("keydown", this.onWindowKeyDown, this);
        };
        OAVNumber.prototype.onWindowKeyDown = function (event) {
            if (event.key == "ArrowUp") {
                this.attributeValue += this.step;
            }
            else if (event.key == "ArrowDown") {
                this.attributeValue -= this.step;
            }
        };
        OAVNumber = __decorate([
            feng3d.OAVComponent()
        ], OAVNumber);
        return OAVNumber;
    }(editor.OAVDefault));
    editor.OAVNumber = OAVNumber;
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
                var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
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
                attributeValue.length = size;
                for (var i = 0; i < attributeViews.length; i++) {
                    if (attributeViews[i].parent) {
                        attributeViews[i].parent.removeChild(attributeViews[i]);
                    }
                }
                for (var i = 0; i < attributeValue.length; i++) {
                    if (attributeValue[i] == null && this.attributeViewInfo.componentParam)
                        attributeValue[i] = feng3d.lazy.getvalue(this.attributeViewInfo.componentParam.defaultItem);
                    if (attributeViews[i] == null) {
                        var displayObject = new OAVArrayItem(attributeValue, i, this.attributeViewInfo.componentParam);
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
                name: index,
                writable: true,
                componentParam: componentParam,
                owner: arr,
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
            this.combobox.addEventListener(egret.Event.CHANGE, this.onComboxChange, this);
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
            this.space.on("addedComponent", this.onaddedcompont, this);
            this.space.on("removedComponent", this.onremovedComponent, this);
            editor.drag.register(this.addComponentButton, null, ["file_script"], function (dragdata) {
                if (dragdata.file_script) {
                    _this.space.addScript(dragdata.file_script);
                }
            });
            this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
            this.space.off("addedComponent", this.onaddedcompont, this);
            this.space.off("removedComponent", this.onremovedComponent, this);
            editor.drag.unregister(this.addComponentButton);
            this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVComponentList.prototype.addComponentView = function (component) {
            var o;
            if (!component.showInInspector)
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
        OAVComponentList.prototype.onaddedcompont = function (event) {
            this.addComponentView(event.data);
        };
        OAVComponentList.prototype.onremovedComponent = function (event) {
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
            this.colorPicker.addEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVColorPicker.prototype.dispose = function () {
            this.colorPicker.removeEventListener(egret.Event.CHANGE, this.onChange, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_IN, this.ontxtfocusin, this);
            this.input.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.ontxtfocusout, this);
            this.input.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
        };
        OAVColorPicker.prototype.updateView = function () {
            var color = this.attributeValue;
            if (color instanceof feng3d.Color3) {
                this.colorPicker.value = color;
            }
            else {
                this.colorPicker.value = color.toColor3();
            }
            this.input.text = color.toHexString();
        };
        OAVColorPicker.prototype.onChange = function (event) {
            var color = this.attributeValue;
            var pickerValue = this.colorPicker.value;
            color.r = pickerValue.r;
            color.g = pickerValue.g;
            color.b = pickerValue.b;
            //
            this.attributeValue = color;
            this.input.text = color.toHexString();
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
                var color = this.attributeValue;
                color.fromUnit(Number("0x" + text.substr(1)));
                this.attributeValue = color;
                if (color instanceof feng3d.Color3) {
                    this.colorPicker.value = color;
                }
                else {
                    this.colorPicker.value = color.toColor3();
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
                var view = feng3d.objectview.getObjectView(element);
                view.percentWidth = 100;
                _this.group.addChild(view);
                _this.views.push(view);
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
            });
            this.views = null;
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
     * @author feng 2016-3-10
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
            this.pickBtn.addEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            feng3d.watcher.watch(this.space, this.attributeName, this.updateView, this);
            var param = this.attributeViewInfo.componentParam;
            editor.drag.register(this, function (dragsource) {
                if (param.datatype)
                    dragsource[param.datatype] = _this.attributeValue;
            }, [param.accepttype], function (dragSource) {
                _this.attributeValue = dragSource[param.accepttype];
            });
        };
        OAVPick.prototype.dispose = function () {
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.onDoubleClick, this);
            this.pickBtn.removeEventListener(egret.MouseEvent.CLICK, this.ontxtClick, this);
            editor.drag.unregister(this);
            feng3d.watcher.unwatch(this.space, this.attributeName, this.updateView, this);
        };
        OAVPick.prototype.ontxtClick = function () {
            var _this = this;
            var param = this.attributeViewInfo.componentParam;
            if (param.accepttype) {
                if (param.accepttype == "image") {
                    var menus = editor.editorAssets.filter(function (file) {
                        return editor.regExps.image.test(file.path);
                    }).reduce(function (prev, item) {
                        prev.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item.path;
                            }
                        });
                        return prev;
                    }, []);
                    menus.unshift({
                        label: "\u7A7A", click: function () {
                            _this.attributeValue = "";
                        }
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "audio") {
                    var menus = editor.editorAssets.filter(function (file) {
                        return editor.regExps.audio.test(file.path);
                    }).reduce(function (prev, item) {
                        prev.push({
                            label: item.name, click: function () {
                                _this.attributeValue = item.path;
                            }
                        });
                        return prev;
                    }, []);
                    menus.unshift({
                        label: "\u7A7A", click: function () {
                            _this.attributeValue = "";
                        }
                    });
                    editor.menu.popup(menus);
                }
                else if (param.accepttype == "file_script") {
                    var materialfiles = editor.editorAssets.filter(function (file) {
                        return file.extension == feng3d.AssetExtension.script;
                    });
                    if (materialfiles.length > 0) {
                        getScriptClassNames(materialfiles, function (scriptClassNames) {
                            var menus = [];
                            scriptClassNames.forEach(function (element) {
                                menus.push({
                                    label: element,
                                    click: function () {
                                        _this.attributeValue = element;
                                    }
                                });
                            });
                            editor.menu.popup(menus);
                        });
                    }
                    else {
                        editor.menu.popup([{ label: "\u6CA1\u6709 " + param.accepttype + " \u8D44\u6E90" }]);
                    }
                }
                else if (param.accepttype == "material") {
                    var materialfiles = editor.editorAssets.filter(function (file) {
                        return file.extension == feng3d.AssetExtension.material;
                    });
                    if (materialfiles.length > 0) {
                        getMaterials(materialfiles, function (materials) {
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
                        });
                    }
                    else {
                        editor.menu.popup([{ label: "\u6CA1\u6709 " + param.accepttype + " \u8D44\u6E90" }]);
                    }
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
                var valuename = this.attributeValue["name"] || "";
                this.text.text = valuename + " (" + feng3d.classUtils.getQualifiedClassName(this.attributeValue).split(".").pop() + ")";
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
    function getScriptClassNames(tsfiles, callback, scriptClassNames) {
        if (scriptClassNames === void 0) { scriptClassNames = []; }
        if (tsfiles.length == 0) {
            callback(scriptClassNames);
            return;
        }
        tsfiles.shift().getScriptClassName(function (scriptClassName) {
            scriptClassNames.push(scriptClassName);
            getScriptClassNames(tsfiles, callback, scriptClassNames);
        });
    }
    function getMaterials(tsfiles, callback, materials) {
        if (materials === void 0) { materials = []; }
        if (tsfiles.length == 0) {
            callback(materials);
            return;
        }
        tsfiles.shift().getData(function (material) {
            materials.push(material);
            getMaterials(tsfiles, callback, materials);
        });
    }
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 挑选（拾取）OAV界面
     * @author feng 2016-3-10
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
            var menus = editor.editorAssets.filter(function (file) {
                return editor.regExps.image.test(file.path);
            }).reduce(function (prev, item) {
                prev.push({
                    label: item.name, click: function () {
                        var text = _this.attributeValue;
                        text.url = item.path;
                        _this.updateView();
                    }
                });
                return prev;
            }, []);
            menus.unshift({
                label: "\u7A7A", click: function () {
                    var text = _this.attributeValue;
                    text.url = "";
                    _this.updateView();
                }
            });
            editor.menu.popup(menus);
        };
        /**
         * 更新界面
         */
        OAVTexture2D.prototype.updateView = function () {
            var _this = this;
            var text = this.attributeValue;
            this.image.visible = false;
            this.img_border.visible = false;
            var url = text.url;
            if (url) {
                editor.fs.readFile(url, function (err, data) {
                    feng3d.dataTransform.arrayBufferToDataURL(data, function (dataurl) {
                        _this.image.source = dataurl;
                        _this.image.visible = true;
                        _this.img_border.visible = true;
                    });
                });
            }
            else {
                this.image.source = "";
            }
            feng3d.assets.readFileAsImage;
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
        OAVParticleComponentList.prototype.onAddComponentButtonClick = function () {
            editor.menu.popup(editor.getCreateParticleComponentMenu(this.space));
        };
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
            this.addComponentButton.addEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVParticleComponentList.prototype.dispose = function () {
            var components = this.attributeValue;
            for (var i = 0; i < components.length; i++) {
                this.removedComponentView(components[i]);
            }
            this.addComponentButton.removeEventListener(egret.MouseEvent.CLICK, this.onAddComponentButtonClick, this);
        };
        OAVParticleComponentList.prototype.addComponentView = function (component) {
            var o;
            var displayObject = new editor.ParticleComponentView(component);
            displayObject.percentWidth = 100;
            this.group.addChild(displayObject);
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
    /**
     * 属性面板（检查器）
     * @author feng     2017-03-20
     */
    var InspectorView = /** @class */ (function (_super) {
        __extends(InspectorView, _super);
        function InspectorView() {
            var _this = _super.call(this) || this;
            _this.viewDataList = [];
            _this.once(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.skinName = "InspectorViewSkin";
            return _this;
        }
        InspectorView.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            editor.editorui.inspectorView = this;
            if (this.stage) {
                this.onAddedToStage();
            }
        };
        InspectorView.prototype.onAddedToStage = function () {
            this.backButton.visible = this.viewDataList.length > 0;
            this.backButton.addEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onDataChange, this);
        };
        InspectorView.prototype.onRemovedFromStage = function () {
            this.backButton.removeEventListener(egret.MouseEvent.CLICK, this.onBackButton, this);
            feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onDataChange, this);
        };
        InspectorView.prototype.onDataChange = function () {
            var selectedObject = editor.editorData.selectedObjects;
            if (selectedObject && selectedObject.length > 0)
                this.showData(selectedObject[0], true);
            else
                this.showData(null, true);
        };
        InspectorView.prototype.updateView = function () {
            var _this = this;
            this.backButton.visible = this.viewDataList.length > 0;
            if (this.view && this.view.parent) {
                this.view.parent.removeChild(this.view);
            }
            if (this.viewData) {
                if (this.viewData instanceof editor.AssetsFile) {
                    var viewData = this.viewData;
                    viewData.showInspectorData(function (showdata) {
                        if (viewData == _this.viewData) {
                            if (_this.view && _this.view.parent) {
                                _this.view.parent.removeChild(_this.view);
                            }
                            _this.view = feng3d.objectview.getObjectView(showdata);
                            _this.view.percentWidth = 100;
                            _this.group.addChild(_this.view);
                        }
                    });
                }
                else {
                    this.view = feng3d.objectview.getObjectView(this.viewData);
                    this.view.percentWidth = 100;
                    this.group.addChild(this.view);
                }
            }
        };
        InspectorView.prototype.showData = function (data, removeBack) {
            if (removeBack === void 0) { removeBack = false; }
            if (this.viewData) {
                this.viewDataList.push(this.viewData);
            }
            if (removeBack) {
                this.viewDataList.forEach(function (element) {
                    if (element instanceof editor.AssetsFile) {
                        element.save(false, function () { });
                    }
                });
                this.viewDataList.length = 0;
            }
            //
            this.viewData = data;
            this.updateView();
        };
        InspectorView.prototype.onBackButton = function () {
            this.viewData = this.viewDataList.pop();
            this.updateView();
        };
        return InspectorView;
    }(eui.Component));
    editor.InspectorView = InspectorView;
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
                    _this.data.gameobject.addScript(dragdata.file_script);
                }
            });
            //
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        HierarchyTreeItemRenderer.prototype.$onRemoveFromStage = function () {
            editor.drag.unregister(this);
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        HierarchyTreeItemRenderer.prototype.setdargSource = function (dragSource) {
            dragSource.gameobject = this.data.gameobject;
        };
        HierarchyTreeItemRenderer.prototype.onclick = function () {
            HierarchyTreeItemRenderer.preSelectedItem = this;
            editor.editorData.selectObject(this.data.gameobject);
        };
        HierarchyTreeItemRenderer.prototype.dataChanged = function () {
            _super.prototype.dataChanged.call(this);
            if (this.data) {
                this.renameInput.text = this.data.label;
            }
            else {
            }
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
                }, {
                    label: "重命名", click: function () {
                        _this.renameInput.edit(function () {
                            _this.data.gameobject.name = _this.renameInput.text;
                        });
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
            editor.hierarchyTree.on("added", this.invalidHierarchy, this);
            editor.hierarchyTree.on("removed", this.invalidHierarchy, this);
            editor.hierarchyTree.on("openChanged", this.invalidHierarchy, this);
            this.updateHierarchyTree();
        };
        HierarchyView.prototype.onRemovedFromStage = function () {
            this.list.removeEventListener(egret.MouseEvent.CLICK, this.onListClick, this);
            this.list.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onListRightClick, this);
            editor.hierarchyTree.off("added", this.invalidHierarchy, this);
            editor.hierarchyTree.off("removed", this.invalidHierarchy, this);
            editor.hierarchyTree.off("openChanged", this.invalidHierarchy, this);
        };
        HierarchyView.prototype.invalidHierarchy = function () {
            feng3d.ticker.nextframe(this.updateHierarchyTree, this);
        };
        HierarchyView.prototype.updateHierarchyTree = function () {
            var nodes = editor.hierarchyTree.getShowNodes();
            this.listData.replaceAll(nodes);
        };
        HierarchyView.prototype.onListbackClick = function () {
            feng3d.log("onListbackClick");
        };
        HierarchyView.prototype.onListClick = function (e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
            }
        };
        HierarchyView.prototype.onListRightClick = function (e) {
            if (e.target == this.list) {
                editor.editorData.selectObject(null);
                editor.menu.popup(editor.createObjectConfig, feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY);
            }
        };
        return HierarchyView;
    }(eui.Component));
    editor.HierarchyView = HierarchyView;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var EditorAssets = /** @class */ (function () {
        function EditorAssets() {
            //attribute
            this.assetsPath = "Assets/";
            /**
             * 显示文件夹
             */
            this.showFloder = "Assets/";
            /**
             * 上次执行的项目脚本
             */
            this._preProjectJsContent = null;
            this.files = {};
        }
        //function
        EditorAssets.prototype.initproject = function (callback) {
            var _this = this;
            editor.fs.mkdir(this.assetsPath, function (err) {
                if (err) {
                    alert("初始化项目失败！");
                    feng3d.error(err);
                    return;
                }
                _this.files[_this.assetsPath] = new editor.AssetsFile(_this.assetsPath);
                editor.fs.getAllfilepathInFolder(_this.assetsPath, function (err, filepaths) {
                    feng3d.assert(!err);
                    filepaths.forEach(function (element) {
                        _this.files[element] = new editor.AssetsFile(element);
                    });
                    callback();
                });
            });
        };
        /**
         * 获取文件
         * @param path 文件路径
         */
        EditorAssets.prototype.getFile = function (path) {
            return this.files[path];
        };
        /**
         * 删除文件
         * @param path 文件路径
         */
        EditorAssets.prototype.deletefile = function (path, callback, includeRoot) {
            var _this = this;
            if (includeRoot === void 0) { includeRoot = false; }
            if (path == this.assetsPath && !includeRoot) {
                alert("无法删除根目录");
                return;
            }
            editor.fs.delete(path, function (err) {
                if (err)
                    feng3d.error(err);
                if (feng3d.pathUtils.isDirectory(path)) {
                    Object.keys(_this.files).forEach(function (element) {
                        if (element.indexOf(path) == 0) {
                            delete _this.files[element];
                            feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: element });
                        }
                    });
                    if (editor.editorAssets.showFloder == path && path != editor.editorAssets.assetsPath) {
                        editor.editorAssets.showFloder = feng3d.pathUtils.getParentPath(path);
                    }
                }
                delete _this.files[path];
                feng3d.feng3dDispatcher.dispatch("assets.deletefile", { path: path });
                editor.editorui.assetsview.invalidateAssetstree();
                callback && callback();
            });
        };
        EditorAssets.prototype.readScene = function (path, callback) {
            editor.fs.readFileAsString(path, function (err, data) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var json = JSON.parse(data);
                var sceneobject = feng3d.serialization.deserialize(json);
                var scene = sceneobject.getComponent(feng3d.Scene3D);
                scene.initCollectComponents();
                callback(null, scene);
            });
        };
        /**
         * 保存场景到文件
         * @param path 场景路径
         * @param scene 保存的场景
         */
        EditorAssets.prototype.saveScene = function (path, scene, callback) {
            if (callback === void 0) { callback = function (err) { }; }
            var obj = feng3d.serialization.serialize(scene.gameObject);
            var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
            feng3d.dataTransform.stringToUint8Array(str, function (uint8Array) {
                editor.fs.writeFile(path, uint8Array, callback);
            });
        };
        /**
        * 移动文件
        * @param path 移动的文件路径
        * @param destdirpath   目标文件夹
        * @param callback      完成回调
        */
        EditorAssets.prototype.movefile = function (path, destdirpath, callback) {
            var assetsfile = this.getFile(path);
            if (assetsfile) {
                assetsfile.moveToDir(destdirpath, callback);
            }
            else {
                var filename = path.split("/").pop();
                var dest = destdirpath + "/" + filename;
                editor.fs.move(path, dest, callback);
            }
        };
        EditorAssets.prototype.getparentdir = function (path) {
            var paths = path.split("/");
            paths.pop();
            var parentdir = paths.join("/");
            return parentdir;
        };
        /**
         * 弹出文件菜单
         */
        EditorAssets.prototype.popupmenu = function (assetsFile, othermenus) {
            var _this = this;
            var menuconfig = [];
            if (assetsFile.isDirectory) {
                menuconfig.push({
                    label: "新建",
                    submenu: [
                        {
                            label: "文件夹", click: function () {
                                assetsFile.addfolder("New Folder");
                            }
                        },
                        {
                            label: "脚本", click: function () {
                                var scriptName = "NewScript";
                                assetsFile.addfile(scriptName + ".script.ts", editor.assetsFileTemplates.getNewScript(scriptName));
                            }
                        },
                        {
                            label: "着色器", click: function () {
                                var shadername = "NewShader";
                                assetsFile.addfile(shadername + ".shader.ts", editor.assetsFileTemplates.getNewShader(shadername));
                            }
                        },
                        {
                            label: "ts", click: function () {
                                assetsFile.addfile("new file.ts", "");
                            }
                        },
                        {
                            label: "js", click: function () {
                                assetsFile.addfile("new file.js", "");
                            }
                        },
                        {
                            label: "Json", click: function () {
                                assetsFile.addfile("new json.json", "{}");
                            }
                        },
                        {
                            label: "文本", click: function () {
                                assetsFile.addfile("new text.txt", "");
                            }
                        },
                        { type: "separator" },
                        {
                            label: "贴图", click: function () {
                                assetsFile.addfile("new texture" + ".texture.json", new feng3d.UrlImageTexture2D());
                            }
                        },
                        {
                            label: "立方体贴图", click: function () {
                                assetsFile.addfile("new texturecube" + ".texturecube.json", new feng3d.TextureCube());
                            }
                        },
                        {
                            label: "材质", click: function () {
                                assetsFile.addfile("new material" + ".material.json", feng3d.materialFactory.create("standard"));
                            }
                        },
                    ]
                }, { type: "separator" }, {
                    label: "导入资源", click: function () {
                        editor.fs.selectFile(function (fileList) {
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
            var openMenu = getOpenCodeEditorMenu(assetsFile);
            if (openMenu)
                menuconfig.push(openMenu);
            // 解析菜单
            this.parserMenu(menuconfig, assetsFile);
            menuconfig.push({
                label: "删除", click: function () {
                    editor.editorAssets.deletefile(assetsFile.path);
                }
            });
            if (othermenus && othermenus.rename) {
                menuconfig.push(othermenus.rename);
            }
            editor.menu.popup(menuconfig);
            function getOpenCodeEditorMenu(file) {
                var menu;
                // 使用编辑器打开
                if (file.extension == feng3d.AssetExtension.ts
                    || file.extension == feng3d.AssetExtension.js
                    || file.extension == feng3d.AssetExtension.txt
                    || file.extension == feng3d.AssetExtension.shader
                    || file.extension == feng3d.AssetExtension.json
                    || file.extension == feng3d.AssetExtension.material
                    || file.extension == feng3d.AssetExtension.gameobject
                    || file.extension == feng3d.AssetExtension.geometry
                    || file.extension == feng3d.AssetExtension.scene
                    || file.extension == feng3d.AssetExtension.script) {
                    menu = {
                        label: "编辑", click: function () {
                            var url = "codeeditor.html?fstype=" + feng3d.assets.type + "&project=" + editor.editorcache.projectname + "&path=" + file.path;
                            url = document.URL.substring(0, document.URL.lastIndexOf("/")) + "/" + url;
                            // if (assets.type == FSType.native)
                            // {
                            //     alert(`请使用本地编辑器编辑代码，推荐 vscode`);
                            // } else
                            // {
                            if (editor.codeeditoWin)
                                editor.codeeditoWin.close();
                            editor.codeeditoWin = window.open(url);
                            // }
                        }
                    };
                }
                return menu;
            }
        };
        /**
         * 获取一个新路径
         */
        EditorAssets.prototype.getnewpath = function (path, callback) {
            var index = 0;
            var basepath = "";
            var ext = "";
            if (path.indexOf(".") == -1) {
                basepath = path;
                ext = "";
            }
            else {
                basepath = path.substring(0, path.indexOf("."));
                ext = path.substring(path.indexOf("."));
            }
            searchnewpath();
            function newpath() {
                var path = index == 0 ?
                    (basepath + ext) :
                    (basepath + " " + index + ext);
                index++;
                return path;
            }
            function searchnewpath() {
                var path = newpath();
                editor.fs.exists(path, function (exists) {
                    if (exists)
                        searchnewpath();
                    else
                        callback(path);
                });
            }
        };
        EditorAssets.prototype.saveObject = function (object, filename, override, callback) {
            if (override === void 0) { override = false; }
            var showFloder = this.getFile(this.showFloder);
            showFloder.addfile(filename, object, override, callback);
        };
        /**
         * 过滤出文件列表
         * @param fn 过滤函数
         * @param next 是否继续遍历children
         */
        EditorAssets.prototype.filter = function (fn) {
            var results = [];
            for (var path in this.files) {
                var element = this.files[path];
                if (fn(element))
                    results.push(element);
            }
            return results;
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
                editor.editorData.selectObject.apply(editor.editorData, assetsFiles);
                callback && callback(assetsFiles);
                return;
            }
            var file = files.shift();
            var reader = new FileReader();
            reader.addEventListener('load', function (event) {
                var result = event.target["result"];
                var showFloder = _this.getFile(_this.showFloder);
                showFloder.addfileFromArrayBuffer(file.name, result, false, function (e, file) {
                    if (e)
                        feng3d.error(e);
                    else
                        assetsFiles.push(file);
                    _this.inputFiles(files, callback, assetsFiles);
                });
            }, false);
            reader.readAsArrayBuffer(file);
        };
        EditorAssets.prototype.runProjectScript = function (callback) {
            var _this = this;
            editor.fs.readFileAsString("project.js", function (err, content) {
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
        EditorAssets.prototype.parserMenu = function (menuconfig, file) {
            var _this = this;
            var extensions = file.path.split(".").pop();
            switch (extensions) {
                case "mdl":
                    menuconfig.push({
                        label: "解析", click: function () {
                            editor.fs.readFileAsString(file.path, function (err, content) {
                                feng3d.war3.MdlParser.parse(content, function (war3Model) {
                                    var paths = file.path.split("/");
                                    paths.pop();
                                    war3Model.root = paths.join("/") + "/";
                                    var gameobject = war3Model.getMesh();
                                    gameobject.name = feng3d.pathUtils.getName(file.name);
                                    _this.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.gameobject);
                                });
                            });
                        }
                    });
                    break;
                case "obj":
                    menuconfig.push({
                        label: "解析", click: function () {
                            editor.fs.readFileAsString(file.path, function (err, content) {
                                feng3d.ObjLoader.parse(content, function (gameobject) {
                                    gameobject.name = feng3d.pathUtils.getName(file.name);
                                    _this.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.gameobject);
                                });
                            });
                        }
                    });
                    break;
                case "fbx":
                    menuconfig.push({
                        label: "解析", click: function () {
                            editor.fs.readFile(file.path, function (err, data) {
                                editor.threejsLoader.load(data, function (gameobject) {
                                    gameobject.name = feng3d.pathUtils.getName(file.name);
                                    _this.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.gameobject);
                                    // engine.root.addChild(gameobject);
                                });
                            });
                        }
                    });
                    break;
                case "md5mesh":
                    menuconfig.push({
                        label: "解析", click: function () {
                            editor.fs.readFileAsString(file.path, function (err, content) {
                                feng3d.MD5Loader.parseMD5Mesh(content, function (gameobject) {
                                    gameobject.name = feng3d.pathUtils.getName(file.name);
                                    _this.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.gameobject);
                                    // engine.root.addChild(gameobject);
                                });
                            });
                        }
                    });
                    break;
                case "md5anim":
                    menuconfig.push({
                        label: "解析", click: function () {
                            editor.fs.readFileAsString(file.path, function (err, content) {
                                feng3d.MD5Loader.parseMD5Anim(content, function (animationclip) {
                                    animationclip.name = feng3d.pathUtils.getName(file.name);
                                    _this.saveObject(animationclip, animationclip.name + "." + feng3d.AssetExtension.anim);
                                });
                            });
                        }
                    });
                    break;
            }
        };
        EditorAssets.prototype.showFloderChanged = function (property, oldValue, newValue) {
            feng3d.feng3dDispatcher.dispatch("assets.showFloderChanged", { oldpath: oldValue, newpath: newValue });
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
    var AssetsFile = /** @class */ (function () {
        function AssetsFile(path, data) {
            /**
             * 是否选中
             */
            this.selected = false;
            this.cacheData = data;
            this.path = path;
        }
        AssetsFile.prototype.pathChanged = function () {
            var _this = this;
            // 更新名字
            this.name = feng3d.pathUtils.getNameWithExtension(this.path);
            this.label = this.name.split(".").shift();
            this.isDirectory = feng3d.pathUtils.isDirectory(this.path);
            if (this.isDirectory)
                this.extension = feng3d.AssetExtension.folder;
            else
                this.extension = feng3d.pathUtils.getExtension(this.path);
            // 更新图标
            if (this.isDirectory) {
                this.image = "folder_png";
            }
            else {
                if (RES.getRes(this.extension.split(".").shift() + "_png")) {
                    this.image = this.extension.split(".").shift() + "_png";
                }
                else {
                    this.image = "file_png";
                }
            }
            if (editor.regExps.image.test(this.path)) {
                this.getData(function (data) {
                    _this.image = data;
                });
            }
        };
        /**
         * 获取属性显示数据
         * @param callback 获取属性面板显示数据回调
         */
        AssetsFile.prototype.showInspectorData = function (callback) {
            if (this.cacheData) {
                callback(this.cacheData);
                return;
            }
            this.getData(function (data) {
                callback(data);
            });
        };
        /**
         * 获取文件数据
         * @param callback 获取文件数据回调
         */
        AssetsFile.prototype.getData = function (callback) {
            var _this = this;
            if (this.cacheData) {
                callback(this.cacheData);
                return;
            }
            if (this.isDirectory) {
                callback({ isDirectory: true });
                return;
            }
            if (editor.regExps.json.test(this.path)) {
                editor.fs.readFileAsString(this.path, function (err, content) {
                    var json = JSON.parse(content);
                    _this.cacheData = feng3d.serialization.deserialize(json);
                    _this.cacheData["path"] = _this.path;
                    callback(_this.cacheData);
                });
                return;
            }
            if (editor.regExps.image.test(this.path)) {
                editor.fs.readFile(this.path, function (err, data) {
                    feng3d.dataTransform.arrayBufferToDataURL(data, function (dataurl) {
                        _this.cacheData = dataurl;
                        callback(_this.cacheData);
                    });
                });
                return;
            }
        };
        /**
         * 重命名
         * @param newname 新文件名称
         * @param callback 重命名完成回调
         */
        AssetsFile.prototype.rename = function (newname, callback) {
            var oldpath = this.path;
            var newpath = feng3d.pathUtils.getParentPath(this.path) + newname;
            if (this.isDirectory)
                newpath = newpath + "/";
            this.move(oldpath, newpath, callback);
        };
        /**
         * 移动文件（夹）到指定文件夹
         * @param destdirpath 目标文件夹路径
         * @param callback 移动文件完成回调
         */
        AssetsFile.prototype.moveToDir = function (destdirpath, callback) {
            //禁止向子文件夹移动
            if (destdirpath.indexOf(this.path) != -1)
                return;
            var oldpath = this.path;
            var newpath = destdirpath + this.name;
            if (this.isDirectory)
                newpath += "/";
            var destDir = editor.editorAssets.getFile(destdirpath);
            this.move(oldpath, newpath, callback);
        };
        /**
         * 移动文件（夹）
         * @param oldpath 老路径
         * @param newpath 新路径
         * @param callback 回调函数
         */
        AssetsFile.prototype.move = function (oldpath, newpath, callback) {
            var _this = this;
            editor.fs.move(oldpath, newpath, function (err) {
                feng3d.assert(!err);
                if (_this.isDirectory) {
                    var movefiles = editor.editorAssets.filter(function (item) { return item.path.substr(0, oldpath.length) == oldpath; });
                    movefiles.forEach(function (element) {
                        delete editor.editorAssets.files[element.path];
                        element.path = newpath + element.path.substr(oldpath.length);
                        editor.editorAssets.files[element.path] = element;
                    });
                }
                delete editor.editorAssets.files[_this.path];
                _this.path = newpath;
                editor.editorAssets.files[_this.path] = _this;
                if (editor.editorAssets.showFloder == oldpath) {
                    editor.editorAssets.showFloder = newpath;
                }
                editor.editorui.assetsview.invalidateAssetstree();
                callback && callback(_this);
            });
        };
        /**
         * 新增子文件夹
         * @param newfoldername 新增文件夹名称
         * @param callback      完成回调
         */
        AssetsFile.prototype.addfolder = function (newfoldername, callback) {
            var folderpath = this.getnewname(this.path + newfoldername);
            folderpath = folderpath + "/";
            editor.fs.mkdir(folderpath, function (e) {
                feng3d.assert(!e);
                editor.editorAssets.files[folderpath] = new AssetsFile(folderpath);
                editor.editorui.assetsview.invalidateAssetstree();
            });
        };
        /**
         * 新增文件
         * @param filename 新增文件名称
         * @param content 文件内容
         * @param callback 完成回调
         */
        AssetsFile.prototype.addfile = function (filename, content, override, callback) {
            var _this = this;
            if (override === void 0) { override = false; }
            var filepath = this.path + filename;
            if (!override) {
                filepath = this.getnewname(filepath);
            }
            var assetsFile = new AssetsFile(filepath, content);
            assetsFile.save(true, function () {
                editor.editorAssets.files[filepath] = assetsFile;
                editor.editorData.selectObject(assetsFile);
                editor.editorui.assetsview.invalidateAssetstree();
                callback && callback(_this);
                if (editor.regExps.image.test(assetsFile.path))
                    feng3d.feng3dDispatcher.dispatch("assets.imageAssetsChanged", { url: assetsFile.path });
            });
        };
        /**
         * 新增文件从ArrayBuffer
         * @param filename 新增文件名称
         * @param arraybuffer 文件数据
         * @param callback 完成回调
         */
        AssetsFile.prototype.addfileFromArrayBuffer = function (filename, arraybuffer, override, callback) {
            if (override === void 0) { override = false; }
            var filepath = this.path + filename;
            if (!override) {
                filepath = this.getnewname(filepath);
            }
            editor.fs.writeFile(filepath, arraybuffer, function (e) {
                if (e) {
                    callback(e, null);
                    return;
                }
                var assetsFile = new AssetsFile(filepath);
                editor.editorAssets.files[filepath] = assetsFile;
                editor.editorData.selectObject(assetsFile);
                editor.editorui.assetsview.invalidateAssetstree();
                callback && callback(null, assetsFile);
                if (editor.regExps.image.test(assetsFile.path))
                    feng3d.feng3dDispatcher.dispatch("assets.imageAssetsChanged", { url: assetsFile.path });
            });
        };
        /**
         * 保存数据到文件
         * @param create 如果文件不存在，是否新建文件
         * @param callback 回调函数
         */
        AssetsFile.prototype.save = function (create, callback) {
            var _this = this;
            if (create === void 0) { create = false; }
            if (this.cacheData == undefined) {
                callback && callback(null);
                return;
            }
            if (!create && !editor.editorAssets.files[this.path]) {
                var e = new Error("\u9700\u8981\u4FDD\u5B58\u7684\u6587\u4EF6 " + this.path + " \u4E0D\u5B58\u5728");
                if (callback)
                    callback(e);
                else if (e)
                    feng3d.error(e);
                return;
            }
            this.getArrayBuffer(function (arraybuffer) {
                editor.fs.writeFile(_this.path, arraybuffer, function (e) {
                    if (callback)
                        callback(e);
                    else if (e)
                        feng3d.error(e);
                });
            });
        };
        /**
         * 获取ArrayBuffer数据
         * @param callback 回调函数
         */
        AssetsFile.prototype.getArrayBuffer = function (callback) {
            var content = this.cacheData;
            if (content instanceof ArrayBuffer) {
                callback(content);
            }
            else if (typeof content == "string") {
                if (editor.regExps.image.test(this.path)) {
                    feng3d.dataTransform.dataURLToArrayBuffer(content, function (arrayBuffer) {
                        callback(arrayBuffer);
                    });
                }
                else {
                    feng3d.dataTransform.stringToArrayBuffer(content, function (arrayBuffer) {
                        callback(arrayBuffer);
                    });
                }
            }
            else {
                var obj = feng3d.serialization.serialize(content);
                var str = JSON.stringify(obj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
                feng3d.dataTransform.stringToArrayBuffer(str, function (arrayBuffer) {
                    callback(arrayBuffer);
                });
            }
        };
        /**
         * 获取一个新的不重名子文件名称
         */
        AssetsFile.prototype.getnewname = function (path) {
            if (editor.editorAssets.getFile(path) == null && editor.editorAssets.getFile(path + "/") == null)
                return path;
            var basepath = "";
            var ext = "";
            if (path.indexOf(".") == -1) {
                basepath = path;
                ext = "";
            }
            else {
                basepath = path.substring(0, path.indexOf("."));
                ext = path.substring(path.indexOf("."));
            }
            var index = 1;
            do {
                var path = basepath + " " + index + ext;
                index++;
            } while (!(editor.editorAssets.getFile(path) == null && editor.editorAssets.getFile(path + "/") == null));
            return path;
        };
        /**
         * 获取脚本类名称
         * @param callback 回调函数
         */
        AssetsFile.prototype.getScriptClassName = function (callback) {
            var _this = this;
            if (this.extension != feng3d.AssetExtension.script)
                return "";
            this.cacheData = null;
            this.getData(function (code) {
                // 获取脚本类名称
                var result = editor.regExps.scriptClass.exec(code);
                feng3d.assert(result != null, "\u5728\u811A\u672C " + _this.path + " \u4E2D\u6CA1\u6709\u627E\u5230 \u811A\u672C\u7C7B\u5B9A\u4E49");
                var script = result[2];
                // 获取导出类命名空间
                if (result[1]) {
                    result = editor.regExps.namespace.exec(code);
                    feng3d.assert(result != null, "\u83B7\u53D6\u811A\u672C " + _this.path + " \u547D\u540D\u7A7A\u95F4\u5931\u8D25");
                    script = result[1] + "." + script;
                }
                callback(script);
            });
        };
        __decorate([
            feng3d.watch("pathChanged")
        ], AssetsFile.prototype, "path", void 0);
        return AssetsFile;
    }());
    editor.AssetsFile = AssetsFile;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsFileItemRenderer = /** @class */ (function (_super) {
        __extends(AssetsFileItemRenderer, _super);
        function AssetsFileItemRenderer() {
            var _this = _super.call(this) || this;
            _this.skinName = "AssetsFileItemRenderer";
            return _this;
        }
        AssetsFileItemRenderer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.addEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        AssetsFileItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.DOUBLE_CLICK, this.ondoubleclick, this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        AssetsFileItemRenderer.prototype.dataChanged = function () {
            var _this = this;
            _super.prototype.dataChanged.call(this);
            if (this.data) {
                this.renameInput.text = this.data.label;
                this.renameInput.textAlign = egret.HorizontalAlign.CENTER;
                var accepttypes = [];
                if (this.data.isDirectory) {
                    editor.drag.register(this, function (dragsource) {
                        dragsource.file = _this.data.path;
                    }, ["file"], function (dragdata) {
                        var movefile = editor.editorAssets.getFile(dragdata.file);
                        movefile.moveToDir(_this.data.path);
                    });
                }
                else {
                    editor.drag.register(this, function (dragsource) {
                        var extension = _this.data.extension;
                        switch (extension) {
                            case feng3d.AssetExtension.gameobject:
                                dragsource.file_gameobject = _this.data.path;
                                break;
                            case feng3d.AssetExtension.script:
                                _this.data.getScriptClassName(function (scriptClassName) {
                                    dragsource.file_script = scriptClassName;
                                    editor.drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.anim:
                                var path = _this.data.path;
                                _this.data.getData(function (data) {
                                    dragsource.animationclip = data;
                                    editor.drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.material:
                                var path = _this.data.path;
                                _this.data.getData(function (data) {
                                    dragsource.material = data;
                                    editor.drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.texturecube:
                                var path = _this.data.path;
                                _this.data.getData(function (data) {
                                    dragsource.texturecube = data;
                                    editor.drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.geometry:
                                var path = _this.data.path;
                                _this.data.getData(function (data) {
                                    dragsource.geometry = data;
                                    editor.drag.refreshAcceptables();
                                });
                                break;
                            case feng3d.AssetExtension.png:
                            case feng3d.AssetExtension.jpg:
                            case feng3d.AssetExtension.jpeg:
                            case feng3d.AssetExtension.gif:
                                dragsource.image = _this.data.path;
                                break;
                            case feng3d.AssetExtension.mp3:
                            case feng3d.AssetExtension.ogg:
                            case feng3d.AssetExtension.wav:
                                dragsource.audio = _this.data.path;
                                break;
                        }
                        dragsource.file = _this.data.path;
                    }, []);
                }
            }
            else {
                editor.drag.unregister(this);
            }
        };
        AssetsFileItemRenderer.prototype.ondoubleclick = function () {
            if (this.data.isDirectory) {
                editor.editorAssets.showFloder = this.data.path;
            }
            else if (this.data.extension == feng3d.AssetExtension.scene) {
                this.data.getData(function (data) {
                    var scene = data.getComponent(feng3d.Scene3D);
                    scene.initCollectComponents();
                    editor.engine.scene = scene;
                });
            }
        };
        AssetsFileItemRenderer.prototype.onclick = function () {
            editor.editorData.selectObject(this.data);
        };
        AssetsFileItemRenderer.prototype.onrightclick = function (e) {
            var _this = this;
            e.stopPropagation();
            var othermenus = {
                rename: {
                    label: "重命名",
                    click: function () {
                        _this.renameInput.edit(function () {
                            var newName = _this.data.name.replace(_this.data.label, _this.renameInput.text);
                            _this.data.rename(newName);
                        });
                    }
                }
            };
            editor.editorAssets.popupmenu(this.data, othermenus);
        };
        return AssetsFileItemRenderer;
    }(eui.ItemRenderer));
    editor.AssetsFileItemRenderer = AssetsFileItemRenderer;
})(editor || (editor = {}));
var editor;
(function (editor) {
    var AssetsTree = /** @class */ (function () {
        function AssetsTree() {
            this.nodes = {};
            feng3d.feng3dDispatcher.on("assets.showFloderChanged", this.onShowFloderChanged, this);
        }
        AssetsTree.prototype.getNode = function (path) {
            var node = this.nodes[path];
            if (!node)
                node = this.nodes[path] = new AssetsTreeNode(path);
            if (path == editor.editorAssets.showFloder)
                node.selected = true;
            return node;
        };
        AssetsTree.prototype.onShowFloderChanged = function (event) {
            var oldnode = this.getNode(event.data.oldpath);
            if (oldnode)
                oldnode.selected = false;
            var node = this.getNode(event.data.newpath);
            if (node)
                node.selected = true;
        };
        return AssetsTree;
    }());
    editor.AssetsTree = AssetsTree;
    editor.assetsTree = new AssetsTree();
    var AssetsTreeNode = /** @class */ (function (_super) {
        __extends(AssetsTreeNode, _super);
        function AssetsTreeNode(path) {
            var _this = _super.call(this) || this;
            /**
             * 文件夹是否打开
             */
            _this.isOpen = true;
            _this.children = [];
            _this.path = path;
            _this.depth = feng3d.pathUtils.getDirDepth(path);
            return _this;
        }
        Object.defineProperty(AssetsTreeNode.prototype, "label", {
            get: function () {
                return this.assetsFile.label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AssetsTreeNode.prototype, "parent", {
            get: function () {
                var parentpath = feng3d.pathUtils.getParentPath(this.path);
                return editor.assetsTree.nodes[parentpath];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AssetsTreeNode.prototype, "assetsFile", {
            get: function () {
                return editor.editorAssets.getFile(this.path);
            },
            enumerable: true,
            configurable: true
        });
        AssetsTreeNode.prototype.openChanged = function () {
            editor.editorui.assetsview.invalidateAssetstree();
        };
        __decorate([
            feng3d.watch("openChanged")
        ], AssetsTreeNode.prototype, "isOpen", void 0);
        return AssetsTreeNode;
    }(editor.TreeNode));
    editor.AssetsTreeNode = AssetsTreeNode;
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
        };
        AssetsTreeItemRenderer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEventListener(egret.MouseEvent.CLICK, this.onclick, this);
            this.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onrightclick, this);
        };
        AssetsTreeItemRenderer.prototype.dataChanged = function () {
            var _this = this;
            _super.prototype.dataChanged.call(this);
            if (this.data) {
                this.renameInput.text = this.data.label;
                var accepttypes = [];
                editor.drag.register(this, function (dragsource) {
                    dragsource.file = _this.data.path;
                }, ["file"], function (dragdata) {
                    var movefile = editor.editorAssets.getFile(dragdata.file);
                    movefile.moveToDir(_this.data.path);
                });
            }
            else {
                editor.drag.unregister(this);
            }
        };
        AssetsTreeItemRenderer.prototype.onclick = function () {
            editor.editorAssets.showFloder = this.data.path;
        };
        AssetsTreeItemRenderer.prototype.onrightclick = function (e) {
            var _this = this;
            if (this.data.parent != null) {
                var othermenus = {
                    rename: {
                        label: "重命名",
                        click: function () {
                            _this.renameInput.edit(function () {
                                var newName = _this.data.assetsFile.name.replace(_this.data.label, _this.renameInput.text);
                                _this.data.assetsFile.rename(newName);
                            });
                        }
                    }
                };
                editor.editorAssets.popupmenu(this.data.assetsFile, othermenus);
            }
            else {
                editor.editorAssets.popupmenu(this.data.assetsFile);
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
            this.treelist.itemRenderer = editor.AssetsTreeItemRenderer;
            this.filelist.itemRenderer = editor.AssetsFileItemRenderer;
            this.listData = this.treelist.dataProvider = new eui.ArrayCollection();
            this.filelistData = this.filelist.dataProvider = new eui.ArrayCollection();
        };
        AssetsView.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.excludeTxt.text = "";
            this.filepathLabel.text = "";
            //
            editor.drag.register(this.filelistgroup, function (dragsource) { }, ["gameobject", "animationclip", "material", "geometry"], function (dragSource) {
                if (dragSource.gameobject) {
                    var gameobject = dragSource.gameobject;
                    if (gameobject.getComponent(feng3d.Scene3D) != null)
                        editor.editorAssets.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.scene);
                    else
                        editor.editorAssets.saveObject(gameobject, gameobject.name + "." + feng3d.AssetExtension.gameobject);
                }
                if (dragSource.animationclip) {
                    var animationclip = dragSource.animationclip;
                    editor.editorAssets.saveObject(animationclip, animationclip.name + "." + feng3d.AssetExtension.anim);
                }
                if (dragSource.material) {
                    var material = dragSource.material;
                    editor.editorAssets.saveObject(material, material.shaderName + "." + feng3d.AssetExtension.material);
                }
                if (dragSource.geometry) {
                    var geometry = dragSource.geometry;
                    editor.editorAssets.saveObject(geometry, geometry.name + "." + feng3d.AssetExtension.geometry);
                }
            });
            this.initlist();
            //
            this.fileDrag.addEventListener();
            this.filelist.addEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.addEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.addEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.floderpathTxt.touchEnabled = true;
            this.floderpathTxt.addEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.watcher.watch(editor.editorAssets, "showFloder", this.updateShowFloder, this);
            feng3d.watcher.watch(editor.editorData, "selectedObjects", this.selectedfilechanged, this);
        };
        AssetsView.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.filelist.removeEventListener(egret.MouseEvent.CLICK, this.onfilelistclick, this);
            this.filelist.removeEventListener(egret.MouseEvent.RIGHT_CLICK, this.onfilelistrightclick, this);
            this.includeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.excludeTxt.removeEventListener(egret.Event.CHANGE, this.onfilter, this);
            this.floderpathTxt.removeEventListener(egret.TextEvent.LINK, this.onfloderpathTxtLink, this);
            feng3d.watcher.unwatch(editor.editorAssets, "showFloder", this.updateShowFloder, this);
            feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.selectedfilechanged, this);
            //
            editor.drag.unregister(this.filelistgroup);
            this.fileDrag.removeEventListener();
        };
        AssetsView.prototype.initlist = function () {
            var _this = this;
            editor.editorAssets.initproject(function () {
                _this.invalidateAssetstree();
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
            this.once(egret.Event.ENTER_FRAME, this.update, this);
        };
        AssetsView.prototype.updateAssetsTree = function () {
            var paths = Object.keys(editor.editorAssets.files).filter(function (item) { return feng3d.pathUtils.isDirectory(item); }).sort();
            var nodes = [];
            var closepath;
            for (var i = 0, n = paths.length; i < n; i++) {
                var element = paths[i];
                var node = editor.assetsTree.getNode(element);
                node.children.length = 0;
                var nodeparent = node.parent;
                if (nodeparent)
                    nodeparent.children.push(node);
                // node.selected = element == editorAssets.showFloder;
                if (closepath) {
                    if (element.substr(0, closepath.length) == closepath)
                        continue;
                    closepath = null;
                }
                if (!node.isOpen)
                    closepath = element;
                nodes.push(node);
            }
            this.listData.replaceAll(nodes);
        };
        AssetsView.prototype.updateShowFloder = function (host, property, oldvalue) {
            var _this = this;
            var floders = editor.editorAssets.showFloder.split("/");
            // 除去尾部 ""
            floders.pop();
            var textFlow = new Array();
            do {
                var path = floders.join("/") + "/";
                if (textFlow.length > 0)
                    textFlow.unshift({ text: " > " });
                textFlow.unshift({ text: floders.pop(), style: { "href": "event:" + path } });
                if (path == editor.editorAssets.assetsPath)
                    break;
            } while (floders.length > 0);
            this.floderpathTxt.textFlow = textFlow;
            var children = editor.editorAssets.filter(function (item) { return feng3d.pathUtils.getParentPath(item.path) == editor.editorAssets.showFloder; });
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
                    if (!includeReg.test(value.path))
                        return false;
                }
                if (_this.excludeTxt.text) {
                    if (excludeReg.test(value.path))
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
                if (a.path < b.path)
                    return -1;
                return 1;
            });
            this.filelistData.replaceAll(nodes);
            this.selectedfilechanged();
        };
        AssetsView.prototype.onfilter = function () {
            this.updateShowFloder();
        };
        AssetsView.prototype.selectedfilechanged = function () {
            var _this = this;
            this.selectfile = null;
            var selectedAssetsFile = editor.editorData.selectedAssetsFile;
            var assetsFiles = this.filelistData.source;
            assetsFiles.forEach(function (element) {
                element.selected = selectedAssetsFile.indexOf(element) != -1;
                if (element.selected)
                    _this.selectfile = element;
            });
            if (this.selectfile)
                this.filepathLabel.text = this.selectfile.name;
            else
                this.filepathLabel.text = "";
        };
        AssetsView.prototype.onfilelistclick = function (e) {
            if (e.target == this.filelist) {
                editor.editorData.selectObject(null);
            }
        };
        AssetsView.prototype.onfilelistrightclick = function (e) {
            var assetsFile = editor.editorAssets.getFile(editor.editorAssets.showFloder);
            if (assetsFile) {
                editor.editorAssets.popupmenu(assetsFile);
            }
        };
        AssetsView.prototype.onfloderpathTxtLink = function (evt) {
            editor.editorAssets.showFloder = evt.text;
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
    var shaderTemplate = "\nclass NewShaderUniforms\n{\n    /** \n     * \u989C\u8272 \n     */\n    @feng3d.serialize\n    @feng3d.oav()\n    u_color = new feng3d.Color4();\n}\n\nfeng3d.shaderConfig.shaders[\"NewShader\"] = {\n    cls: NewShaderUniforms,\n    vertex: `\n    \n    attribute vec3 a_position;\n    \n    uniform mat4 u_modelMatrix;\n    uniform mat4 u_viewProjection;\n    \n    void main(void) {\n    \n        vec4 globalPosition = u_modelMatrix * vec4(a_position, 1.0);\n        gl_Position = u_viewProjection * globalPosition;\n    }`,\n    fragment: `\n    \n    precision mediump float;\n    \n    uniform vec4 u_color;\n    \n    void main(void) {\n        \n        gl_FragColor = u_color;\n    }\n    `,\n};\n\ntype NewShaderMaterial = feng3d.Material & { uniforms: NewShaderUniforms; };\ninterface MaterialFactory\n{\n    create(shader: \"NewShader\", raw?: gPartial<NewShaderMaterial>): NewShaderMaterial;\n}\n\ninterface MaterialRawMap\n{\n    NewShader: gPartial<NewShaderMaterial>;\n}";
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
            feng3d.watcher.watch(editor.mrsTool, "toolType", this.updateview, this);
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
            feng3d.watcher.unwatch(editor.mrsTool, "toolType", this.updateview, this);
            if (editor.runwin)
                editor.runwin.close();
            editor.runwin = null;
        };
        TopView.prototype.onMainMenu = function (item) {
            editor.editorDispatcher.dispatch(item.command);
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
                    editor.mrsTool.toolType = editor.MRSToolType.MOVE;
                    break;
                case this.rotateButton:
                    editor.mrsTool.toolType = editor.MRSToolType.ROTATION;
                    break;
                case this.scaleButton:
                    editor.mrsTool.toolType = editor.MRSToolType.SCALE;
                    break;
                case this.worldButton:
                    editor.mrsTool.isWoldCoordinate = !editor.mrsTool.isWoldCoordinate;
                    break;
                case this.centerButton:
                    editor.mrsTool.isBaryCenter = !editor.mrsTool.isBaryCenter;
                    break;
                case this.playBtn:
                    editor.editorAssets.saveScene("default.scene.json", editor.engine.scene, function (err) {
                        if (err) {
                            feng3d.warn(err);
                            return;
                        }
                        if (editor.fs.type == feng3d.FSType.indexedDB) {
                            if (editor.runwin)
                                editor.runwin.close();
                            editor.runwin = window.open("run.html?fstype=" + feng3d.assets.type + "&project=" + editor.editorcache.projectname);
                            return;
                        }
                        editor.fs.getAbsolutePath("index.html", function (err, path) {
                            if (err) {
                                feng3d.warn(err);
                                return;
                            }
                            if (editor.runwin)
                                editor.runwin.close();
                            editor.runwin = window.open(path);
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
            this.moveButton.selected = editor.mrsTool.toolType == editor.MRSToolType.MOVE;
            this.rotateButton.selected = editor.mrsTool.toolType == editor.MRSToolType.ROTATION;
            this.scaleButton.selected = editor.mrsTool.toolType == editor.MRSToolType.SCALE;
            this.worldButton.selected = editor.mrsTool.isWoldCoordinate;
            this.centerButton.selected = editor.mrsTool.isBaryCenter;
        };
        return TopView;
    }(eui.Component));
    editor.TopView = TopView;
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
     * 编辑器数据
     */
    var EditorData = /** @class */ (function () {
        function EditorData() {
        }
        /**
         * 选择对象
         * 该方法会处理 按ctrl键附加选中对象操作
         * @param objs 选中的对象
         */
        EditorData.prototype.selectObject = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i] = arguments[_i];
            }
            if (feng3d.shortcut.keyState.getKeyState("ctrl") && this.selectedObjects) {
                var oldobjs = this.selectedObjects.concat();
                if (objs) {
                    objs.forEach(function (obj) {
                        if (oldobjs.indexOf(obj) != -1)
                            oldobjs.splice(oldobjs.indexOf(obj), 1);
                        else
                            oldobjs.push(obj);
                    });
                }
                objs = oldobjs;
            }
            this.selectedObjects = objs;
        };
        Object.defineProperty(EditorData.prototype, "selectedGameObjects", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var result = [];
                if (this.selectedObjects) {
                    this.selectedObjects.forEach(function (element) {
                        if (element instanceof feng3d.GameObject)
                            result.push(element);
                    });
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "firstSelectedGameObject", {
            /**
             * 第一个选中游戏对象
             */
            get: function () {
                return this.selectedGameObjects[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "mrsTransforms", {
            /**
             * 获取 受 MRSTool 控制的Transform列表
             */
            get: function () {
                var transforms = this.selectedGameObjects.reduce(function (result, item) {
                    if (item.getComponent(feng3d.Scene3D))
                        return result;
                    if (item.getComponent(editor.GroundGrid))
                        return result;
                    if (item.getComponent(feng3d.SkinnedMeshRenderer))
                        return result;
                    result.push(item.transform);
                    return result;
                }, []);
                return transforms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorData.prototype, "selectedAssetsFile", {
            /**
             * 选中游戏对象列表
             */
            get: function () {
                var result = [];
                if (this.selectedObjects) {
                    this.selectedObjects.forEach(function (element) {
                        if (element instanceof editor.AssetsFile)
                            result.push(element);
                    });
                }
                return result;
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
            this._controllerToolTransfrom = feng3d.GameObject.create("controllerToolTransfrom").transform;
            feng3d.watcher.watch(editor.mrsTool, "isWoldCoordinate", this.updateControllerImage, this);
            feng3d.watcher.watch(editor.mrsTool, "isBaryCenter", this.updateControllerImage, this);
        }
        Object.defineProperty(MRSToolTarget.prototype, "showGameObject", {
            //
            get: function () {
                return this._showGameObject;
            },
            set: function (value) {
                if (this._showGameObject)
                    this._showGameObject.off("scenetransformChanged", this.onShowObjectTransformChanged, this);
                this._showGameObject = value;
                if (this._showGameObject)
                    this._showGameObject.on("scenetransformChanged", this.onShowObjectTransformChanged, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MRSToolTarget.prototype, "controllerTool", {
            get: function () {
                return this._controllerTool;
            },
            set: function (value) {
                this._controllerTool = value;
                if (this._controllerTool) {
                    this._controllerTool.position = this._controllerToolTransfrom.position;
                    this._controllerTool.rotation = this._controllerToolTransfrom.rotation;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MRSToolTarget.prototype, "controllerTargets", {
            set: function (value) {
                if (this._controllerTargets && this._controllerTargets.length > 0) {
                    this.showGameObject = null;
                }
                this._controllerTargets = value;
                if (this._controllerTargets && this._controllerTargets.length > 0) {
                    this.showGameObject = this._controllerTargets[0];
                    this.updateControllerImage();
                }
            },
            enumerable: true,
            configurable: true
        });
        MRSToolTarget.prototype.onShowObjectTransformChanged = function (event) {
            for (var i = 0; i < this._controllerTargets.length; i++) {
                if (this._controllerTargets[i] != this._showGameObject) {
                    this._controllerTargets[i].position = this._showGameObject.position;
                    this._controllerTargets[i].rotation = this._showGameObject.rotation;
                    this._controllerTargets[i].scale = this._showGameObject.scale;
                }
            }
            this.updateControllerImage();
        };
        MRSToolTarget.prototype.updateControllerImage = function () {
            if (!this._controllerTargets || this._controllerTargets.length == 0)
                return;
            var transform = this._controllerTargets[0];
            var position = new feng3d.Vector3();
            if (editor.mrsTool.isBaryCenter) {
                position.copy(transform.scenePosition);
            }
            else {
                for (var i = 0; i < this._controllerTargets.length; i++) {
                    position.add(this._controllerTargets[i].scenePosition);
                }
                position.scale(1 / this._controllerTargets.length);
            }
            var rotation = new feng3d.Vector3();
            if (!editor.mrsTool.isWoldCoordinate) {
                rotation = this._showGameObject.rotation;
            }
            this._controllerToolTransfrom.position = position;
            this._controllerToolTransfrom.rotation = rotation;
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
                this._startTransformDic.set(transform, getTransformData(transform));
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
                this._startTransformDic.set(transform, getTransformData(transform));
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
            if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                if (gameobject.parent)
                    localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(normal);
            }
            for (var i = 0; i < objects.length; i++) {
                gameobject = objects[i];
                var tempTransform = this._startTransformDic.get(gameobject);
                if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                    gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                }
                else {
                    localnormal = normal.clone();
                    if (gameobject.parent)
                        localnormal = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal);
                    if (editor.mrsTool.isBaryCenter) {
                        gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
                    }
                    else {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempTransform.position).appendRotation(localnormal, angle, localPivotPoint).position;
                        gameobject.rotation = rotateRotation(tempTransform.rotation, localnormal, angle);
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
            if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
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
                if (!editor.mrsTool.isWoldCoordinate && editor.mrsTool.isBaryCenter) {
                    tempRotation = rotateRotation(tempRotation, normal2, angle2);
                    gameobject.rotation = rotateRotation(tempRotation, normal1, angle1);
                }
                else {
                    var localnormal1 = normal1.clone();
                    var localnormal2 = normal2.clone();
                    if (gameobject.parent) {
                        localnormal1 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal1);
                        localnormal2 = gameobject.parent.worldToLocalMatrix.deltaTransformVector(localnormal2);
                    }
                    if (editor.mrsTool.isBaryCenter) {
                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
                    }
                    else {
                        var localPivotPoint = this._controllerToolTransfrom.position;
                        if (gameobject.parent)
                            localPivotPoint = gameobject.parent.worldToLocalMatrix.transformVector(localPivotPoint);
                        //
                        tempPosition = feng3d.Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        gameobject.position = feng3d.Matrix4x4.fromPosition(tempPosition).appendRotation(localnormal1, angle1, localPivotPoint).position;
                        tempRotation = rotateRotation(tempRotation, localnormal1, angle1);
                        gameobject.rotation = rotateRotation(tempRotation, localnormal2, angle2);
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
        return MRSToolTarget;
    }());
    editor.MRSToolTarget = MRSToolTarget;
    function getTransformData(transform) {
        return { position: transform.position.clone(), rotation: transform.rotation.clone(), scale: transform.scale.clone() };
    }
    function rotateRotation(rotation, axis, angle) {
        var rotationmatrix3d = new feng3d.Matrix4x4();
        rotationmatrix3d.appendRotation(feng3d.Vector3.X_AXIS, rotation.x);
        rotationmatrix3d.appendRotation(feng3d.Vector3.Y_AXIS, rotation.y);
        rotationmatrix3d.appendRotation(feng3d.Vector3.Z_AXIS, rotation.z);
        rotationmatrix3d.appendRotation(axis, angle);
        var newrotation = rotationmatrix3d.decompose()[1];
        newrotation.scale(180 / Math.PI);
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
    }
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
            this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.transform.rz = -90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateAxis);
            this.yAxis.color.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateAxis);
            this.zAxis.color.setTo(0, 0, 1, 1);
            this.zAxis.transform.rx = 90;
            this.gameObject.addChild(this.zAxis.gameObject);
            this.yzPlane = feng3d.GameObject.create("yzPlane").addComponent(CoordinatePlane);
            this.yzPlane.color.setTo(1, 0, 0, 0.2);
            this.yzPlane.selectedColor.setTo(1, 0, 0, 0.5);
            this.yzPlane.borderColor.setTo(1, 0, 0, 1);
            this.yzPlane.transform.rz = 90;
            this.gameObject.addChild(this.yzPlane.gameObject);
            this.xzPlane = feng3d.GameObject.create("xzPlane").addComponent(CoordinatePlane);
            this.xzPlane.color.setTo(0, 1, 0, 0.2);
            this.xzPlane.selectedColor.setTo(0, 1, 0, 0.5);
            this.xzPlane.borderColor.setTo(0, 1, 0, 1);
            this.gameObject.addChild(this.xzPlane.gameObject);
            this.xyPlane = feng3d.GameObject.create("xyPlane").addComponent(CoordinatePlane);
            this.xyPlane.color.setTo(0, 0, 1, 0.2);
            this.xyPlane.selectedColor.setTo(0, 0, 1, 0.5);
            this.xyPlane.borderColor.setTo(0, 0, 1, 1);
            this.xyPlane.transform.rx = -90;
            this.gameObject.addChild(this.xyPlane.gameObject);
            this.oCube = feng3d.GameObject.create("oCube").addComponent(CoordinateCube);
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
            var xLine = feng3d.GameObject.create();
            var meshRenderer = xLine.addComponent(feng3d.MeshRenderer);
            var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: new feng3d.Vector3(0, this.length, 0) });
            this.segmentMaterial = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES, enableBlend: true } });
            this.gameObject.addChild(xLine);
            //
            this.xArrow = feng3d.GameObject.create();
            meshRenderer = this.xArrow.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.ConeGeometry({ bottomRadius: 5, height: 18 });
            this.material = meshRenderer.material = feng3d.materialFactory.create("color");
            this.material.renderParams.enableBlend = true;
            this.xArrow.transform.y = this.length;
            this.xArrow.mouselayer = feng3d.mouselayer.editor;
            this.gameObject.addChild(this.xArrow);
            var mouseHit = feng3d.GameObject.create("hitCoordinateAxis");
            meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length });
            //meshRenderer.material = materialFactory.create("color");
            mouseHit.transform.y = 20 + (this.length - 20) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            mouseHit.mouselayer = feng3d.mouselayer.editor;
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
            this.oCube = feng3d.GameObject.create();
            var meshRenderer = this.oCube.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.CubeGeometry({ width: 8, height: 8, depth: 8 });
            this.colorMaterial = meshRenderer.material = feng3d.materialFactory.create("color");
            this.colorMaterial.renderParams.enableBlend = true;
            this.oCube.mouseEnabled = true;
            this.oCube.mouselayer = feng3d.mouselayer.editor;
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
            var plane = feng3d.GameObject.create("plane");
            var meshRenderer = plane.addComponent(feng3d.MeshRenderer);
            plane.transform.x = plane.transform.z = this._width / 2;
            meshRenderer.geometry = new feng3d.PlaneGeometry({ width: this._width, height: this._width });
            this.colorMaterial = meshRenderer.material = feng3d.materialFactory.create("color");
            this.colorMaterial.renderParams.cullFace = feng3d.CullFace.NONE;
            this.colorMaterial.renderParams.enableBlend = true;
            plane.mouselayer = feng3d.mouselayer.editor;
            plane.mouseEnabled = true;
            this.gameObject.addChild(plane);
            var border = feng3d.GameObject.create("border");
            meshRenderer = border.addComponent(feng3d.MeshRenderer);
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
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
            this.xAxis = feng3d.GameObject.create("xAxis").addComponent(CoordinateRotationAxis);
            this.xAxis.color.setTo(1, 0, 0, 1);
            this.xAxis.update();
            this.xAxis.transform.ry = 90;
            this.gameObject.addChild(this.xAxis.gameObject);
            this.yAxis = feng3d.GameObject.create("yAxis").addComponent(CoordinateRotationAxis);
            this.yAxis.color.setTo(0, 1, 0);
            this.yAxis.update();
            this.yAxis.transform.rx = 90;
            this.gameObject.addChild(this.yAxis.gameObject);
            this.zAxis = feng3d.GameObject.create("zAxis").addComponent(CoordinateRotationAxis);
            this.zAxis.color.setTo(0, 0, 1);
            this.zAxis.update();
            this.gameObject.addChild(this.zAxis.gameObject);
            this.cameraAxis = feng3d.GameObject.create("cameraAxis").addComponent(CoordinateRotationAxis);
            this.cameraAxis.radius = 88;
            this.cameraAxis.color.setTo(1, 1, 1);
            this.cameraAxis.update();
            this.gameObject.addChild(this.cameraAxis.gameObject);
            this.freeAxis = feng3d.GameObject.create("freeAxis").addComponent(CoordinateRotationFreeAxis);
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
            var border = feng3d.GameObject.create();
            var meshRenderer = border.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = feng3d.GameObject.create("sector").addComponent(SectorGameObject);
            var mouseHit = feng3d.GameObject.create("hit");
            meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
            this.torusGeometry = meshRenderer.geometry = new feng3d.TorusGeometry({ radius: this.radius, tubeRadius: 2 });
            meshRenderer.material = feng3d.materialFactory.create("standard");
            mouseHit.transform.rx = 90;
            mouseHit.visible = false;
            mouseHit.mouselayer = feng3d.mouselayer.editor;
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
                points[i].scale(this.radius);
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
            var meshRenderer = this.gameObject.addComponent(feng3d.MeshRenderer);
            this.geometry = meshRenderer.geometry = new feng3d.CustomGeometry();
            meshRenderer.material = feng3d.materialFactory.create("color", { uniforms: { u_diffuseInput: new feng3d.Color4(0.5, 0.5, 0.5, 0.2) } });
            meshRenderer.material.renderParams.enableBlend = true;
            meshRenderer.material.renderParams.cullFace = feng3d.CullFace.NONE;
            var border = feng3d.GameObject.create("border");
            meshRenderer = border.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
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
            var border = feng3d.GameObject.create("border");
            var meshRenderer = border.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(border);
            this.sector = feng3d.GameObject.create("sector").addComponent(SectorGameObject);
            this.sector.update(0, 360);
            this.sector.gameObject.visible = false;
            this.sector.gameObject.mouseEnabled = true;
            this.sector.gameObject.mouselayer = feng3d.mouselayer.editor;
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
                points[i].scale(this.radius);
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
            this.xCube = feng3d.GameObject.create("xCube").addComponent(CoordinateScaleCube);
            this.xCube.color.setTo(1, 0, 0, 1);
            this.xCube.update();
            this.xCube.transform.rz = -90;
            this.gameObject.addChild(this.xCube.gameObject);
            this.yCube = feng3d.GameObject.create("yCube").addComponent(CoordinateScaleCube);
            this.yCube.color.setTo(0, 1, 0, 1);
            this.yCube.update();
            this.gameObject.addChild(this.yCube.gameObject);
            this.zCube = feng3d.GameObject.create("zCube").addComponent(CoordinateScaleCube);
            this.zCube.color.setTo(0, 0, 1, 1);
            this.zCube.update();
            this.zCube.transform.rx = 90;
            this.gameObject.addChild(this.zCube.gameObject);
            this.oCube = feng3d.GameObject.create("oCube").addComponent(editor.CoordinateCube);
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
            var xLine = feng3d.GameObject.create();
            var meshRenderer = xLine.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.99);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(xLine);
            this.coordinateCube = feng3d.GameObject.create("coordinateCube").addComponent(editor.CoordinateCube);
            this.gameObject.addChild(this.coordinateCube.gameObject);
            var mouseHit = feng3d.GameObject.create("hit");
            meshRenderer = mouseHit.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.CylinderGeometry({ topRadius: 5, bottomRadius: 5, height: this.length - 4 });
            mouseHit.transform.y = 4 + (this.length - 4) / 2;
            mouseHit.visible = false;
            mouseHit.mouseEnabled = true;
            mouseHit.mouselayer = feng3d.mouselayer.editor;
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
            this._gameobjectControllerTarget.controllerTool = this.transform;
            //
            feng3d.windowEventProxy.on("mousedown", this.onMouseDown, this);
            feng3d.windowEventProxy.on("mouseup", this.onMouseUp, this);
            feng3d.ticker.onframe(this.updateToolModel, this);
        };
        MRSToolBase.prototype.onRemovedFromScene = function () {
            this._gameobjectControllerTarget.controllerTool = null;
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
        Object.defineProperty(MRSToolBase.prototype, "gameobjectControllerTarget", {
            get: function () {
                return this._gameobjectControllerTarget;
            },
            set: function (value) {
                this._gameobjectControllerTarget = value;
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
            this.toolModel = feng3d.GameObject.create().addComponent(editor.MToolModel);
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
            this.gameobjectControllerTarget.startTranslation();
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
            this.gameobjectControllerTarget.translation(sceneAddpos);
        };
        MTool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            this.gameobjectControllerTarget.stopTranslation();
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
            this.toolModel = feng3d.GameObject.create().addComponent(editor.RToolModel);
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
            this.gameobjectControllerTarget.startRotate();
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
                    this.gameobjectControllerTarget.rotate1(angle, this.movePlane3D.getNormal());
                    this.stepPlaneCross.copy(planeCross);
                    this.gameobjectControllerTarget.startRotate();
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
                    this.gameobjectControllerTarget.rotate2(-offset.y, right, -offset.x, up);
                    //
                    this.startMousePos = endPoint;
                    this.gameobjectControllerTarget.startRotate();
                    break;
            }
        };
        RTool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            if (this.selectedItem instanceof editor.CoordinateRotationAxis) {
                this.selectedItem.hideSector();
            }
            this.gameobjectControllerTarget.stopRote();
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
            rotation.scale(feng3d.FMath.RAD2DEG);
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
            this.toolModel = feng3d.GameObject.create().addComponent(editor.SToolModel);
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
            this.gameobjectControllerTarget.startScale();
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
            this.gameobjectControllerTarget.doScale(addScale);
            //
            this.toolModel.xCube.scaleValue = addScale.x;
            this.toolModel.yCube.scaleValue = addScale.y;
            this.toolModel.zCube.scaleValue = addScale.z;
        };
        STool.prototype.onMouseUp = function () {
            _super.prototype.onMouseUp.call(this);
            feng3d.windowEventProxy.off("mousemove", this.onMouseMove, this);
            this.gameobjectControllerTarget.stopScale();
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
     * 控制器数据
     */
    var MRSToolData = /** @class */ (function () {
        function MRSToolData() {
            /**
             * 使用的控制工具类型
             */
            this.toolType = MRSToolType.MOVE;
            /**
             * 是否使用世界坐标
             */
            this.isWoldCoordinate = false;
            /**
             * 坐标原点是否在质心
             */
            this.isBaryCenter = true;
        }
        return MRSToolData;
    }());
    editor.MRSToolData = MRSToolData;
    /**
     * 控制器数据
     */
    editor.mrsTool = new MRSToolData();
    /**
     * 设置永久可见
     */
    function setAwaysVisible(component) {
        var meshRenderers = component.getComponentsInChildren(feng3d.MeshRenderer);
        meshRenderers.forEach(function (element) {
            if (element.material) {
                // element.material.depthMask = false;
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
            var mrsToolObject = feng3d.GameObject.create("MRSTool");
            mrsToolObject.serializable = false;
            mrsToolObject.showinHierarchy = false;
            this.mrsToolObject = editor.editorData.mrsToolObject = mrsToolObject;
            this.controllerTarget = new editor.MRSToolTarget();
            this.mTool = feng3d.GameObject.create("MTool").addComponent(editor.MTool);
            this.rTool = feng3d.GameObject.create("RTool").addComponent(editor.RTool);
            this.sTool = feng3d.GameObject.create("STool").addComponent(editor.STool);
            setAwaysVisible(this.mTool);
            setAwaysVisible(this.rTool);
            setAwaysVisible(this.sTool);
            this.mTool.gameobjectControllerTarget = this.controllerTarget;
            this.rTool.gameobjectControllerTarget = this.controllerTarget;
            this.sTool.gameobjectControllerTarget = this.controllerTarget;
            //
            this.currentTool = this.mTool;
            //
            feng3d.watcher.watch(editor.editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
            feng3d.watcher.watch(editor.mrsTool, "toolType", this.onToolTypeChange, this);
        };
        MRSTool.prototype.dispose = function () {
            //
            this.currentTool = null;
            //
            this.mrsToolObject.dispose();
            this.mrsToolObject = null;
            editor.editorData.mrsToolObject = null;
            //
            this.controllerTarget = null;
            this.mTool.dispose();
            this.mTool = null;
            this.rTool.dispose();
            this.rTool = null;
            this.sTool.dispose();
            this.sTool = null;
            //
            feng3d.watcher.unwatch(editor.editorData, "selectedObjects", this.onSelectedGameObjectChange, this);
            feng3d.watcher.unwatch(editor.mrsTool, "toolType", this.onToolTypeChange, this);
            _super.prototype.dispose.call(this);
        };
        MRSTool.prototype.onSelectedGameObjectChange = function () {
            //筛选出 工具控制的对象
            var transforms = editor.editorData.mrsTransforms;
            if (transforms.length > 0) {
                this.controllerTarget.controllerTargets = transforms;
                this.gameObject.addChild(this.mrsToolObject);
            }
            else {
                this.controllerTarget.controllerTargets = null;
                this.mrsToolObject.remove();
            }
        };
        MRSTool.prototype.onToolTypeChange = function () {
            switch (editor.mrsTool.toolType) {
                case MRSToolType.MOVE:
                    this.currentTool = this.mTool;
                    break;
                case MRSToolType.ROTATION:
                    this.currentTool = this.rTool;
                    break;
                case MRSToolType.SCALE:
                    this.currentTool = this.sTool;
                    break;
            }
        };
        Object.defineProperty(MRSTool.prototype, "currentTool", {
            set: function (value) {
                if (this._currentTool == value)
                    return;
                if (this._currentTool) {
                    this.mrsToolObject.removeChild(this._currentTool.gameObject);
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
             * 父节点
             */
            _this.parent = null;
            /**
             * 子节点列表
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
    var nodeMap = new Map();
    /**
     * 层级树
     */
    var HierarchyTree = /** @class */ (function (_super) {
        __extends(HierarchyTree, _super);
        function HierarchyTree() {
            var _this = _super.call(this) || this;
            _this.selectedGameObjects = [];
            feng3d.watcher.watch(editor.editorData, "selectedObjects", _this.onSelectedGameObjectChanged, _this);
            return _this;
        }
        /**
         * 获取选中节点
         */
        HierarchyTree.prototype.getSelectedNode = function () {
            for (var i = 0; i < editor.editorData.selectedGameObjects.length; i++) {
                var node = this.getNode(editor.editorData.selectedGameObjects[i]);
                if (node)
                    return node;
            }
            return null;
        };
        HierarchyTree.prototype.init = function (gameobject) {
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
        HierarchyTree.prototype.delete = function (gameobject) {
            var node = nodeMap.get(gameobject);
            if (node) {
                this.destroy(node);
                nodeMap.delete(gameobject);
            }
        };
        HierarchyTree.prototype.add = function (gameobject) {
            var _this = this;
            if (!gameobject.showinHierarchy)
                return;
            var node = nodeMap.get(gameobject);
            if (node) {
                this.removeNode(node);
            }
            var parentnode = nodeMap.get(gameobject.parent);
            if (parentnode) {
                if (!node) {
                    node = new editor.HierarchyNode({ gameobject: gameobject });
                    nodeMap.set(gameobject, node);
                }
                this.addNode(node, parentnode);
            }
            gameobject.children.forEach(function (element) {
                _this.add(element);
            });
            return node;
        };
        HierarchyTree.prototype.remove = function (gameobject) {
            var _this = this;
            var node = nodeMap.get(gameobject);
            if (node) {
                this.removeNode(node);
            }
            gameobject.children.forEach(function (element) {
                _this.remove(element);
            });
        };
        /**
         * 获取节点
         */
        HierarchyTree.prototype.getNode = function (gameObject) {
            var node = nodeMap.get(gameObject);
            return node;
        };
        HierarchyTree.prototype.onSelectedGameObjectChanged = function () {
            var _this = this;
            this.selectedGameObjects.forEach(function (element) {
                //清除选中效果
                var wireframeComponent = element.getComponent(feng3d.WireframeComponent);
                if (wireframeComponent)
                    element.removeComponent(wireframeComponent);
                var node = _this.getNode(element);
                if (!node) {
                    // 为什么为空，是否被允许？
                    debugger;
                }
                node.selected = false;
            });
            this.selectedGameObjects = editor.editorData.selectedGameObjects;
            this.selectedGameObjects.forEach(function (element) {
                //新增选中效果
                var wireframeComponent = element.getComponent(feng3d.WireframeComponent);
                if (!wireframeComponent)
                    element.addComponent(feng3d.WireframeComponent);
                _this.getNode(element).selected = true;
            });
        };
        return HierarchyTree;
    }(editor.Tree));
    editor.HierarchyTree = HierarchyTree;
    editor.hierarchyTree = new HierarchyTree();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var Hierarchy = /** @class */ (function () {
        function Hierarchy() {
        }
        Object.defineProperty(Hierarchy.prototype, "rootGameObject", {
            get: function () {
                return this._rootGameObject;
            },
            set: function (value) {
                if (this._rootGameObject) {
                    this._rootGameObject.off("added", this.ongameobjectadded, this);
                    this._rootGameObject.off("removed", this.ongameobjectremoved, this);
                }
                this._rootGameObject = value;
                if (this._rootGameObject) {
                    editor.hierarchyTree.init(this._rootGameObject);
                    this._rootGameObject.on("added", this.ongameobjectadded, this);
                    this._rootGameObject.on("removed", this.ongameobjectremoved, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Hierarchy.prototype.ongameobjectadded = function (event) {
            editor.hierarchyTree.add(event.data);
        };
        Hierarchy.prototype.ongameobjectremoved = function (event) {
            editor.hierarchyTree.remove(event.data);
        };
        Hierarchy.prototype.addGameoObjectFromAsset = function (path, parent) {
            editor.fs.readFileAsString(path, function (err, content) {
                var json = JSON.parse(content);
                var gameobject = feng3d.serialization.deserialize(json);
                gameobject.name = path.split("/").pop().split(".").shift();
                if (parent)
                    parent.addChild(gameobject);
                else
                    editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
                editor.editorData.selectObject(gameobject);
            });
        };
        return Hierarchy;
    }());
    editor.Hierarchy = Hierarchy;
    editor.hierarchy = new Hierarchy();
})(editor || (editor = {}));
var editor;
(function (editor) {
    var SceneRotateTool = /** @class */ (function (_super) {
        __extends(SceneRotateTool, _super);
        function SceneRotateTool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.showInInspector = false;
            _this.serializable = false;
            return _this;
        }
        SceneRotateTool.prototype.init = function (gameObject) {
            var _this = this;
            _super.prototype.init.call(this, gameObject);
            var thisObj = this;
            feng3d.Loader.loadText(editor.editorData.getEditorAssetsPath("gameobjects/SceneRotateTool.gameobject.json"), function (content) {
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
                var rotation = editor.editorCamera.transform.localToWorldMatrix.clone().invert().decompose()[1].scale(180 / Math.PI);
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
                    var cameraTargetMatrix3D = feng3d.Matrix4x4.fromRotation(rotation);
                    cameraTargetMatrix3D.invert();
                    var result = cameraTargetMatrix3D.decompose()[1];
                    result.scale(180 / Math.PI);
                    editor.editorDispatcher.dispatch("editorCameraRotate", result);
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
     * @author feng 2016-10-29
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
            var groundGridObject = feng3d.GameObject.create("GroundGrid");
            groundGridObject.mouseEnabled = false;
            groundGridObject.transform.showInInspector = false;
            gameObject.addChild(groundGridObject);
            var __this = this;
            editor.editorCamera.transform.on("transformChanged", update, this);
            var meshRenderer = groundGridObject.addComponent(feng3d.MeshRenderer);
            var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
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
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(EditorEngine.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            set: function (value) {
                if (this._scene) {
                    this._scene.updateScriptFlag = feng3d.ScriptFlag.feng3d;
                }
                this._scene = value;
                if (this._scene) {
                    this._scene.updateScriptFlag = feng3d.ScriptFlag.editor;
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
            _super.prototype.render.call(this);
            editor.editorScene.update();
            feng3d.forwardRenderer.draw(this.gl, editor.editorScene, this.camera);
            var selectedObject = this.mouse3DManager.pick(editor.editorScene, this.camera);
            if (selectedObject)
                this.selectedObject = selectedObject;
        };
        return EditorEngine;
    }(feng3d.Engine));
    editor.EditorEngine = EditorEngine;
    /**
    * 编辑器3D入口
    * @author feng 2016-10-29
    */
    var Main3D = /** @class */ (function () {
        function Main3D() {
            this.init();
        }
        Main3D.prototype.init = function () {
            //
            editor.editorCamera = feng3d.GameObject.create("editorCamera").addComponent(feng3d.Camera);
            editor.editorCamera.transform.x = 5;
            editor.editorCamera.transform.y = 3;
            editor.editorCamera.transform.z = 5;
            editor.editorCamera.transform.lookAt(new feng3d.Vector3());
            //
            editor.editorCamera.gameObject.addComponent(feng3d.FPSController).auto = false;
            //
            editor.editorScene = feng3d.GameObject.create("scene").addComponent(feng3d.Scene3D);
            editor.editorScene.updateScriptFlag = feng3d.ScriptFlag.all;
            //
            editor.editorScene.gameObject.addComponent(editor.SceneRotateTool);
            //
            //初始化模块
            editor.editorScene.gameObject.addComponent(editor.GroundGrid);
            editor.editorScene.gameObject.addComponent(editor.MRSTool);
            editor.editorComponent = editor.editorScene.gameObject.addComponent(editor.EditorComponent);
            feng3d.Loader.loadText(editor.editorData.getEditorAssetsPath("gameobjects/Trident.gameobject.json"), function (content) {
                var trident = feng3d.serialization.deserialize(JSON.parse(content));
                editor.editorScene.gameObject.addChild(trident);
            });
            //
            editor.editorDispatcher.on("editorCameraRotate", this.onEditorCameraRotate, this);
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
                editor.editorAssets.saveScene("default.scene.json", editor.engine.scene);
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
            var rotateCenter = camera.transform.scenePosition.addTo(forward.scale(lookDistance));
            //计算目标四元素旋转
            var targetQuat = new feng3d.Quaternion();
            resultRotation.scale(feng3d.FMath.DEG2RAD);
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
                    translation.scale(lookDistance);
                    camera.transform.position = rotateCenter.addTo(translation);
                },
            }).to({ rate: 1 }, 300, egret.Ease.sineIn);
        };
        return Main3D;
    }());
    editor.Main3D = Main3D;
    function creatNewScene() {
        var scene = feng3d.GameObject.create("Untitled").addComponent(feng3d.Scene3D);
        scene.background.setTo(0.408, 0.38, 0.357);
        scene.ambientColor.setTo(0.4, 0.4, 0.4);
        var camera = feng3d.gameObjectFactory.createCamera("Main Camera");
        camera.addComponent(feng3d.AudioListener);
        camera.transform.position = new feng3d.Vector3(0, 1, -10);
        scene.gameObject.addChild(camera);
        var directionalLight = feng3d.GameObject.create("DirectionalLight");
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
            return _this;
        }
        Object.defineProperty(EditorComponent.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            set: function (v) {
                var _this = this;
                if (this._scene) {
                    this.scene.off("addComponentToScene", this.onAddComponentToScene, this);
                    this.scene.off("removeComponentFromScene", this.onRemoveComponentFromScene, this);
                    var lights = this.scene.getComponentsInChildren(feng3d.Light);
                    lights.forEach(function (element) {
                        _this.removeLightIcon(element);
                    });
                }
                this._scene = v;
                if (this._scene) {
                    var lights = this.scene.getComponentsInChildren(feng3d.Light);
                    lights.forEach(function (element) {
                        _this.addLightIcon(element);
                    });
                    this.scene.on("addComponentToScene", this.onAddComponentToScene, this);
                    this.scene.on("removeComponentFromScene", this.onRemoveComponentFromScene, this);
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
        EditorComponent.prototype.onAddComponentToScene = function (event) {
            this.addLightIcon(event.data);
        };
        EditorComponent.prototype.onRemoveComponentFromScene = function (event) {
            this.removeLightIcon(event.data);
        };
        EditorComponent.prototype.addLightIcon = function (light) {
            if (light instanceof feng3d.DirectionalLight) {
                var directionLightIcon = feng3d.GameObject.create("DirectionLightIcon").addComponent(editor.DirectionLightIcon);
                directionLightIcon.light = light;
                this.gameObject.addChild(directionLightIcon.gameObject);
                this.directionLightIconMap.set(light, directionLightIcon);
            }
            else if (light instanceof feng3d.PointLight) {
                var pointLightIcon = feng3d.GameObject.create("PointLightIcon").addComponent(editor.PointLightIcon);
                pointLightIcon.light = light;
                this.gameObject.addChild(pointLightIcon.gameObject);
                this.pointLightIconMap.set(light, pointLightIcon);
            }
            else if (light instanceof feng3d.SpotLight) {
                var spotLightIcon = feng3d.GameObject.create("SpotLightIcon").addComponent(editor.SpotLightIcon);
                spotLightIcon.light = light;
                this.gameObject.addChild(spotLightIcon.gameObject);
                this.spotLightIconMap.set(light, spotLightIcon);
            }
        };
        EditorComponent.prototype.removeLightIcon = function (light) {
            if (light instanceof feng3d.DirectionalLight) {
                var directionLightIcon = this.directionLightIconMap.get(light);
                directionLightIcon.light = null;
                directionLightIcon.gameObject.remove();
                this.directionLightIconMap.delete(light);
            }
            else if (light instanceof feng3d.PointLight) {
                var pointLightIcon = this.pointLightIconMap.get(light);
                pointLightIcon.light = null;
                pointLightIcon.gameObject.remove();
                this.pointLightIconMap.delete(light);
            }
            else if (light instanceof feng3d.SpotLight) {
                var spotLightIcon = this.spotLightIconMap.get(light);
                spotLightIcon.light = null;
                spotLightIcon.gameObject.remove();
                this.spotLightIconMap.delete(light);
            }
        };
        return EditorComponent;
    }(feng3d.Component));
    editor.EditorComponent = EditorComponent;
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * 导航组件，提供生成导航网格功能
     */
    var Navigation = /** @class */ (function (_super) {
        __extends(Navigation, _super);
        function Navigation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 距离边缘半径
             */
            _this.agentRadius = 0.5;
            /**
             * 允许行走高度
             */
            _this.agentHeight = 2;
            /**
             * 允许行走坡度
             */
            _this.maxSlope = 45; //[0,60]
            return _this;
        }
        Navigation.prototype.init = function (gameobject) {
            _super.prototype.init.call(this, gameobject);
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
            var geometrys = getNavGeometry(this.gameObject.scene.gameObject);
            if (geometrys.length == 0) {
                this._navobject && this._navobject.remove();
                return;
            }
            var geometry = mergeGeometry(geometrys);
            //
            var geometrydata = getGeometryData(geometry);
            var process = new navigation.NavigationProcess(geometrydata);
            //
            process.checkMaxSlope(this.maxSlope);
            process.checkAgentRadius(this.agentRadius);
            process.checkAgentHeight(this.agentHeight);
            //
            geometrydata = process.getGeometry();
            if (geometrydata.indices.length == 0) {
                this._navobject && this._navobject.remove();
                return;
            }
            //
            var navobject = this._navobject = this._navobject || createNavObject();
            navobject.getComponent(feng3d.MeshRenderer).geometry = getGeometry(geometrydata);
            var parentobject = this.gameObject.scene.gameObject.find("editorObject") || this.gameObject.scene.gameObject;
            parentobject.addChild(navobject);
            function getGeometry(geometrydata) {
                var customGeometry = new feng3d.CustomGeometry();
                customGeometry.positions = geometrydata.positions;
                customGeometry.indices = geometrydata.indices;
                return customGeometry;
            }
            function getGeometryData(geometry) {
                var positions = [];
                var indices = [];
                positions.push.apply(positions, geometry.positions);
                indices.push.apply(indices, geometry.indices);
                return { positions: positions, indices: indices };
            }
            function createNavObject() {
                var navobject = feng3d.GameObject.create("navigation");
                navobject.mouseEnabled = false;
                navobject.addComponent(feng3d.MeshRenderer).set(function (space) {
                    space.geometry = new feng3d.CustomGeometry();
                    space.material = feng3d.materialFactory.create("color", { uniforms: { u_diffuseInput: new feng3d.Color4(0, 1, 0, 0.5) } });
                });
                navobject.transform.y = 0.01;
                return navobject;
            }
            function mergeGeometry(geometrys) {
                var customGeometry = new feng3d.CustomGeometry();
                geometrys.forEach(function (element) {
                    customGeometry.addGeometry(element);
                });
                return customGeometry;
            }
            function getNavGeometry(gameobject, geometrys) {
                geometrys = geometrys || [];
                if (!gameobject.visible)
                    return geometrys;
                var meshRenderer = gameobject.getComponent(feng3d.MeshRenderer);
                var geometry = meshRenderer && meshRenderer.geometry;
                if (geometry && gameobject.navigationArea != -1) {
                    var matrix3d = gameobject.transform.localToWorldMatrix;
                    var positions = Array.apply(null, geometry.positions);
                    matrix3d.transformVectors(positions, positions);
                    var indices = Array.apply(null, geometry.indices);
                    //
                    var customGeometry = new feng3d.CustomGeometry();
                    customGeometry.positions = positions;
                    customGeometry.indices = indices;
                    geometrys.push(customGeometry);
                }
                gameobject.children.forEach(function (element) {
                    getNavGeometry(element, geometrys);
                });
                return geometrys;
            }
        };
        __decorate([
            feng3d.oav()
        ], Navigation.prototype, "agentRadius", void 0);
        __decorate([
            feng3d.oav()
        ], Navigation.prototype, "agentHeight", void 0);
        __decorate([
            feng3d.oav()
        ], Navigation.prototype, "maxSlope", void 0);
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
            this.normal.scale(-1);
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
     * 节点
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
         * 构建树节点
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
                        if (ld < agentRadius) {
                            point.setPoint(lp);
                        }
                        else if (rd < agentRadius) {
                            point.setPoint(rp);
                        }
                        else {
                            point.setPoint(point.getPoint().addTo(line0.direction.clone().scale(agentRadius - cd)));
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
                    point.setPoint(point.getPoint().addTo(crossline0s[0][0].direction.clone().scale(agentRadius - crossline0s[0][1])));
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
                        var targetPoint = cross.addTo(djx.clone().scale(length));
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
                var p0 = element.segment.p0.addTo(element.segment.p1).scale(0.5);
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
        debugSegment = feng3d.GameObject.create("segment");
        debugSegment.mouseEnabled = false;
        //初始化材质
        var meshRenderer = debugSegment.addComponent(feng3d.MeshRenderer);
        var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
        material.uniforms.u_segmentColor.setTo(1.0, 0, 0);
        segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
    }
    parentobject.addChild(debugSegment);
    //
    if (!debugPoint) {
        debugPoint = feng3d.GameObject.create("points");
        debugPoint.mouseEnabled = false;
        var meshRenderer = debugPoint.addComponent(feng3d.MeshRenderer);
        pointGeometry = meshRenderer.geometry = new feng3d.PointGeometry();
        var materialp = meshRenderer.material = feng3d.materialFactory.create("point", { renderParams: { renderMode: feng3d.RenderMode.POINTS } });
        materialp.uniforms.u_PointSize = 5;
        materialp.uniforms.u_color.setTo(0, 0, 0);
    }
    pointGeometry.points = [];
    parentobject.addChild(debugPoint);
}
var egret;
(function (egret) {
    (function () {
        document.body.oncontextmenu = function () { return false; };
        //给反射添加查找的空间
        feng3d.classUtils.addClassNameSpace("feng3d.editor");
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
    (function () {
        // 扩展 TextInput , 焦点在文本中时，延缓外部通过text属性赋值到失去焦点时生效
        var descriptor = Object.getOwnPropertyDescriptor(eui.TextInput.prototype, "text");
        var oldTextSet = descriptor.set;
        descriptor.set = function (value) {
            if (this["isFocus"]) {
                this["__temp_value__"] = value;
            }
            else {
                oldTextSet.call(this, value);
            }
        };
        Object.defineProperty(eui.TextInput.prototype, "text", descriptor);
        var oldFocusOutHandler = eui.TextInput.prototype["focusOutHandler"];
        eui.TextInput.prototype["focusOutHandler"] = function (event) {
            oldFocusOutHandler.call(this, event);
            if (this["__temp_value__"] != undefined) {
                this["text"] = this["__temp_value__"];
                delete this["__temp_value__"];
            }
        };
    })();
    egret.MouseEvent = egret.TouchEvent;
    (function () {
        //映射事件名称
        egret.MouseEvent.MOUSE_DOWN = egret.TouchEvent.TOUCH_BEGIN;
        egret.MouseEvent.MOUSE_UP = egret.TouchEvent.TOUCH_END;
        egret.MouseEvent.MOUSE_MOVE = egret.TouchEvent.TOUCH_MOVE;
        egret.MouseEvent.CLICK = egret.TouchEvent.TOUCH_TAP;
        egret.MouseEvent.MOUSE_OUT = "mouseout";
        egret.MouseEvent.RIGHT_CLICK = "rightclick";
        egret.MouseEvent.DOUBLE_CLICK = "dblclick";
        //
        //解决TextInput.text绑定Number是不显示0的bug
        var p = egret.DisplayObject.prototype;
        var old = p.dispatchEvent;
        p.dispatchEvent = function (event) {
            if (event.type == egret.MouseEvent.MOUSE_OVER) {
                //鼠标已经在对象上时停止over冒泡
                if (this.isMouseOver) {
                    event.stopPropagation();
                    return true;
                }
                this.isMouseOver = true;
            }
            if (event.type == egret.MouseEvent.MOUSE_OUT) {
                //如果再次mouseover的对象是该对象的子对象时停止out事件冒泡
                var displayObject = overDisplayObject;
                while (displayObject) {
                    if (this == displayObject) {
                        event.stopPropagation();
                        return true;
                    }
                    displayObject = displayObject.parent;
                }
                this.isMouseOver = false;
            }
            return old.call(this, event);
        };
    })();
    var overDisplayObject;
    egret.mouseEventEnvironment = function () {
        var webTouchHandler;
        var canvas;
        var touch;
        var rightmousedownObject;
        webTouchHandler = getWebTouchHandler();
        canvas = webTouchHandler.canvas;
        touch = webTouchHandler.touch;
        webTouchHandler.canvas.addEventListener("mousemove", onMouseMove);
        feng3d.windowEventProxy.on("mousedown", function (e) {
            //右键按下
            if (e.button != 2)
                return;
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            rightmousedownObject = touch["findTarget"](x, y);
        });
        feng3d.windowEventProxy.on("mouseup", function (e) {
            //右键按下
            if (e.button != 2)
                return;
            var location = webTouchHandler.getLocation(e);
            var x = location.x;
            var y = location.y;
            var target = touch["findTarget"](x, y);
            if (target == rightmousedownObject) {
                egret.TouchEvent.dispatchTouchEvent(target, egret.MouseEvent.RIGHT_CLICK, true, true, x, y);
                rightmousedownObject = null;
            }
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
    // 扩展 Scroller 组件，添加鼠标滚轮事件
    (function () {
        var oldOnAddToStage = eui.Scroller.prototype.$onAddToStage;
        eui.Scroller.prototype.$onAddToStage = function (stage, nestLevel) {
            oldOnAddToStage.call(this, stage, nestLevel);
            feng3d.windowEventProxy.on("mousewheel", onMouseWheel, this);
        };
        var oldOnRemoveFromStage = eui.Scroller.prototype.$onRemoveFromStage;
        eui.Scroller.prototype.$onRemoveFromStage = function () {
            oldOnRemoveFromStage.call(this);
            feng3d.windowEventProxy.off("mousewheel", onMouseWheel, this);
        };
        function onMouseWheel(event) {
            var scroller = this;
            if (scroller.hitTestPoint(feng3d.windowEventProxy.clientX, feng3d.windowEventProxy.clientY)) {
                scroller.viewport.scrollV = feng3d.FMath.clamp(scroller.viewport.scrollV - event.wheelDelta * 0.3, 0, scroller.viewport.contentHeight - scroller.height);
            }
        }
    })();
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
            _this.flag = feng3d.ScriptFlag.editor;
            return _this;
        }
        return EditorScript;
    }(feng3d.ScriptComponent));
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
            var gameobject = feng3d.GameObject.create("test");
            var meshRenderer = gameobject.addComponent(feng3d.MeshRenderer);
            meshRenderer.material = feng3d.materialFactory.create("standard");
            meshRenderer.geometry = new feng3d.SphereGeometry({ radius: 10 });
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
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(DirectionLightIcon.prototype, "light", {
            get: function () {
                return this._light;
            },
            set: function (v) {
                if (this._light) {
                    this._light.off("scenetransformChanged", this.onScenetransformChanged, this);
                }
                this._light = v;
                if (this._light) {
                    this.onScenetransformChanged();
                    this._light.on("scenetransformChanged", this.onScenetransformChanged, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        DirectionLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        DirectionLightIcon.prototype.initicon = function () {
            var linesize = 10;
            var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = editor.editorCamera;
            var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.PlaneGeometry({ width: 1, height: 1, segmentsH: 1, segmentsW: 1, yUp: false });
            var textureMaterial = this.textureMaterial = meshRenderer.material = feng3d.materialFactory.create("texture");
            var texture = new feng3d.UrlImageTexture2D();
            texture.url = editor.editorData.getEditorAssetsPath("assets/3d/icons/sun.png");
            texture.format = feng3d.TextureFormat.RGBA;
            texture.premulAlpha = true;
            textureMaterial.uniforms.s_texture = texture;
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var holdSizeComponent = lightLines.addComponent(feng3d.HoldSizeComponent);
            holdSizeComponent.camera = editor.editorCamera;
            holdSizeComponent.holdSize = 1;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(163 / 255, 162 / 255, 107 / 255);
            var segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            var num = 10;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                segmentGeometry.segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x, y, linesize * 5) });
            }
            num = 36;
            for (var i = 0; i < num; i++) {
                var angle = i * Math.PI * 2 / num;
                var x = Math.sin(angle) * linesize;
                var y = Math.cos(angle) * linesize;
                var angle1 = (i + 1) * Math.PI * 2 / num;
                var x1 = Math.sin(angle1) * linesize;
                var y1 = Math.cos(angle1) * linesize;
                segmentGeometry.segments.push({ start: new feng3d.Vector3(x, y, 0), end: new feng3d.Vector3(x1, y1, 0) });
            }
            this.gameObject.addChild(lightLines);
            this.enabled = true;
        };
        DirectionLightIcon.prototype.update = function () {
            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this.lightLines.visible = editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1;
        };
        DirectionLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            _super.prototype.dispose.call(this);
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
        Object.defineProperty(PointLightIcon.prototype, "light", {
            get: function () {
                return this._light;
            },
            set: function (v) {
                if (this._light) {
                    this._light.off("scenetransformChanged", this.onScenetransformChanged, this);
                }
                this._light = v;
                if (this._light) {
                    this.onScenetransformChanged();
                    this._light.on("scenetransformChanged", this.onScenetransformChanged, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        PointLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        PointLightIcon.prototype.initicon = function () {
            var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = editor.editorCamera;
            var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.PlaneGeometry({ width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false });
            var textureMaterial = this.textureMaterial = meshRenderer.material = feng3d.materialFactory.create("texture", {
                uniforms: {
                    s_texture: {
                        url: editor.editorData.getEditorAssetsPath("assets/3d/icons/light.png"),
                        format: feng3d.TextureFormat.RGBA,
                        premulAlpha: true,
                    }
                }
            });
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this.lightpoints = feng3d.GameObject.create("points");
            lightpoints.mouseEnabled = false;
            lightpoints.serializable = false;
            lightpoints.showinHierarchy = false;
            var meshRenderer = lightpoints.addComponent(feng3d.MeshRenderer);
            var pointGeometry = this.pointGeometry = meshRenderer.geometry = new feng3d.PointGeometry();
            pointGeometry.points = [
                { position: new feng3d.Vector3(1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(-1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(0, -1, 0), color: new feng3d.Color4(0, 1, 0) },
                { position: new feng3d.Vector3(0, 0, 1), color: new feng3d.Color4(0, 0, 1) },
                { position: new feng3d.Vector3(0, 0, -1), color: new feng3d.Color4(0, 0, 1) }
            ];
            var pointMaterial = meshRenderer.material = feng3d.materialFactory.create("point", { renderParams: { renderMode: feng3d.RenderMode.POINTS } });
            pointMaterial.renderParams.enableBlend = true;
            pointMaterial.uniforms.u_PointSize = 5;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        PointLightIcon.prototype.update = function () {
            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            this.lightLines.transform.scale =
                this.lightpoints.transform.scale =
                    new feng3d.Vector3(this.light.range, this.light.range, this.light.range);
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                var camerapos = this.gameObject.transform.inverseTransformPoint(editor.editorCamera.gameObject.transform.scenePosition);
                //
                this.segmentGeometry.segments.length = 0;
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
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 0, 0, alpha), endColor: new feng3d.Color4(1, 0, 0, alpha) });
                    point0 = new feng3d.Vector3(x, 0, y);
                    point1 = new feng3d.Vector3(x1, 0, y1);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 1, 0, alpha), endColor: new feng3d.Color4(0, 1, 0, alpha) });
                    point0 = new feng3d.Vector3(x, y, 0);
                    point1 = new feng3d.Vector3(x1, y1, 0);
                    if (point0.dot(camerapos) < 0 || point1.dot(camerapos) < 0)
                        alpha = backalpha;
                    else
                        alpha = 1.0;
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(0, 0, 1, alpha), endColor: new feng3d.Color4(0, 0, 1, alpha) });
                }
                this.segmentGeometry.invalidateGeometry();
                this.pointGeometry.points = [];
                var point = new feng3d.Vector3(1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(-1, 0, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 0, 0, alpha) });
                point = new feng3d.Vector3(0, 1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, -1, 0);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 1, 0, alpha) });
                point = new feng3d.Vector3(0, 0, 1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                point = new feng3d.Vector3(0, 0, -1);
                if (point.dot(camerapos) < 0)
                    alpha = backalpha;
                else
                    alpha = 1.0;
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(0, 0, 1, alpha) });
                //
                this.lightLines.visible = true;
                this.lightpoints.visible = true;
            }
            else {
                this.lightLines.visible = false;
                this.lightpoints.visible = false;
            }
        };
        PointLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightpoints.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            this.lightpoints = null;
            this.segmentGeometry = null;
            _super.prototype.dispose.call(this);
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
        Object.defineProperty(SpotLightIcon.prototype, "light", {
            get: function () {
                return this._light;
            },
            set: function (v) {
                if (this._light) {
                    this._light.off("scenetransformChanged", this.onScenetransformChanged, this);
                }
                this._light = v;
                if (this._light) {
                    this.onScenetransformChanged();
                    this._light.on("scenetransformChanged", this.onScenetransformChanged, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        SpotLightIcon.prototype.init = function (gameObject) {
            _super.prototype.init.call(this, gameObject);
            this.initicon();
            this.on("mousedown", this.onMousedown, this);
        };
        SpotLightIcon.prototype.initicon = function () {
            var lightIcon = this.lightIcon = feng3d.GameObject.create("Icon");
            lightIcon.serializable = false;
            lightIcon.showinHierarchy = false;
            var billboardComponent = lightIcon.addComponent(feng3d.BillboardComponent);
            billboardComponent.camera = editor.editorCamera;
            var meshRenderer = lightIcon.addComponent(feng3d.MeshRenderer);
            meshRenderer.geometry = new feng3d.PlaneGeometry({ width: 1, height: 1, segmentsW: 1, segmentsH: 1, yUp: false });
            var textureMaterial = this.textureMaterial = meshRenderer.material = feng3d.materialFactory.create("texture", {
                uniforms: {
                    s_texture: {
                        url: editor.editorData.getEditorAssetsPath("assets/3d/icons/spot.png"),
                        format: feng3d.TextureFormat.RGBA,
                        premulAlpha: true,
                    }
                }
            });
            textureMaterial.renderParams.enableBlend = true;
            this.gameObject.addChild(lightIcon);
            //
            var lightLines = this.lightLines = feng3d.GameObject.create("Lines");
            lightLines.mouseEnabled = false;
            lightLines.serializable = false;
            lightLines.showinHierarchy = false;
            var meshRenderer = lightLines.addComponent(feng3d.MeshRenderer);
            var material = meshRenderer.material = feng3d.materialFactory.create("segment", { renderParams: { renderMode: feng3d.RenderMode.LINES } });
            material.uniforms.u_segmentColor = new feng3d.Color4(1, 1, 1, 0.5);
            material.renderParams.enableBlend = true;
            this.segmentGeometry = meshRenderer.geometry = new feng3d.SegmentGeometry();
            this.gameObject.addChild(lightLines);
            //
            var lightpoints = this.lightpoints = feng3d.GameObject.create("points");
            lightpoints.mouseEnabled = false;
            lightpoints.serializable = false;
            lightpoints.showinHierarchy = false;
            var meshRenderer = lightpoints.addComponent(feng3d.MeshRenderer);
            var pointGeometry = this.pointGeometry = meshRenderer.geometry = new feng3d.PointGeometry();
            pointGeometry.points = [
                { position: new feng3d.Vector3(1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(-1, 0, 0), color: new feng3d.Color4(1, 0, 0) },
                { position: new feng3d.Vector3(0, -1, 0), color: new feng3d.Color4(0, 1, 0) },
                { position: new feng3d.Vector3(0, 0, 1), color: new feng3d.Color4(0, 0, 1) },
                { position: new feng3d.Vector3(0, 0, -1), color: new feng3d.Color4(0, 0, 1) }
            ];
            var pointMaterial = meshRenderer.material = feng3d.materialFactory.create("point", { renderParams: { renderMode: feng3d.RenderMode.POINTS } });
            pointMaterial.renderParams.enableBlend = true;
            pointMaterial.uniforms.u_PointSize = 5;
            this.gameObject.addChild(lightpoints);
            this.enabled = true;
        };
        SpotLightIcon.prototype.update = function () {
            this.textureMaterial.uniforms.u_color = this.light.color.toColor4();
            if (editor.editorData.selectedGameObjects.indexOf(this.light.gameObject) != -1) {
                //
                this.segmentGeometry.segments.length = 0;
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
                    this.segmentGeometry.segments.push({ start: point0, end: point1, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                }
                this.pointGeometry.points = [];
                var point = new feng3d.Vector3(0, 0, distance);
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 1, 0, 1) });
                point = new feng3d.Vector3(0, -radius, distance);
                this.segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: point, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 1, 0, 1) });
                point = new feng3d.Vector3(-radius, 0, distance);
                this.segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: point, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 1, 0, 1) });
                point = new feng3d.Vector3(0, radius, distance);
                this.segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: point, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 1, 0, 1) });
                point = new feng3d.Vector3(radius, 0, distance);
                this.segmentGeometry.segments.push({ start: new feng3d.Vector3(), end: point, startColor: new feng3d.Color4(1, 1, 0, 1), endColor: new feng3d.Color4(1, 1, 0, 1) });
                this.pointGeometry.points.push({ position: point, color: new feng3d.Color4(1, 1, 0, 1) });
                this.segmentGeometry.invalidateGeometry();
                //
                this.lightLines.visible = true;
                this.lightpoints.visible = true;
            }
            else {
                this.lightLines.visible = false;
                this.lightpoints.visible = false;
            }
        };
        SpotLightIcon.prototype.dispose = function () {
            this.enabled = false;
            this.textureMaterial = null;
            //
            this.lightIcon.dispose();
            this.lightLines.dispose();
            this.lightpoints.dispose();
            this.lightIcon = null;
            this.lightLines = null;
            this.lightpoints = null;
            this.segmentGeometry = null;
            _super.prototype.dispose.call(this);
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
        return SpotLightIcon;
    }(editor.EditorScript));
    editor.SpotLightIcon = SpotLightIcon;
})(editor || (editor = {}));
var editor;
(function (editor) {
    editor.threejsLoader = {
        load: load,
    };
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
            var gameobject = feng3d.GameObject.create(object3d.name);
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
                    var skinnedMeshRenderer = gameobject.addComponent(feng3d.SkinnedMeshRenderer);
                    skinnedMeshRenderer.geometry = parseGeometry(object3d.geometry);
                    skinnedMeshRenderer.material.renderParams.cullFace = feng3d.CullFace.NONE;
                    feng3d.assert(object3d.bindMode == "attached");
                    skinnedMeshRenderer.skinSkeleton = parseSkinnedSkeleton(skeletonComponent, object3d.skeleton);
                    if (parent)
                        skinnedMeshRenderer.initMatrix3d = gameobject.transform.localToWorldMatrix.clone();
                    break;
                case "Mesh":
                    var meshRenderer = gameobject.addComponent(feng3d.MeshRenderer);
                    meshRenderer.geometry = parseGeometry(object3d.geometry);
                    meshRenderer.material.renderParams.cullFace = feng3d.CullFace.NONE;
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
                editor.popupview.popup({ newprojectname: "newproject" }, function (data) {
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
                editor.popupview.popup({ newprojectname: "newproject" }, function (data) {
                    if (data.newprojectname && data.newprojectname.length > 0) {
                        editor.editorcache.projectname = data.newprojectname;
                        window.location.reload();
                    }
                });
            }
        },
        {
            label: "保存场景", click: function () {
                var gameobject = editor.hierarchyTree.rootnode.gameobject;
                editor.editorAssets.saveObject(gameobject, gameobject.name + ".scene", true);
            }
        },
        {
            label: "导入项目", click: function () {
                editor.fs.selectFile(function (filelist) {
                    editor.fs.importProject(filelist.item(0), function () {
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
                editor.fs.exportProject(function (err, content) {
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
                editor.fs.upgradeProject(function () {
                    alert("升级完成！");
                });
            },
        },
        {
            label: "清空项目",
            click: function () {
                editor.editorAssets.deletefile(editor.editorAssets.assetsPath, function () {
                    editor.editorAssets.initproject(function () {
                        editor.editorAssets.runProjectScript(function () {
                            editor.engine.scene = editor.creatNewScene();
                            editor.editorui.assetsview.invalidateAssetstree();
                            console.log("清空项目完成!");
                        });
                    });
                }, true);
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
                        var gameobject = feng3d.GameObject.create("DirectionalLight");
                        gameobject.addComponent(feng3d.DirectionalLight);
                        addToHierarchy(gameobject);
                    }
                },
                {
                    label: "聚光灯", click: function () {
                        var gameobject = feng3d.GameObject.create("SpotLight");
                        gameobject.addComponent(feng3d.SpotLight);
                        addToHierarchy(gameobject);
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
        var selectedNode = editor.hierarchyTree.getSelectedNode();
        if (selectedNode)
            selectedNode.gameobject.addChild(gameobject);
        else
            editor.hierarchyTree.rootnode.gameobject.addChild(gameobject);
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
     * 获取创建粒子系统组件菜单
     * @param particleSystem 粒子系统
     */
    function getCreateParticleComponentMenu(particleSystem) {
        var menu = [];
        return menu;
    }
    editor.getCreateParticleComponentMenu = getCreateParticleComponentMenu;
    /**
     * 下载项目
     * @param projectname
     */
    function openDownloadProject(projectname, callback) {
        editor.editorAssets.deletefile(editor.editorAssets.assetsPath, function () {
            downloadProject(projectname, callback);
        }, true);
    }
    /**
     * 下载项目
     * @param projectname
     */
    function downloadProject(projectname, callback) {
        var path = "projects/" + projectname;
        feng3d.Loader.loadBinary(path, function (content) {
            editor.fs.importProject(content, function () {
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
        editor.fs.getProjectList(function (err, ps) {
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
    feng3d.objectview.setDefaultTypeAttributeView("number", { component: "OAVNumber" });
    feng3d.objectview.setDefaultTypeAttributeView("Vector3", { component: "OAVVector3D" });
    feng3d.objectview.setDefaultTypeAttributeView("Array", { component: "OAVArray" });
    feng3d.objectview.setDefaultTypeAttributeView("Function", { component: "OAVFunction" });
    feng3d.objectview.setDefaultTypeAttributeView("Color3", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("Color4", { component: "OAVColorPicker" });
    feng3d.objectview.setDefaultTypeAttributeView("UrlImageTexture2D", { component: "OAVTexture2D" });
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
    { key: "mousewheel", command: "mouseWheelMoveSceneCamera", when: "mouseInView3D" },
    { key: "alt+mousedown", command: "mouseRotateSceneStart", stateCommand: "mouseRotateSceneing", when: "" },
    { key: "f", command: "lookToSelectedGameObject", when: "" },
    { key: "w", command: "gameobjectMoveTool", when: "!fpsViewing" },
    { key: "e", command: "gameobjectRotationTool", when: "!fpsViewing" },
    { key: "r", command: "gameobjectScaleTool", when: "!fpsViewing" },
    { key: "del", command: "deleteSeletedGameObject", when: "" },
    { key: "click+!alt", command: "selectGameObject", when: "!inModal+mouseInView3D+!mouseInSceneRotateTool+!inTransforming+!selectInvalid" },
];
var editor;
(function (editor) {
    editor.editorDispatcher = new feng3d.EventDispatcher();
})(editor || (editor = {}));
var editor;
(function (editor) {
    /**
     * feng3d的版本号
     * @author feng 2015-03-20
     */
    editor.revision = "2018.08.02";
    feng3d.log("Feng3D version " + editor.revision);
    /**
     * 编辑器
     * @author feng 2016-10-29
     */
    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor() {
            var _this = _super.call(this) || this;
            var mainui = new editor.MainUI(function () {
                editor.editorui.stage = _this.stage;
                //
                var maskLayer = new eui.UILayer();
                maskLayer.touchEnabled = false;
                _this.stage.addChild(maskLayer);
                editor.editorui.maskLayer = maskLayer;
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
            feng3d.runEnvironment = feng3d.RunEnvironment.editor;
            this.initMainView();
            //初始化feng3d
            new editor.Main3D();
            feng3d.shortcut.addShortCuts(shortcutConfig);
            editor.editorshortcut.init();
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
            editor.fs.hasProject(editor.editorcache.projectname, function (has) {
                if (has) {
                    editor.fs.initproject(editor.editorcache.projectname, callback);
                }
                else {
                    editor.fs.createproject(editor.editorcache.projectname, function () {
                        editor.fs.initproject(editor.editorcache.projectname, callback);
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