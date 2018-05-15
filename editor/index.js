var isdebug = true;

loadjs([
    `libs/feng3d.js`,
    //
    isdebug ? "libs/modules/egret/egret.js" : "libs/modules/egret/egret.js",
    isdebug ? "libs/modules/egret/egret.web.js" : "libs/modules/egret/egret.web.min.js",
    isdebug ? "libs/modules/res/res.js" : "libs/modules/res/res.min.js",
    isdebug ? "libs/modules/eui/eui.js" : "libs/modules/eui/eui.min.js",
    isdebug ? "libs/modules/tween/tween.js" : "libs/modules/tween/tween.min.js",
    //
    isdebug ? `libs/jszip.js` : "libs/jszip.min.js",
    isdebug ? `libs/FileSaver.js` : `libs/FileSaver.min.js`,
    `out/editor.js`,
], loadComplete);

function loadjs(path, onload, onerror)
{
    if (typeof path == "string")
    {
        var script = document.createElement('script');
        script.src = path;
        script.onload = (ev) =>
        {
            if (onload)
                onload(ev);
            else
            {
                console.log(`${path} 加载完成`);
            }
        }
        script.onerror = () =>
        {
            if (onerror)
                onerror();
            else
            {
                console.warn(`${path} 加载失败！`);
            }
        }
        document.head.appendChild(script);
    } else
    {
        if (path.length == 0)
        {
            onload();
        } else
        {
            loadjs(path.shift(), () =>
            {
                loadjs(path, onload, onerror);
            }, onerror);
        }
    }
}

function loadComplete()
{
    // console.log("loadComplete!");
    /**
     * {
     * "renderMode":, //引擎渲染模式，"canvas" 或者 "webgl"
     * "audioType": "" //使用的音频类型，0:默认，1:qq audio，2:web audio，3:audio
     * "antialias": //WebGL模式下是否开启抗锯齿，true:开启，false:关闭，默认为false
     * }
     **/
    egret.runEgret({ renderMode: "webgl", audioType: 0 });
}