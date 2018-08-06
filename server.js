var http=require("http");
var fs=require("fs");
var express=require("express");
var ejs=require("ejs"); //html 문서내에서 서버에서 실행되는 
								//모듈..
var PagingManager=require("./PagingManager.js");

//post 로 전송된 데이터를 해석하는 모듈~~
var bodyParser=require("body-parser");
var mysql=require("mysql");

var app=express();

var server=http.createServer(app);

//static을 지정하면 정적파일에까지 라우팅 필요없다
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//노드서버를 가동하면 기본적으로 db 접속해놓자!!

var con=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"iot"
});

//접속!!!
con.connect(function(error){
	if(error){
		console.log("접속실패 ㅠㅠ....");
	}else{
		console.log("접속 성공!!");
	}
});


//리스트 요청에 대한 처리...
//웹브라우저가 서버에 요청시 요청방법이 총 5가지가 지원
//되는데, 가장 많이 사용하는 방식이 get, post 
//Get : 일반 링크 , 보안이 불가 = 데이터 노출
//Post : 폼양식으로 전송할때 ( 회원가입할때...),파일업로드
//         보안이 가능, 데이터 노출X, 전송데이터량에 제한없다
app.get("/list", function(request, response){
	console.log(request.query.currentPage);
	
	//레코드 가져오기!!!
	var sql="select notice_id, writer,title, date_format(regdate, '%Y-%m-%d') as regdate,hit from notice order by notice_id desc";
	con.query(sql, function(error, result, fields){
		if(error){
			console.log("조회 실패!!", error);
		}else{
			console.log(result);
			var pm= new PagingManager(request, result.length);

			fs.readFile("list.ejs","utf-8", function(error, data){
				response.writeHead(200,{"Content-Type":"text/html"});
				response.end(ejs.render(data,{
					pm:pm,
					result:result
				}));
			});
		}
	});

});

//글 등록 요청이 들어오면....
app.post("/regist", function(request, response){
	
	console.log(request.body.writer);
	console.log(request.body.title);
	console.log(request.body.content);

	var writer=request.body.writer;
	var title=request.body.title;
	var content=request.body.content;

	//글 등록
	var sql="insert into notice(writer,title,content)";
	sql=sql+" values('"+writer+"','"+title+"','"+content+"')";
	
	con.query(sql, function(error, result){
		if(error){
			console.log("입력실패 ㅜㅜ", error);
		}else{
			console.log("입력성공", result);
		}
	});

	console.log(sql);
	
	//요청을 /list로 전환
	response.writeHead(302, {"Location":"/list"});
	response.end();
});

//상세보기 요청 처리 
app.get("/detail", function(request, response){
	//클라이언트가 보낸 get방식의 데이터를 받아내자!!
	console.log(request.query);
	var notice_id=request.query.notice_id;

	var sql="select * from notice where notice_id="+notice_id;
	console.log(sql);

	con.query(sql, function(error, result, fields){
		if(error){
			console.log(error);
		}
		//detail.ejs에게 보내자!!
		console.log(result);
		fs.readFile("detail.ejs","utf-8", function(err, data){
			response.writeHead(200,{"Content-Type":"text/html"});
			response.end(ejs.render(data, {
				result:result[0]
			}));
		});
	});

});

//수정요청 처리 
app.post("/edit", function(request, response){
	//클라이언트가 전송한 파라미터 받기!!!
	console.log(request.body);

	var notice_id=request.body.notice_id;
	var writer=request.body.writer;
	var title=request.body.title;
	var content=request.body.content;

	var sql="update notice set writer='"+writer+"', title='"+title+"',content='"+content+"'";
	sql+=" where notice_id="+notice_id;
	
	console.log(sql);

	con.query(sql, function(error, result){
		if(error){
			console.log(error);
		}
		console.log(result);

		//수정한 글을 확인시켜 주기 위해 /detail 방향전환!!
		response.writeHead(302, {"Location":"/detail?notice_id="+notice_id});
		response.end();
	});

});


server.listen(9000, function(){
	console.log("웹서버 가동");
});



