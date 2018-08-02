var http=require("http");
var fs=require("fs");
var express=require("express");
var ejs=require("ejs"); //html 문서내에서 서버에서 실행되는 
								//모듈..
var PagingManager=require("./PagingManager.js");

var app=express();
var server=http.createServer(app);

//static을 지정하면 정적파일에까지 라우팅 필요없다
app.use(express.static(__dirname));

//리스트 요청에 대한 처리...
//웹브라우저가 서버에 요청시 요청방법이 총 5가지가 지원
//되는데, 가장 많이 사용하는 방식이 get, post 
//Get : 일반 링크 , 보안이 불가 = 데이터 노출
//Post : 폼양식으로 전송할때 ( 회원가입할때...),파일업로드
//         보안이 가능, 데이터 노출X, 전송데이터량에 제한없다
app.get("/list", function(request, response){
	console.log(request.query.currentPage);
	
	var pm= new PagingManager(request);

	fs.readFile("list.ejs","utf-8", function(error, data){
		response.writeHead(200,{"Content-Type":"text/html"});
		response.end(ejs.render(data,{
			pm:pm
		}));
	});
});

server.listen(9000, function(){
	console.log("웹서버 가동");
});



