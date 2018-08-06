class PagingManager{
	constructor(request, total){
		//
		this.currentPage=1; //현재 보고 있는 페이지
		//누군가가 페이지 링크를 누르면, 그 넘어온 값으로 대체하자!!
		if(request.query.currentPage !=undefined){
			this.currentPage=request.query.currentPage;
		}
		//currentPage=넘겨받은 코드;
		this.totalRecord=total;//총 레코드 수 
		this.pageSize=10; //페이지당 보여질 레코드 수	
		this.totalPage=Math.ceil(this.totalRecord/this.pageSize);
		this.blockSize=10;//블럭당 보여질 페이지 수
		this.firstPage=this.currentPage-(this.currentPage-1)%this.blockSize;//블럭당 포문의 시작 값
		this.lastPage=this.firstPage+(this.blockSize-1); //블럭당 포문의 끝 값
		this.curPos=(this.currentPage-1)*this.pageSize;//페이지당 배열의 시작 index
		this.num=this.totalRecord - this.curPos; //페이지당 시작 번호
		
	}	
}
//내가 정의한 클래스를 nodejs의 모듈화 시키기!! 사용자정의 모듈
module.exports=PagingManager;