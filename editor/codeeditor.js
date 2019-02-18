/// <reference path="../feng3d/out/feng3d.d.ts" />
/// <reference path="out/editor.d.ts" />
/// <reference path="libs/monaco-editor/monaco.d.ts" />

// 参考 https://microsoft.github.io/monaco-editor/api/index.html

// 解决monaco-editor在electron下运行问题
// https://github.com/Microsoft/monaco-editor-samples/blob/master/electron-amd/electron-index.html

window.feng3d = window.opener.feng3d;
window.editor = window.opener.editor;

var monacoEditor

//
amdRequire.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
amdRequire(['vs/editor/editor.main', 'vs/language/typescript/lib/typescriptServices'], () =>
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

    //
    monacoEditor = monaco.editor.create(document.getElementById('container'), {
        model: null,
        formatOnType: true,
    });

    codeEditor(editor.scriptCompiler._script);
});

window.onresize = function ()
{
    monacoEditor.layout();
};

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

function getModel(file)
{
    if (file instanceof feng3d.JsonFile)
        return "json";
    if (file instanceof feng3d.JSFile)
        return "javascript";
    if (file instanceof feng3d.ScriptFile)
        return "typescript";
    if (file instanceof feng3d.ShaderFile)
        return "typescript";
    if (file instanceof feng3d.StringFile)
        return "text";
    return "text";
}

function codeEditor(file)
{
    if (!(file instanceof feng3d.StringFile)) return;

    var model = getModel(file);
    var oldModel = monacoEditor.getModel();
    var newModel = monaco.editor.createModel(file.textContent, model);
    monacoEditor.setModel(newModel);
    if (oldModel) oldModel.dispose();

    // monacoEditor.setValue(code);
    if (file instanceof feng3d.ScriptFile)
    {
        var tslibs = editor.scriptCompiler.tslibs;
        var tslist = editor.scriptCompiler.getScripts();
        tslibs.forEach(v =>
        {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(v.code, v.path);
        });
        tslist.forEach(v =>
        {
            if (v != file) monaco.languages.typescript.typescriptDefaults.addExtraLib(v.textContent, v.assetsId + ".ts");
        });
        logLabel.textContent = "初次编译中。。。。";
        triggerCompile();
    }
    monacoEditor.onDidChangeModelContent(() =>
    {
        logLabel.textContent = "";
        file.textContent = monacoEditor.getValue();
        editor.assets.writeAssets(file, (err) =>
        {
            if (err) console.warn(err);
            logLabel.textContent = "自动保存完成！";
            if (file instanceof feng3d.ScriptFile)
            {
                if (watchCB.checked)
                {
                    autoCompile();
                }
            }
        });
    });
};

// ------------ Compilation logic
function triggerCompile()
{
    logLabel.textContent = "编码中。。。。";
    editor.scriptCompiler.compile();
}