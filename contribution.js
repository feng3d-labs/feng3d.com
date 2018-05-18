// 请求数据
function xhr(url, callback)
{
    var request = new XMLHttpRequest();
    var result = {};
    request.open('Get', url, true);
    request.onreadystatechange = function ()
    {
        if (request.readyState == 4)
        {// 4 = "loaded"

            if (request.status >= 200 && request.status < 300)
            {
                result = JSON.parse(request.responseText);
                callback(result);
            } else
            {
                console.log(`${url} 加载失败！`);
            }
        }
    };
    request.send();
}

var access_token = "93fb7f86df146e424ca8cb1a0b276fc1";

var approvedURL = "https://gitee.com/api/v5/repos/feng3d/feng3d/issues?access_token=${access_token}&state=approved&sort=updated&direction=desc&page=1&per_page=20";

var url = approvedURL.replace("${access_token}", access_token);

xhr(url, (result) =>
{
    console.log(result);
});