# egret

feng3d可以很轻松与egret一起开发。

## 配置环境
1. 拷贝feng3d.d.ts与feng3d.js到libs中
1. 在index.html中添加feng3d
    ```html
    <script src="libs/feng3d.js"></script>
    <canvas id="feng3d"></canvas>
    ```
1. 在index.html中添加标签
    ```html
        <canvas id="feng3d" style="position: absolute;width: 640px;height: 480px;"> </canvas>
    <div id="egretDiv" style="position: absolute;width: 640px;height: 480px;" class="egret-player" data-entry-class="Main" data-orientation="auto"
        data-scale-mode="noScale" data-frame-rate="30" data-content-width="100%" data-content-height="100%" data-show-paint-rect="false"
        data-multi-fingered="2" data-show-fps="false" data-show-log="false" data-show-fps-style="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9">
    </div>
    ```
1. 初始化feng3d
```typescript
var engine = new feng3d.Engine(<any>document.getElementById("feng3d"));
```

## 主要文件

index.html

[filename](_media/egretproject/index.html ':include :type=code')

main.ts

[filename](_media/egretproject/src/main.ts ':include :type=code')

## 运行结果

[quickstart website](_media/egretproject/index.html ':include :type=iframe width=660px height=500px')

## 下载项目

[egret项目](http://feng3d.com/docs/_media/egretproject.zip)