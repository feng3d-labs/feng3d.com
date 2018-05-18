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

// 创建Base64对象  
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}  
  
// 定义字符串  
var string = 'Hello World!';  
  
// 加密  
var encodedString = Base64.encode(string);  
console.log(encodedString); // 输出: "SGVsbG8gV29ybGQh"  
  
// 解密  
var decodedString = Base64.decode(encodedString);  
console.log(decodedString); // 输出: "Hello World!"  