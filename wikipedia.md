Feng3d是使用[[TypeScript]]进行编写基于[[WebGL]]的[[游戏引擎]],编译后生成一个[[浏览器兼容性|跨浏览器的]][[JavaScript]]脚本，提供[[API]]可在[[网页浏览器]]中创建和展示[[三维计算机图形]]。Feng3d代码托管在[[GitHub]]。

===== 概述 =====
Feng3d允许使用[[TypeScript]]创建网页中[[GPU]]加速的动画元素，而不需要任何浏览器插件。

===== 历史 =====
Feng3d由Feng在2014三月与[[GitHub]]首次发布。它起源于Feng学习Away3D的过程，代码最初使用[[ActionScript]]进行编写，2016年三月使用[[TypeScript]]进行重构。Feng认为使用[[TypeScript]]进行重构有两个突出的优势，不再需要[[虚拟机]]运行和[[TypeScirpt]]是个足够强大与灵活的编程语言。

===== 特性 =====
* 编辑器：提供快速游戏开发
* 脚本：能够使用脚本实现任何想要的功能
* 自定义材质：提供shader代码以及所有到的数据结构可以实现任何渲染效果（目前高级效果除外）
Feng3d在支持WebGL 1.0的浏览器中可以正常运行。

===== 使用 =====
Feng3d函数库是一个独立的JavaScript文件，通过链接至该页面中:

<source lang=javascript><script src="https://unpkg.com/feng3d"></script></source>

以下代码创建了一个立方体到场景，并且使立方体匀速绕Y轴旋转。

<source lang=html>
<html>
<head>
    <title>My first feng3d app</title>
</head>
<body>
    <script src="https://unpkg.com/feng3d"></script>
    <script>
        window.onload = function ()
        {
            var engine = new feng3d.Engine();
            var cube = feng3d.gameObjectFactory.createCube();
            cube.transform.z = 4;
            cube.transform.y = -1;
            engine.scene.gameObject.addChild(cube);

            feng3d.ticker.onframe(() =>
            {
                cube.transform.ry++;
            });
        }
    </script>
</body>
</html>
</source>

===== 外部链接 =====
* [http://feng3d.com/ Feng3d官方网站]
