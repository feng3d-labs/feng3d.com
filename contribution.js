// 请求数据
function xhr(url, callback)
{
    var request = new XMLHttpRequest();
    request.open('Get', url, true);
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {// 4 = "loaded"

            if (request.status >= 200 && request.status < 300)
            {
                var result = request.responseText;
                result = JSON.parse(result);
                callback(result);
            } else
            {
                console.log(`${url} 加载失败！`);
            }
        }
    };
    request.send();
}

function simplify(result)
{
    //
    var list = [];
    list.length = 0;
    result.forEach(element =>
    {
        var r = /贡献分\{([\d\.]+)\}/.exec(element.title);
        var obj = { id: element.id, number: element.number, score: 0, created_at: element.created_at, title: element.title, assignee: element.assignee.name, };
        if (r)
        {
            obj.score = Number(r[1]);
            if (isNaN(obj.score))
            {
                console.warn(obj);
                obj.score = 0;
            }
        }
        list.push(obj);
    });
    return list;
}

function calculate(contributions, list)
{
    for (let i = 0; i < list.length; i++)
    {
        calculateItem(list[i]);
    }

    function calculateItem(item)
    {
        var score = item.score;
        var assignee = item.assignee;
        //
        // 所有贡献者获得 10% 积分
        distribute(score * 0.1);
        // 任务负责人获得积分
        contributions[assignee] = contributions[assignee] || 0;
        contributions[assignee] += score;
    }

    function distribute(score)
    {
        var total = 0;

        for (const name in contributions)
        {
            total += contributions[name].contribution;
        }
        for (const name in contributions)
        {
            contributions[name].contribution += contributions[name].contribution / total * score;
        }
    }
}

var access_token = "93fb7f86df146e424ca8cb1a0b276fc1";

var approvedURL = "https://gitee.com/api/v5/repos/feng3d/feng3d/issues?access_token=${access_token}&state=approved&sort=updated&direction=desc&page=1&per_page=20";

var url = approvedURL.replace("${access_token}", access_token);

xhr(url, (result) =>
{
    console.log(result);
    var list = simplify(result);
    // id(时间)排序
    list.sort((a, b) => a.id - b.id);
    console.log(list);
    var contributions = {};
    calculate(contributions, list);
    console.log(contributions);
});

// 更新 gitee 仓库文件
// https://gitee.com/api/v5/swagger#/putV5ReposOwnerRepoContentsPath