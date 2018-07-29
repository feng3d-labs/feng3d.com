/// <reference path="../feng3d/out/feng3d.d.ts" />
/// <reference path="out/editor.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html

var ts;
var monacoEditor;
(function ()
{
    var DBname = "feng3d-editor";
    var fstype = GetQueryString("fstype");
    var project = decodeURI(GetQueryString("project"));
    var path = decodeURI(GetQueryString("path"));

    // var assetsfs:feng3d.ReadWriteAssets;
    var assetsfs;
    if (fstype == "indexedDB")
    {
        window.feng3d = window.opener.feng3d;
        feng3d.indexedDBfs.DBname = DBname;
        feng3d.indexedDBfs.projectname = project;
        assetsfs = feng3d.assets.fs = new feng3d.ReadWriteAssets(feng3d.indexedDBfs);
    } else if (fstype == "native")
    {
        var nativeFS = require(__dirname + "/io/NativeFS.js").nativeFS;
        nativeFS.projectname = project;
        assetsfs = feng3d.assets = new feng3d.ReadWriteAssets(nativeFS);
    }

    var compileButton = document.getElementById("compile");
    var watchCB = document.getElementById("watch");
    var logLabel = document.getElementById("log");

    compileButton.onclick = () =>
    {
        triggerCompile();
    };

    var timeoutid = 0;

    function autoCompile()
    {
        logLabel.textContent = "编码中。。。。";

        if (timeoutid)
            clearTimeout(timeoutid);

        timeoutid = setTimeout(() =>
        {
            if (timeoutid)
            {
                clearTimeout(timeoutid);
                logLabel.textContent = "自动编译中。。。。";
                triggerCompile();
            }
        }, 1000);
    }

    // ts 列表
    var tslist = [];
    var tslibs = [];

    var extension = path.split(".").pop();

    document.head.getElementsByTagName("title")[0].innerText = path;

    // 加载所有ts文件
    function loadallts(callback)
    {
        assetsfs.getAllPaths((err, keys) =>
        {
            var tspaths = keys.filter((v) =>
            {
                var ext = v.split(".").pop();
                return ext == "ts" || ext == "shader";
            });
            loadts();

            function loadts()
            {
                logLabel.textContent = "加载脚本中。。。。";
                if (tspaths.length > 0)
                {
                    var path = tspaths.pop();
                    assetsfs.readFileAsString(path, (err, str) =>
                    {
                        if (err)
                            console.warn(err);
                        else
                            tslist.push({ path: path, code: str });
                        loadts();
                    });
                } else
                {
                    logLabel.textContent = "加载脚本完成！";
                    callback();
                }
            }
        });
    }

    loadallts(init);

    var modelMap = { ts: "typescript", shader: "typescript", js: "javascript", json: "json", text: "text" };

    function init()
    {
        // 获取文件内容
        assetsfs.readFileAsString(path, (err, code) =>
        {
            initEditor(extension, function ()
            {
                var oldModel = monacoEditor.getModel();
                var newModel = monaco.editor.createModel(code, modelMap[extension] || modelMap.text);
                monacoEditor.setModel(newModel);
                if (oldModel) oldModel.dispose();

                // monacoEditor.setValue(code);
                if (extension == "ts" || extension == "shader")
                {
                    logLabel.textContent = "初次编译中。。。。";
                    triggerCompile();
                }
                monacoEditor.onDidChangeModelContent(function ()
                {
                    logLabel.textContent = "";
                    code = monacoEditor.getValue();
                    feng3d.dataTransform.stringToArrayBuffer(code, (arrayBuffer) =>
                    {
                        assetsfs.writeFile(path, arrayBuffer, (err) =>
                        {
                            if (err)
                                console.warn(err);
                            logLabel.textContent = "自动保存完成！";
                            if (extension == "ts" || extension == "shader")
                            {
                                tslist.filter((v) => v.path == path)[0].code = code;
                                if (watch.checked)
                                {
                                    autoCompile();
                                }
                            }
                        });
                    })
                });
            });
        });
    }

    function initEditor(extension, callback)
    {
        if (fstype == feng3d.FSType.native)
        {
            var nodepath = require('path');
            function uriFromPath(_path)
            {
                var pathName = nodepath.resolve(_path).replace(/\\/g, '/');
                if (pathName.length > 0 && pathName.charAt(0) !== '/')
                {
                    pathName = '/' + pathName;
                }
                return encodeURI('file://' + pathName);
            }

            amdRequire.config({
                baseUrl: uriFromPath(nodepath.join(__dirname, 'libs/monaco-editor/min'))
            });
            // workaround monaco-css not understanding the environment
            self.module = undefined;
            // workaround monaco-typescript not understanding the environment
            self.process.browser = true;
            amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], () =>
            {
                ts = amdRequire("vs/language/typescript/lib/typescriptServices");
                init();
            });
        } else
        {
            amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
            amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], init);
        }

        function init()
        {
            // 设置ts编译选项
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                allowNonTsExtensions: true,
                module: monaco.languages.typescript.ModuleKind.AMD,
                noResolve: true,
                suppressOutputPathCheck: true,
                skipLibCheck: true,
                skipDefaultLibCheck: true,
                target: monaco.languages.typescript.ScriptTarget.ES5,
                noImplicitAny: false,
                strictNullChecks: false,
                noImplicitThis: false,
                noImplicitReturns: false,
                experimentalDecorators: true,
                noUnusedLocals: false,
                noUnusedParameters: false,
            });

            tslist.forEach(item =>
            {
                if (item.path != path)
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(item.code, item.path);
            });

            loadLibs(['https://unpkg.com/feng3d/out/feng3d.d.ts'], () =>
            {
                monacoEditor = monaco.editor.create(document.getElementById('container'), {
                    model: null,
                    formatOnType: true,
                });
                callback();
            });
        }
    }

    function loadLibs(libpaths, callback)
    {
        if (libpaths == null || libpaths.length == 0)
        {
            callback();
            return;
        }
        var libpath = libpaths.shift();
        xhr(libpath).then(function (response)
        {
            var libcode = response.responseText;
            monaco.languages.typescript.typescriptDefaults.addExtraLib(libcode, libpath.split("/").pop());
            tslibs.push({ path: libpath, code: libcode });
            loadLibs(libpaths, callback);
        });
    }

    // ------------ Compilation logic
    function triggerCompile()
    {
        try
        {
            var output = transpileModule({
                // module: ts.ModuleKind.AMD,
                target: ts.ScriptTarget.ES5,
                noLib: true,
                noResolve: true,
                suppressOutputPathCheck: true
            });
            var outputStr = output.reduce((prev, item) =>
            {
                return prev + item.text;
            }, "");

            outputStr += `\n//# sourceURL=project.js`;
            feng3d.dataTransform.stringToArrayBuffer(outputStr, (arrayBuffer) =>
            {
                logLabel.textContent = "编译完成！";
                assetsfs.writeFile("project.js", arrayBuffer, (err) =>
                {
                    if (feng3d.editor)
                    {
                        feng3d.editor.editorAssets.runProjectScript(() =>
                        {
                            feng3d.globalEvent.dispatch("shaderChanged");
                            feng3d.globalEvent.dispatch("scriptChanged");
                        });
                    }
                });
            });
        }
        catch (e)
        {
            logLabel.textContent = "Error from compilation: " + e + "  " + (e.stack || "");
            console.log("Error from compilation: " + e + "  " + (e.stack || ""));
        }
    }
    function transpileModule(options)
    {
        var tsSourceMap = {};
        tslibs.forEach(item =>
        {
            tsSourceMap[item.path] = ts.createSourceFile(item.path, item.code, options.target || ts.ScriptTarget.ES5);
        });
        tssort(tslist);

        // tslist.sort((a, b) => a.path > b.path);

        tslist.forEach((item) =>
        {
            var path = item.path;
            path = path.replace(".shader", ".shader.ts")
            tsSourceMap[path] = ts.createSourceFile(path, item.code, options.target || ts.ScriptTarget.ES5);
        })

        // Output
        var outputs = [];
        var program = ts.createProgram(Object.keys(tsSourceMap), options, {
            getSourceFile: function (fileName)
            {
                return tsSourceMap[fileName];
            },
            writeFile: function (_name, text)
            {
                outputs.push({ name: _name, text: text });
            },
            getDefaultLibFileName: function () { return "lib.d.ts"; },
            useCaseSensitiveFileNames: function () { return false; },
            getCanonicalFileName: function (fileName) { return fileName; },
            getCurrentDirectory: function () { return ""; },
            getNewLine: function () { return "\r\n"; },
            fileExists: function (fileName)
            {
                return !!tsSourceMap[fileName];
            },
            readFile: function () { return ""; },
            directoryExists: function () { return true; },
            getDirectories: function () { return []; }
        });
        // Emit
        program.emit();
        if (outputs === undefined)
        {
            throw new Error("Output generation failed");
        }
        return outputs;
    }
    // ------------ Execution logic
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }

    function xhr(url)
    {
        var req = null;
        return new monaco.Promise(function (c, e, p)
        {
            req = new XMLHttpRequest();
            req.onreadystatechange = function ()
            {
                if (req._canceled) { return; }

                if (req.readyState === 4)
                {
                    if ((req.status >= 200 && req.status < 300) || req.status === 1223)
                    {
                        c(req);
                    } else
                    {
                        e(req);
                    }
                    req.onreadystatechange = function () { };
                } else
                {
                    p(req);
                }
            };

            req.open("GET", url, true);
            req.responseType = "";

            req.send(null);
        }, function ()
            {
                req._canceled = true;
                req.abort();
            });
    }
    /**
     * 脚本中的类
     */
    var scriptClassReg = /(export\s+)?(abstract\s+)?class\s+([\w$_\d]+)(\s+extends\s+([\w$_\d\.]+))?/;

    /**
     * ts 文件排序
     */
    function tssort(tsfiles)
    {
        var filelist = [{ path: "", class: [""], extends: [""] }];

        filelist = tsfiles.map((v) =>
        {
            var result = v.code.match(scriptClassReg);
            //目前只处理了ts文件中单个导出对象
            var item = { path: v.path, code: v.code, class: [], extends: [] }
            if (result)
            {
                item.class.push(result[3]);
                if (result[5])
                    item.extends.push(result[5].split(".").pop());
            }
            return item;
        });
        //按照字母排序
        filelist.sort((a, b) =>
        {
            if (a.class.length != b.class.length)
                return a.class.length - b.class.length;
            return a.path - b.path;
        })

        //按继承排序
        for (let i = 0; i < filelist.length; i++)
        {
            var item = filelist[i];
            var newpos = i;
            if (item.extends.length > 0)
            {
                for (let j = 0; j < item.extends.length; j++)
                {
                    var extendsclass = item.extends[j];
                    for (let k = i + 1; k < filelist.length; k++)
                    {
                        var itemk = filelist[k];
                        if (itemk.class.indexOf(extendsclass) != -1 && newpos < k)
                        {
                            newpos = k;
                        }
                    }
                }
            }
            if (newpos > i)
            {
                filelist[i] = null;
                filelist.splice(newpos + 1, 0, item);
            }
        }

        tsfiles.length = 0;
        for (let i = 0; i < filelist.length; i++)
        {
            const element = filelist[i];
            if (element)
            {
                tsfiles.push({ path: element.path, code: element.code });
            }
        }
    }
})();