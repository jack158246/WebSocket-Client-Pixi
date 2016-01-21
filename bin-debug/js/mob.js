//定義電腦與手機同步的狀態
var load_web = false;
var load_mob = false;
var ws;
var key;
var id;
//收發訊息
$(document).ready(function () {
    //取得key、建立socket
	toWebSocketInit();
    //發送
    $("#loadok").click(function () {
		ws.send(JSON.stringify({
            key: key,
			act: "enter",
			id: id,
			value: {
				device:"0,1,0,0"
			}
        }));
    });

    //中斷連接
    $("#discon").click(function () {
        socket_disconnect();
    });
});

function toWebSocketInit(){
	key = getParam('key', false);
	ws = new WebSocket("ws://gentle-fjord-6793.herokuapp.com");

	ws.onopen = function(){
		ws.send(JSON.stringify({
			key: key,
			act: "channel",
			id: id
		}));
	};

	//接收
	ws.onmessage = function(b) {
		var b = JSON.parse(b.data);
		var combine = b.key + "_" + b.act;
		switch (combine) {
			//1. 獲取我在此頻道中的 id
			case key + "_" + "myid":
				console.log("my id is: " + b.id);
				id = b.id;
				break;
			//end case
			//2. 偵測頻道中的目前人數
			case key + "_" + "nowtotal":
				console.log("there are " + b.tt + " people in this channel");
				break;
			//end case
			//3. 偵測頻道中其他人的動作
			case key + "_" + "enter":
				console.log(b.id + " is enter");
				break;
			//end case
			//4. 偵測頻道中斷線的人的 id
			case key + "_" + "dead":
				console.log(b.id + " is dead");
				break;
			//end case
		}

	}

	ws.onclose = function(){
		console.log("Closed");
		toWebSocketInit();
	}

	ws.onerror = function(){
		console.log("Error");
	}
}

//html收參數
function getParam(name, casesensitive) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	href = window.location.href;
	if (!casesensitive) name = name.toLowerCase();
	if (!casesensitive) href = href.toLowerCase();
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(href);
	if (results == null) {
		return "";
	} else {
		return results[1];
	}
}

//斷開魂節
function socket_disconnect() {
    ws.close();
}
