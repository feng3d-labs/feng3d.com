/// <reference path="../feng3d/out/feng3d.d.ts" />

var view3D = new feng3d.Engine();

var fstype = feng3d.assets.fstype = GetQueryString("fstype");

if (fstype == "indexedDB")
{
    feng3d.assets.fs = feng3d.indexedDBfs;
    feng3d.indexedDBfs.projectname = decodeURI(GetQueryString("project"));

    feng3d.assets.readFileAsString("project.js", (err, content) =>
    {
        //
        var windowEval = eval.bind(window);
        // 运行project.js
        windowEval(content);

        // 加载并初始化场景
        feng3d.assets.readFileAsString("default.scene.json", (err, content) =>
        {
            var json = JSON.parse(content);
            var scene = feng3d.serialization.deserialize(json);
            if (scene.getComponent(feng3d.Scene3D))
                view3D.scene = scene.getComponent(feng3d.Scene3D);

            var cameras = view3D.root.getComponentsInChildren(feng3d.Camera);
            if (cameras.length > 0)
            {
                view3D.camera = cameras[0];
            } else
            {
                var camera = view3D.camera;
                camera.transform.z = -10;
                camera.transform.lookAt(new feng3d.Vector3D());
                //
            }
        });
    });
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}
