"use strict";
/// <reference path="../libs/feng3d.module.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/**
 * Native文件系统
 */
var NativeFS = /** @class */ (function () {
    function NativeFS() {
        /**
         * 工作空间路径，工作空间内存放所有编辑器项目
         */
        this.workspace = "c:/editorworkspace/";
        /**
         * 项目名称
         */
        this.projectname = "testproject";
    }
    Object.defineProperty(NativeFS.prototype, "type", {
        get: function () {
            return feng3d.FSType.native;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 读取文件
     * @param path 路径
     * @param callback 读取完成回调 当err不为null时表示读取失败
     */
    NativeFS.prototype.readFile = function (path, callback) {
        if (path.charAt(path.length - 1) == "/") {
            callback(null, null);
            return;
        }
        this.getAbsolutePath(path, function (err, absolutePath) {
            fs.open(absolutePath, "r", function (err, fd) {
                if (err) {
                    callback(err, null);
                    return;
                }
                fs.readFile(absolutePath, function (err, data) {
                    fs.close(fd, function (err) {
                        callback(err, data.buffer);
                    });
                });
            });
        });
    };
    /**
     * 获取文件信息
     * @param path 文件路径
     * @param callback 回调函数
     */
    NativeFS.prototype.stat = function (path, callback) {
        this.getAbsolutePath(path, function (err, absolutePath) {
            fs.stat(absolutePath, function (err, stats) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(err, {
                    path: path,
                    size: stats.size,
                    isDirectory: stats.isDirectory(),
                    birthtime: stats.birthtime.getTime(),
                    mtime: stats.mtime.getTime(),
                });
            });
        });
    };
    /**
     * 读取文件夹中文件列表
     * @param path 路径
     * @param callback 回调函数
     */
    NativeFS.prototype.readdir = function (path, callback) {
        this.getAbsolutePath(path, function (err, absolutePath) {
            fs.readdir(absolutePath, function (err, files) {
                files = files.map(function (file) {
                    // 文件夹添加结尾标记 "/"
                    if (fs.statSync(absolutePath + file).isDirectory()) {
                        file += "/";
                    }
                    return file;
                });
                callback(err, files);
            });
        });
    };
    /**
     * 新建文件夹
     * @param path 文件夹路径
     * @param callback 回调函数
     */
    NativeFS.prototype.mkdir = function (path, callback) {
        this.getAbsolutePath(path, function (err, absolutePath) {
            if (fs.existsSync(absolutePath))
                callback(null);
            else
                fs.mkdir(absolutePath, callback);
        });
    };
    /**
     * 删除文件
     * @param path 文件路径
     * @param callback 回调函数
     */
    NativeFS.prototype.deleteFile = function (path, callback) {
        this.getAbsolutePath(path, function (err, absolutePath) {
            if (absolutePath.charAt(absolutePath.length - 1) == "/")
                fs.rmdir(absolutePath, callback);
            else
                fs.unlink(absolutePath, callback);
        });
    };
    /**
     * 写(新建)文件
     * @param path 文件路径
     * @param data 文件数据
     * @param callback 回调函数
     */
    NativeFS.prototype.writeFile = function (path, data, callback) {
        this.getAbsolutePath(path, function (err, absolutePath) {
            var buffer = new Buffer(data);
            fs.open(absolutePath, "w", function (err, fd) {
                if (err) {
                    callback && callback(err);
                    return;
                }
                fs.writeFile(absolutePath, buffer, "binary", function (err) {
                    fs.close(fd, callback);
                });
            });
        });
    };
    /**
     * 获取项目列表
     * @param callback 回调函数
     */
    NativeFS.prototype.getProjectList = function (callback) {
        fs.readdir(this.workspace, function (err, files) {
            callback(err, files);
        });
    };
    /**
     * 获取文件绝对路径
     * @param path （相对）路径
     * @param callback 回调函数
     */
    NativeFS.prototype.getAbsolutePath = function (path, callback) {
        callback(null, this.workspace + this.projectname + "/" + path);
    };
    return NativeFS;
}());
exports.NativeFS = NativeFS;
exports.nativeFS = new NativeFS();
