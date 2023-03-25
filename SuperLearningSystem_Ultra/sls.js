	var LocalUrl=location.href.substring(8,location.href.lastIndexOf('/')).replace(/\//g,'\\\\');
	var allPath=LocalUrl+"\\dataTxt";
	var reviewPath=LocalUrl+"\\reviewTxt";
	var toReviewListPath=LocalUrl+"\\toDoTxt";
	var fso = new  ActiveXObject("Scripting.FileSystemObject");
	var state=Switch();
	if(state){
		var el=$("#btn_toggle");
			el.animate({left:'54px'},400,function (){
			el.text("ON ");
			el.css('backgroundColor','lime');
			if(randomID != "cover")
				clearInterval(randomID);
			$("body,html").css("background","none");
			$('body').css('background-color','#C7EDCC');
		});
	}else{
		var el=$("#btn_toggle");
		el.animate({left:'0px'},400,function (){
			el.text("OFF");
			el.css('backgroundColor','dimGrey');
			changeBackgroundImage();
		});
	}
	//返回首页
	$("#return_index").click(function(){
		window.location.href="01_index.html";
	});
	
	//性能开关
	$("#btn_toggle").click(function(){
		var el=$(this);
		if(el.text() == "ON "){//关掉性能模式
			el.animate({left:'0px'},400,function (){
			el.text("OFF");
			el.css('backgroundColor','dimGrey');
			changeBackgroundImage();
			writeReviewFiles(toReviewListPath,"\\modeInfo.dat",false,'false');
			});
		}else{
			el.animate({left:'54px'},400,function (){
			el.text("ON ");
			el.css('backgroundColor','lime');
			if(randomID != "cover")
				clearInterval(randomID);
			$("body,html").css("background","none");
			$('body').css('background-color','#C7EDCC');
			writeReviewFiles(toReviewListPath,"\\modeInfo.dat",false,'true');
			});
		}
	});
	//到底部按钮
		$("#Go_bottom").click(function(){
			window.scrollTo(0,document.body.scrollHeight);
		});
		$("#Go_top").click(function(){
			window.scrollTo(document.body.scrollHeight,0);
		});
		var FileName=ShowFolderFileList(allPath);
		var reviewListExists=ShowFolderFileList(reviewPath);
		var reviewListExistsLen=getTitles(reviewListExists).length;
		var arr=getTitles(FileName);
		var url_length=arr.length;
		if(url_length == 0)
			$("#tip").text("还没有知识点哦，赶快创建一个吧~");
		var inp,bt,bt0,bt1,Li,NewDiv,newdis,ever_name;
		var g_type,Newstr3,newTxt;
		var distance=0,num_gird=0;
		var num_arr = [];
		var numOfgird=[];
		var rc = [];
		var wrong_arr = [];//收集表格错误坐标点
		var grid_cnt=0,arr_grid_ans=[],el_ex=10086;
		var TD_value=[],old_row,old_col;
		var wrong_txt = [];
		var NewWholeContent = [];//字符串数组，存放的是答错的对应的答案
		//学习倒计时标语修改
		var study_slogan=readFiles(toReviewListPath,"slogan");
		//"☢️距离专接本考试还剩 ";
		if(getPageName() == "01_index.html"){
			//考试日期修改
			localTime('2023/12/1 00:00:00');
			loadStudyList();
			initTip();
			initReview();
		}	
		else
		{
			var z=(getPageName()=="02_CreatePage.html")?1.2:1.5;
			zoomControl(z);
			changeBackgroundImage();
			$("#zz").text("共有"+url_length+"个知识点");
		}
		var radio_click_cnt=0;
		//点击表格弹出行列输入框
		$("#s1").click(function(){
			$("#string_box").css('display','none');//关掉内容
			$("#confirm_btn").css('display','none');//关掉创建按钮
			$("#table_row").css('display','block');
			if(radio_click_cnt >= 1){
				var r = $("#t1").val();
				var c = $("#t2").val();
				var k=r*c;
				putAnsIntogrid(k);
			}
			radio_click_cnt++;
		});
		//点击内容弹出内容文本域
		$("#s2").click(function(){
			$("#table_list").css('display','none');
			$("#table_row").css('display','none');//关掉表格
			$("#string_box").css('display','block');
			$("#confirm_btn").css('display','block');
		});
		//选择知识点数量----单击事件
		$("#num_btn").click(function(){
			var correct_number = $("#select_number > input").val();//获取用户输入数字
			if(correct_number >= 1 && correct_number <= url_length)
			{
			var flag=true;
				if(correct_number != url_length)//数量不相等就随机//randomOperate(num_arr,correct_number,url_length)
					{
					var arrt=[];
						randomOperate(arrt,correct_number,url_length);
						flag=false;
					}
				generateDiv(correct_number);
				if(!flag)//随机法处理方式
				{
					for(var q=0;q<correct_number;q++)
						insertContent(arr[num_arr[q]],q);
				}
				else
				{//正常处理方式
					for(var w=0;w<correct_number;w++){
						num_arr[w]=arr[w];
						insertContent(arr[w],w);
					}
				}
				$("#submit_div").css('display','block');//开启提交按钮
				$("#select_number").css('display','none');
				INTT=followClock();
			}
			else//输入为0或者没有知识点的情况
			{
				if(url_length == 0)
				{
					alert("没有知识点，快去创建吧~");
					window.location.href="01_index.html";
				}	
				else
				{
					alert('数量错误');
				}
					
			}
		});
		$("#slogan_btn").click(function(){
			var sl=window.prompt("请输入标语","请输入内容");
			if(sl.length != 0)
				study_slogan=sl;
			writeReviewFiles(toReviewListPath,"\\slogan.dat",false,sl);
		});
		//表格设置确认按钮触发事件
		$("#row_btn").click(function(){
			$("#table_list").css('display','block');
			var r = $("#t1").val();
			var c = $("#t2").val();
			var text = $("#t3").val().replace(/ /g,'').trim();//表格标题
			var lastChar2=text.charAt(text.length-1);
			if(text.length != 0)
				text=addAcharacter(lastChar2,text);
			var judge= checkFileExists(text);
			if(radio_click_cnt == 1){
				old_col=c;
				old_row=r;
			}
			if(!judge)
			{
				if(c>20 || c<=0 || r>20 || r<=0 || text=='')
				{
					alert('输入错误');
				}
				else
				{	
					$("#table_list > input").remove();//清除所有表格
					$("#table_row").css('display','none');//关闭行列指定框
					$("#table_list > p").text(text);//显示标题
						var z=r*c;
						var width2=160*c+4*c;
						$("#table_list").css('width',width2+'px');//动态指定div的宽度
						for(var i=0;i<z;i++)
							$("#table_list").append('<input type="text" onClick="GA5('+i+')" style="border:solid #e2fff8 1px">');
						if(TD_value.length != 0){
							if(old_col == c && old_row == r || r == 1 || old_row > r && old_col == c || old_row < r && old_col == c)
								for(var i=0;i<z;i++)
									$("#table_list > input").eq(i).val(TD_value[i]);
							var index2=0;
							if(c > old_col)
							{
							var gap=c-old_col,cnt=0;
								for(var j=0;j<z;j++){
									if(j == 0)
									{
										$("#table_list > input").eq(j).val(TD_value[index2++]);
										cnt++;
										continue;
									}
									if((cnt+1)%old_col == 0)
									{
									var temp=gap;
									$("#table_list > input").eq(j).val(TD_value[index2++]);
										while(temp != 0){
											j++;
											$("#table_list > input").eq(j).val("");
											temp--;
										}
									}	
									else//内容
									{
										$("#table_list > input").eq(j).val(TD_value[index2++]);
									}
									cnt++;
								}
							}
							if(c < old_col)
							{
							var index=0;
								for(var k=0;k<z;k++){
								var gap = old_col-c;
								if(k == 0)
								{
									$("#table_list > input").eq(k).val(TD_value[index++]);
									continue;	
								}
								if((k+1)%c == 0)
								{
									$("#table_list > input").eq(k).val(TD_value[index++]);
									index+=gap;
									continue;
								}
								else//内容
								{
									$("#table_list > input").eq(k).val(TD_value[index++]);
								}	
							}
							}
						}
					$("#t3").val(text);
					$("#confirm_btn").css('display','block');
				}   
			}
			else
			{
				alert('文件已存在，请重新键入名称!');
			}
		});
		function Switch(){
		var state = readFiles(toReviewListPath,"modeInfo");
		if(state == "false")
			return false;
		return true;
		}
		//获取表格答案,放入数组
		function putAnsIntogrid(z){
			for(var j=0;j<z;j++)
				{
					var content=$("#table_list > input").eq(j).val();
					if(content.length != 0)
						TD_value[j]=content;
					else
						TD_value[j]="";
				}
		}
		//创建按钮----单击触发事件
$("#create_btn").click(function(){
	//0、检查是否为空 1、确认内容类型 2、将数据写入文件中
	var type = $(':radio[name="content_type"]:checked').val();//获取radio按钮选中状态
	var text1 = $("#t3").val().trim();//表格标题
	var text2 = $("#t4").val().trim();//文本域标题
	text1 = text1.replace(new RegExp("/","gm"),"／");
	text2 = text2.replace(new RegExp("/","gm"),"／");
	var lastChar=text2.charAt(text2.length-1);
	if(text2.length != 0)
		text2=addAcharacter(lastChar,text2);
		var judge=false;
		if(type == "内容")
			judge= checkFileExists(text2);
		if(!judge)
		{
			if(type == "表格")
			{
				if(!checkFileExists(text1))
					{
						var r = $("#t1").val();
						var c = $("#t2").val();
						var t = r*c;
						var cnt = 0;
						text1=text1.replace(/\\/g,"＼").replace(/\|/g,"∣").trim();
						for(var i=0;i<t;i++){
							var content = $("#table_list > input").eq(i).val();
							if(content != '' && content != ' ' && text1 != '' && text1 != ' ')
							cnt++;
						}
							if(cnt == 0)
							{
								alert('表格内容不能为空！！！');
							}
							else
							{
								var f1 = fso.createtextfile(allPath+"\\"+text1+".dat",true);//创建文件,利用 \\ 防止转义解析	
								f1.Write("Ю"+text1+"`"+r+"`"+c+"`"+"Ю");//标题,包含行列信息
								var content;
								for(var i=0;i<t;i++){
									content = $("#table_list > input").eq(i).val();
									f1.Write(content+"щ");
								}	
								if(arr_grid_ans.length != 0)
									for(var i=0;i<arr_grid_ans.length;i++)
										f1.Write(arr_grid_ans[i]+'{');
								f1.close;
								alert('创建成功！！！');
								window.location.href="01_index.html";
							}
					}
					else
					{
						alert('文件已存在!');
					}
			}
			else//内容
			{
				//获取textarea的内容
					var content = $("#string_box > textarea").text();
					text2=text2.replace(/\\/g,"＼").replace(/\|/g,"∣").trim();
					if(content != '' && content != ' ' && content.length != 0 && text2.length != 0 && text2 != '')
					{
						var f1 = fso.createtextfile(allPath+"\\"+text2+".dat",true);//创建文件,利用 \\ 防止转义解析
						f1.Write("э"+text2+"э");//标题
						f1.WriteLine(content);//增加换行符
						f1.close;
						alert('创建成功！！！');
						window.location.href="01_index.html";
					}
					else
					{
						alert('请输入内容！！！');
					}
			}
		}
		else
		{
			alert('文件已存在，请重新键入名称!');
			location.reload();
		}});
				//提交按钮触发事件
		$("#submit_div").find("button").click(function(){
			var title_arr = [];//标题数组
			var ans_arr = [];//表格答案数组
			var points = points2 = 0;
			var sum=0;
			var inputText;
			var gird_info=[];//用来接收当前层的所有值
			var m;
			varsum_str='!';
		if(confirm("你确认要提交你的答案吗，一旦提交便不可修改！"))
		{
			clearInterval(INTT);
			for(m=0;m<num_arr.length;m++){
				title_arr[m] = $("#GT"+m+"> p").text();//获取标题
				points=points2=0;//每一轮都初始化清0
				var str=readFiles(allPath,title_arr[m]);
				ans_arr[m]=[];
				wrong_arr[m]=[];
				if(checkType(title_arr[m]))//如果是表格就特殊加工
				{
					gird_info=girdProcess(m,title_arr,str);
					for(var j=0;j<numOfgird[m];j++)
					{
						ans_arr[m][j]=gird_info[j];
						inputText=$("#GT"+m+"> input").eq(j).val().replace(/\,/g,'').replace(/\，/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').replace(/ /g,'').replace(/\。/g,'').replace(/的/g,'').replace(/\//g,'').trim();//获取用户输入的答案
						if(ans_arr[m][j] == inputText)
							points++;
						else
							wrong_arr[m][j]=j;
					}
					points=parseFloat(points/((numOfgird[m]*(num_arr.length))))*100;
				}
				else
				{
					var nstr=str.replace('э'+title_arr[m]+'э','');
					var str2=nstr.replace(/\,/g,'').replace(/\，/g,'').replace(/\、/g,'').replace(/\。/g,'').replace(/的/g,'').replace(/在/g,'').replace(/\:/g,'').replace(/\：/g,'').replace(/ /g,'').replace(/\;/g,'').replace(/\；/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').trim();
					var wholeContent=$("#GT"+m+">textarea").text();//获取文本域文本
					wholeContent=wholeContent.replace(/\,/g,'').replace(/\，/g,'').replace(/\、/g,'').replace(/\。/g,'').replace(/的/g,'').replace(/在/g,'').replace(/\:/g,'').replace(/\：/g,'').replace(/ /g,'').replace(/\;/g,'').replace(/\；/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').trim();
					points2=(str2 == wholeContent)?(1/num_arr.length):0;
					if(points2 == 0)//得分为零，此题答错
						wrong_txt[m]=m;
					else
						wrong_txt[m]=10086;
					NewWholeContent[m]=nstr;
					points2=points2*100;
				}
				sum=sum+points+points2;//累加求分
			}
			//打开分数线显示区域
			$("#submit_div").css('display','none');
			$("#my_score").css('display','block');
			$("#my_score > p").text("你的分数为:"+sum.toFixed(1)+"分");
			$("#analysis_ans").css('display','block');//打开错误分析
			$("#line_t").css('display','block');
			$("#analysis_ans").append($("#area_test").clone());//克隆节点
			var newFlag=true;
			for(var x=0;x<num_arr.length;x++)
			{
				var tf=checkType(title_arr[x]);
				if(tf)
				{
					for(var t=0;t<numOfgird[x];t++)
					{
						if(t == wrong_arr[x][t])//如果是错误答案就渲染红色
						{
							$("#analysis_ans  #GT"+x+" input:"+"eq("+t+")").css('boxShadow','0 0 10px #f00');
						}	
						else
						{
							$("#analysis_ans  #GT"+x+" input:"+"eq("+t+")").css("border","solid lime 1px");
							newFlag=false;
						}
						$("#analysis_ans #GT"+x+"> input").eq(t).val(ans_arr[x][t]);
					}
				}
				else
				{
					for(var n=0;n<num_arr.length;n++){
						if(wrong_txt[n] != 10086)
						{
							$("#analysis_ans #GT"+n+"> textarea").css('box-shadow','0 0 10px #f00');
						}
						else
						{
							$("#analysis_ans #GT"+n+"> textarea").css('border','solid lime 1px');
							newFlag=false;
						}
						$("#analysis_ans #GT"+n+"> textarea").text(NewWholeContent[n]);
					}
				}
			}
			if(newFlag)//全对就全部渲染
				{
					$("#analysis_ans input").css("border","solid lime 1px");	
					$("#analysis_ans textarea").css("border","solid lime 1px");
				}
			}
		});
		openCheckReviewListTimer();
		var move_switch=false;
//复习倒计时
	$("#box>ul>div").on("mouseover","div",function(){
		var val = $(this).siblings("input:last-of-type").val();//获取此处按钮状态
		if(val == '复习')
		{
			thisHead='';
			move_switch=true;
			var review_arr=readReviewFiles("\\MemorizedList.dat",false).split('щ');//获取MemorizedList名单数组
			tipTitle = $(this).siblings("input:last-of-type").parent().next().children("span").text();//获取标题
			checkReviewTime('\\ReviewList.dat',review_arr);
			$(this).prop("title","距离下次复习剩余时间: "+NRT+" 分钟   当前第"+tip_phase+"阶段");//设置title属性增加倒计时提示	
		}
	});
//记忆（复习）按钮触发
	$("#box>ul>div").on("click","input:last-of-type",function(){
		var val = $(this).val();//获取此处按钮名
		var _btn_t = $(this).parent().next().children("span").text();//获取标题
		if(val == "记忆"){
			if(confirm("您是否已经完成记忆？")){
				$('body').append('<embed src="sound/Mem.mp3" autostart="true" hidden="true" loop="false" />');
				updateRandM(val,_btn_t,"");
			}	
		}
});
		//撤销操作----单击触发
		$("#Retest").click(function(){
			window.location.reload();
		});
		var storeTitle='';	
		var INTT;
		var intervalId;
		//设置标题滚动效果
		$("#box>ul>li").on("mouseover","span",function(){
			var n=$(this);
			storeTitle=n.text();
			intervalId = setInterval(function () {
				var text=n.text();
                var begin = text.substring(0,1);
                var end = text.substring(1);
                var text_new = end + begin;
                n.text(text_new);
            }, 270);	
		});
		$("#box>ul>li").on("mouseleave","span",function(){
			 clearInterval(intervalId);
			 $(this).text(storeTitle);
		});
		
		//创建知识点按钮----单击事件
		$("#Create_btn").click(function(){
			window.open("02_CreatePage.html");
			//window.location.href="02_CreatePage.html";
		});
		$("#Create_btn").hover(function(){
			$(this).css('font-size','26px');},function(){
			$(this).css('font-size','23px');
		});
		//随机测试按钮----单击事件
		$("#Random_btn").click(function(){
			window.open("randomTestPage.html");
			//window.location.href="randomTestPage.html";
		});
		$("#Random_btn").hover(function(){
			$(this).css('font-size','26px');},function(){
			$(this).css('font-size','23px');
		});
//重新测试
$("#Retest").click(function(){
	window.location.reload();
});
	$('#TrueClose_btn').click(function (){
		closeBtn();
	});
		var Na,Wct,alt_btn,alt_btn0,alt_btn1,alt_inp,ty,uc,r2,c2,alt_btn_offset_li,newTitleLi,dACP='';
//修改按钮----单击事件
$("#box>ul>div").on("click","button:last-of-type",function(){
		playSoundEffect('TAM',1,3);//播放随机音效
		Na = $(this).parent().next().children("span").text();//获取文件名
		newTitleLi=$(this).parent().next().children("span");
		alt_btn_offset_li=$(this).parent().next().offset().top;
		alt_btn=$(this).parent().parent().find("button");
		alt_btn0=$(this).parent().parent().find("button:last-of-type");
		alt_btn1=$(this).parent().parent().find("button:first-of-type");
		alt_inp=$(this).parent().parent().find("input:first-of-type");
		alt_btn.attr({"disabled":"disabled"});
		alt_inp.attr({"disabled":"disabled"});
		alt_inp.css({backgroundColor:"grey",opacity:0.6});
		alt_btn.css({backgroundColor:"grey",opacity:0.6});
		ty=checkType(Na);//检查类型
		cancel_arr.length=0;
		arr_grid_ans.length=0;
		$("#contain_btn").after('<input id="ModF" style="font-size:22px;width:810px;height:30px;margin-top:30px;margin-left:40px;" type="text" value="'+Na+'">');
		if(ty){
		var filestr = readFiles(allPath,Na);
			var r_c = filestr.substring(filestr.indexOf('`')+1,filestr.lastIndexOf('`')).split('`');
			r2=r_c[0];
			c2=r_c[1];
			var rc = r_c[0]*r_c[1];//rc为总数
			uc=rc;
				var light_point=[]; 
				var NewWidth=164*r_c[1];//计算动态长度
				$("#alterFrameTable").css('width',NewWidth+'px');//重新指定长度
				var st_arr = cutStr('Ю',filestr).split('щ');//获取表格答案字符串数组
				if(filestr.charAt(filestr.length-1) == '{'){
					light_point=rightPoint(filestr);
					dACP=filestr;
				}
				$("#alterFrameTable").css('display','block');//打开修改框
				for(var i=0;i<rc;i++){
					$("#alterFrameTable").append('<input type="text" onClick="GA5('+i+')" style="border:solid #e2fff8 1px">');
					$("#alterFrameTable input").eq(i).val(st_arr[i]);//放入答案
					if(light_point.length != 0){
						for(var j=0;j<light_point.length;j++){
							if(light_point[j] == i){
								$("#alterFrameTable input").eq(i).css('border','dashed lime 1px');//检查点边框渲染
								break;
							}
						}
					}
				}	
		}
		else{$("#alterFrame").css('display','block');//打开修改框
		Wct = cutStr('э',readFiles(allPath,Na));//获取到全格式的答案
		var el=$("#alterFrame textarea");
		el.text(Wct);//将答案放入到文本域中
		InsertAImage(el,Na);}
		$("#roll_ans_btn").css('display','block');	
		$("#alter_key").css('display','block');	
		$("#alter_btn").css('display','block');	
		scrollToLocate(document.body.scrollHeight);
	});
//测试-提交按钮----单击事件
$("#self_sub").click(function(){
	var error=[];
	var score=0;
	var st_arr;
	var st_txt;
	var move_dis=$("#self_test").height()+175+distance;
	Li.animate({top:move_dis+'px',left:'47px'},240);
	var Newstr2 = readFiles(allPath,ever_name);//获取文件数据
	if(g_type)
		{
			st_arr = cutStr('Ю',Newstr2).split('щ');//获取表格答案字符串数组
			for(var j=0;j<num_gird;j++)
			{
				var gird_str = $("#self_test input").eq(j).val().replace(/\,/g,'').replace(/\，/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').replace(/ /g,'').replace(/\。/g,'').replace(/的/g,'').replace(/\//g,'').trim();//获取用户输入的答案
				var Nst_arr = st_arr[j].replace(/\,/g,'').replace(/\，/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').replace(/ /g,'').replace(/\。/g,'').replace(/的/g,'').replace(/\//g,'').trim();
				if(Nst_arr != gird_str)
				{
					error[j]=j;//记录错误下标
					continue;}
					score++;
					error[j]=886;}
					score=parseFloat(score/num_gird)*100;}else{
					st_txt = cutStr('э',Newstr2).replace(/\,/g,'').replace(/\，/g,'').replace(/\、/g,'').replace(/\。/g,'').replace(/的/g,'').replace(/在/g,'').replace(/\:/g,'').replace(/\：/g,'').replace(/ /g,'').replace(/\;/g,'').replace(/\；/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').trim();//获取文本域答案字符串
					var txt=$("#self_test textarea").text();
					newTxt=txt;
					var txt2=txt.replace(/\,/g,'').replace(/\，/g,'').replace(/\、/g,'').replace(/\。/g,'').replace(/的/g,'').replace(/在/g,'').replace(/\:/g,'').replace(/\：/g,'').replace(/ /g,'').replace(/\;/g,'').replace(/\；/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').trim();
					if(st_txt == txt2)
						score=100.0;
					else
						score=0.0;
				}
			$("#self_submit").css('display','none');//关闭提交按钮
			$("#your_score").css('display','block');
			$("#line_t").css('display','block');
			$("#pp").text("你的分数为:"+score.toFixed(1)+"分");
			$("#ay_an").css('display','block');//打开结果分析
			if(g_type)
			{
				$("#ay_an #self_test").remove();//清除上次的残留表格
				$("#ay_an").append($("#self_test").clone());
				for(var x=0;x<error.length;x++)
				{
				var el=$("#ay_an input").eq(x);
					if(error[x] != 886)
						el.css('boxShadow','0 0 10px #f00');
					else
						el.css('border','solid lime 1px');
					el.val(st_arr[x]);//答案
					el.prop("disabled","disabled");
				}
			}
		else
			{
				Newstr3=cutStr('э',Newstr2);
				DisplayMode();
			}
		$("#close_button").css('display','block');
	});
	var rq=0;
	//回忆正确按钮
	$("#validity_btn").click(function (){
		effect(4);
	});
	//回忆犹豫
	$("#hesitate_btn").click(function (){
		effect(3);
	});
	//回忆困难
	$("#hard_btn").click(function (){
		effect(2);
	});
	//回忆错误
	$("#wrong_btn").click(function (){
		effect(1);
	});
	function block_btn4(flag){
		if(flag){
			$("#validity_btn").css('display','none');
			$("#hesitate_btn").css('display','none');
			$("#hard_btn").css('display','none');
			$("#wrong_btn").css('display','none');
		}else{
			$("#validity_btn").css('display','block');
			$("#hesitate_btn").css('display','block');
			$("#hard_btn").css('display','block');
			$("#wrong_btn").css('display','block');
		}
	}
	
	//遗忘影响因子计算方法与替换
	function effect(rq){
		//获取当前阶段
		var list = readReviewFiles("\\ReviewList.dat",true);//获得文件数据
		var strListArr=list.split('\r\n'),ph,cEF,sp,NstrListArr=[];
		var mlist = readReviewFiles("\\MemorizedList.dat",false).split('щ');
		for(var i=0;i<strListArr.length;i++){
			var na_str=strListArr[i].substring(0,strListArr[i].indexOf('`'));//获取标题
			if(ever_name == na_str){
				ph=parseInt(strListArr[i].trim().substring(strListArr[i].lastIndexOf('щ')+1,strListArr[i].lastIndexOf('э')));//获取此条字符串中的阶段
				cEF=parseFloat(strListArr[i].trim().substring(strListArr[i].lastIndexOf('э')+1,strListArr[i].lastIndexOf('И')));//获取当前因子
				rq=parseInt(rq);
				cEF=(cEF+(0.1-(5-rq))*(0.08+(5-rq)*0.02)).toFixed(3);
				if(cEF < 1.3) cEF=1.30;
				if(rq < 3 && ph >= 2){
				if(rq == 1) ph=1;
				else if(rq == 2) ph=2;}
				if(rq >= 3) ph++;
				sp=strListArr[i].substring(0,strListArr[i].lastIndexOf('щ')).concat('щ'+ph+'э'+cEF+'И'+getStrTime());
				NstrListArr.unshift(sp);
			}else{
				NstrListArr.unshift(strListArr[i]);
			}
		}
		checkReviewNumber(ever_name,'',false);//完成此条复习
		writeReviewFiles(reviewPath,"\\ReviewList.dat",true,NstrListArr.join('\r\n'));
		Li.css('boxShadow','');
		var btn = findBtn(ever_name);
		btn=btn.parent().prev();
		btn.children("input:last-of-type").css({backgroundColor:"grey",opacity:0.6});
		closeBtn();
	}
	
	//关闭分析栏方法
function closeBtn(){
	scrollToLocate(newdis);
	$("#self_test *").remove();
	$("#ay_an").css('display','none');
	$("#your_score").css('display','none');
	$("#close_button").css('display','none');
	$(".changeContent").css('display','none');
	$("#res").empty();
	$("#res").css('display','none');
	$("#self_test").css('display','none');
	inp.removeAttr('disabled');
	bt.removeAttr('disabled');
	bt1.css({backgroundColor:"blueviolet",opacity:1});
	bt0.css({backgroundColor:"#f44336",opacity:1});
	inp.css({backgroundColor:"skyblue",opacity:1});
	Li.animate({top:'0px',left:'0px'},200);
	
}
var key_bl4=true,thisHead='';
//独立测试----单击触发事件
	$("#box>ul>div").on("click","input:first-of-type",function(){
		//key_bl4=true;
		playSoundEffect('TAM',1,3);//播放随机音效
		var review_arr=readReviewFiles("\\MemorizedList.dat",false).split('щ');//获取MemorizedList名单数组
		
		var preLi=$(this).parent().next();
		distance=$("#Random_btn").offset().top-preLi.offset().top+40;
		newdis=preLi.offset().top;
		NewDiv=$(this).parent();
			preLi.animate({top:distance+'px'},200).animate({left:'47px'},180,function(){
				$("#self_test").css('display','block');
			});
			inp=$(this).parent().parent().find("input:first-of-type");
			bt=$(this).parent().parent().find("button");
			bt0=$(this).parent().parent().find("button:first-of-type");
			bt1=$(this).parent().parent().find("button:last-of-type");
			Li=preLi;
			inp.attr({"disabled":"disabled"});//某一项进行测试时，禁用所有的测试按钮
			bt.attr({"disabled":"disabled"});//某一项进行测试时，禁用所有的删除和修改按钮
			inp.css({backgroundColor:"grey",opacity:0.6});//某一项进行测试时，测试按钮透明度降低，以示禁用中
			bt.css({backgroundColor:"grey",opacity:0.6});//某一项进行测试时，删除按钮透明度降低			
			var title1= $(this).parent().next().children("span").text();//获取文件名
			ever_name=thisHead=title1;
			move_switch=false;
			checkReviewTime("\\ReviewList.dat",review_arr);
			block_btn4(key_bl4);
			var type = checkType(title1);
			g_type=type;
			var Newstr = readFiles(allPath,title1);
			$("#self_submit").css('display','block');//打开提交按钮
			if(type)//如果是表格
			{
				var r_c=Newstr.substring(Newstr.indexOf('`')+1,Newstr.lastIndexOf('`')).split('`');
				var flag_fill=false,ans_arr_fill,locatePoint;
				if(Newstr.charAt(Newstr.length-1) == '{'){
					ans_arr_fill = cutStr('Ю',Newstr).split('щ');//获取表格答案字符串数组
					locatePoint=rightPoint(Newstr);
					flag_fill=true;
				}
				var rc = r_c[0]*r_c[1];//rc为总数
				num_gird=rc;
				var NewWidth=164*r_c[1];//计算动态长度
				$("#self_test").css('width',NewWidth+'px');//重新指定长度
				var done_flag=false;
				for(var i=0;i<rc;i++){
					done_flag=false;
					if(flag_fill)//寻找考察点
					{
						for(var j=0;j<locatePoint.length;j++){
							if(locatePoint[j] == i)
							{
								locatePoint.splice(j,1);
								$("#self_test").append('<input type="text" name="self_gird" style="border:solid #ffde00 1px">');
								done_flag=true;
								break;
							}
						}
		if(!done_flag) $("#self_test").append('<input type="text" disabled="disabled" name="self_gird" value="'+ans_arr_fill[i]+'">');	
					}
					else
					{
						$("#self_test").append('<input type="text" name="self_gird">');
					}
				}
			}
			else
			{
				$("#self_test").css('width','700px');//重新指定长度
				var el=$('<textarea name="text_str" style="min-height: 400px;min-width: 700px;max-height: 400px; max-width: 700px;font-size:22px"></textarea>');
					$("#self_test").append(el);
					InsertAImage(el,title1);
			}
			scrollToLocate(document.body.scrollHeight);
		});
		function InsertAImage(el,tt){
			var nt="url(img/note/"+tt+".png) no-repeat center";
			el.css("background",nt);
			el.css("background-size","contain");
		}
	//确定修改按钮触发
	$("#alter_btn").click(function(){
		if(confirm("😯确定修改此知识点吗?😯"))
		{
		var newFileTitle=$("#ModF").val().replace(new RegExp("/","gm"),"／").replace(/\\/g,"＼").replace(/\|/g,"∣").trim();//获取修改后的文件名
		if(newFileTitle.length == 0 || newFileTitle == ""){
			alert("😱请输入标题😱");
		}else{
		var lastChar2=newFileTitle.charAt(newFileTitle.length-1);
		if(newFileTitle.length != 0)
			newFileTitle=addAcharacter(lastChar2,newFileTitle);
		var Newstr = readFiles(allPath,Na);
		var head_str=readFiles(toReviewListPath,"toDoList").trim();
		if(head_str != 0)
			checkReviewNumber(Na,newFileTitle.concat('〒'),false);//替换Todolist
			if(ty)
				{
					var checkPoint=Newstr.charAt(Newstr.length-1);
					var addLen=arr_grid_ans.length;
					var decLen=cancel_arr.length;
					var locatePoint='';
					if(checkPoint == '{')
					{
						var orgin2=Newstr.substring(Newstr.lastIndexOf('щ')+1);
						var orgin=orgin2.split('{');
						orgin.pop();
						orgin=uniqueItem(orgin);//去重
						orgin=orgin.join('{').concat('{');
						if(addLen == 0 && decLen == 0){//检查点无修改
							locatePoint=orgin;
						}else if(addLen != 0 && decLen == 0){//添加检查点
							locatePoint=orgin.concat(arr_grid_ans.join('{').concat('{'));
						}else if(addLen != 0 && decLen != 0){//既添加检查点,又减少检查点
							locatePoint=orgin.concat(arr_grid_ans.join('{').concat('{'));
							for(var i=0;i<cancel_arr.length;i++)
								locatePoint=locatePoint.replace(cancel_arr[i],'');
						}else if(addLen == 0 && decLen != 0){//减少检查点
							for(var i=0;i<cancel_arr.length;i++)
								locatePoint=orgin.replace(cancel_arr[i],'');
						}
					}
					else
					{
						if(addLen != 0 && decLen == 0){//添加检查点
							locatePoint=arr_grid_ans.join('{').concat('{');
						}else if(addLen != 0 && decLen != 0){//既添加检查点,又减少检查点
							locatePoint=arr_grid_ans.join('{').concat('{');
							for(var i=0;i<cancel_arr.length;i++)
								locatePoint=locatePoint.replace(cancel_arr[i],'');
						}
					}
					for(var i=1;i<locatePoint.length;i++){//删除多余的{
						if(locatePoint.charAt(i-1) == locatePoint.charAt(i) && locatePoint.charAt(i) =='{'){
							var temp=locatePoint;
							locatePoint=locatePoint.substring(0,i-1);
							temp=temp.substring(i);
							locatePoint=locatePoint.concat(temp);
						}
					}
					ModifyAFile("",newFileTitle,ty,uc,r2,c2,locatePoint);//表格类型修改
				}
			else
				{
					var inputCT = $("#alterFrame textarea").text();//修改过的文本内容
					if(inputCT.length == 0 || inputCT == '' || inputCT.replace(/(^s*)|(s*$)/g,'').length == 0)
						alert('😥内容是空的，无法修改😥');
					else
						ModifyAFile(inputCT,newFileTitle,ty,0,0,0,'');	
				}
				newTitleLi.text(newFileTitle);				
				alt_inp.removeAttr('disabled');
				alt_btn.removeAttr('disabled');
				alt_btn0.css({backgroundColor:"blueviolet",opacity:1});
				alt_btn1.css({backgroundColor:"#f44336",opacity:1});
				alt_inp.css({backgroundColor:"skyblue",opacity:1});
				$("#alterFrame").css('display','none');
				$("#alterFrameTable").css('display','none');
				$("#ModF").remove();
				$("#alterFrameTable *").remove();
				scrollToLocate(alt_btn_offset_li);
				$(this).css('display','none');
				$("#roll_ans_btn").css('display','none');
				dACP='';
				alert('🎉修改成功🎉');
		}
	}
	});
	//关闭修改框
	$("#roll_ans_btn").click(function(){
		alt_inp.removeAttr('disabled');
		alt_btn.removeAttr('disabled');
		alt_btn0.css({backgroundColor:"blueviolet",opacity:1});
		alt_btn1.css({backgroundColor:"#f44336",opacity:1});
		alt_inp.css({backgroundColor:"skyblue",opacity:1});
		$("#alterFrame").css('display','none');
		$("#alterFrameTable").css('display','none');
		$("#ModF").remove();
		$("#alterFrameTable *").remove();
		scrollToLocate(alt_btn_offset_li);
		$(this).css('display','none');
		$("#alter_btn").css('display','none');
	});
		//定时检查更新开启
		function openCheckReviewListTimer(){
			if(reviewListExistsLen != 0)//有复习文件就开启定时检查模式
			reviewTimer();
		}
		//获取文件名方法
		function ShowFolderFileList(folderspec)  
		{  
			var  f,f1,fc,s;  
			f = fso.GetFolder(folderspec);  
			fc = new Enumerator(f.files);  
			s = [];  
		for(var i=0;!fc.atEnd();fc.moveNext(),i++)  
			{  
            s[i]=fc.item();  
			}  
			return(s);  
		} 
		//读取Review文本方法
		function readReviewFiles(fp,type){
			var rd=fso.OpenTextFile(reviewPath.concat(fp),1);
			var str;
			if(type)
				str=rd.ReadAll();
			else
				str=rd.ReadLine();
			rd.Close();
			return str;
		}
		//获取文件名数组里面仍是对象形式
		function getTitles(FF)
		{
			var ark=[];
			for(var h=0;h<FF.length;h++)
			{
				var kk;
				kk=kk+FF[h]+"|";
				var a2=kk.lastIndexOf("t")-3;
				var a1=kk.lastIndexOf("\\")+1;
				ark[h]=kk.substring(a1,a2);
			}
			return ark;
		}
	//初始化待复习方法
	function initTip(){
		var hstr=readFiles(toReviewListPath,"toDoList").trim();
		if(hstr == 0){
			$("#glow_tip").text(0);
			$("#glow_tip").css('border','dashed lime 3px');
		}
		else
		{
			var arr=hstr.split('〒');
			alterFloatBall(arr.length-1);
		}
	}
	//加载标题列表方法
	function loadStudyList(){
		for(var i=0;i<url_length;i++){
			var li = $("<li><span>"+arr[i]+"</span></li>");
			var li2 = $("<div><input type='button' value='测试'name="+arr[i]+"></input><input type='button' value='记忆'name="+arr[i]+"></input><button value="+arr[i]+">删除</button><button  value="+arr[i]+">修改</button><div>");
			$("#box>ul").prepend(li);
			$("#box>ul").prepend(li2);
		}
	}
	var randomID="cover";
	//改变背景图片方法
	function changeBackgroundImage(){
		var cnt=randomNum(1,12);
		$('body').css('background','url(./img/'+cnt+'.jpeg) no-repeat center 0 fixed');
		$('body').css('background-size','cover');
		randomID = setInterval(function(){
			$('body').slideDown(500,function(){
				cnt=randomNum(1,12);
				$(this).css('background','url(./img/'+cnt+'.jpeg) no-repeat center 0 fixed');
				$(this).css('background-size','cover');
			});
		},7200000);
	}
	//初始化复习方法
	function initReview(){
			//获取MemorizedList名单
		if(reviewListExistsLen != 0)//如果不为空
			{
				var review_arr=readReviewFiles("\\MemorizedList.dat",false).split('щ');//获取MemorizedList名单数组
				var len=arr.length;
				var cnt=0;
				for(var i=0;i<len;i++){
					for(var j=0;j<review_arr.length;j++)
					{
						if(arr[i] == review_arr[j])
						{
							var el_input = $("#box>ul>div").eq(len-i-1).children("input:last-of-type");
							DisABtn(el_input,"复习");
							cnt++;
						}
					}
					if(cnt == review_arr.length)
						break;
				}
				thisHead='';
				move_switch=false;
				checkReviewTime("\\ReviewList.dat",review_arr);
			}
		}
		//控制页面的缩放比例
function zoomControl(z){
	var t = window.devicePixelRatio;
	if(t != z){
		var ele = document.body;
		ele.style.transform="scale("+z+")";
		ele.style.transformOrigin="top left";
	}
}		
	
		//定时检查复习方法
		function reviewTimer(){
			var _timeId = setInterval(function(){
			var mlist = readReviewFiles("\\MemorizedList.dat",false).split('щ');
			thisHead='';
			move_switch=false;
			checkReviewTime("\\ReviewList.dat",mlist);
			},150000);//每隔2.5min就检查一次
		}
		var NRT,tipTitle,tip_phase;
		
	function calcInterval(ph,EF){//计算复习间隔 ph为阶段数,EF为遗忘因子
		if(ph==1) return 0.0025;
		else if(ph == 2) return PresentTimeCheck(); 
		else return ((ph-1)*EF).toFixed(3);
	}
	function PresentTimeCheck(){
		var  date=new Date();
		return (date.getHours() >= 19 && date.getMinutes() >= 0)?0.5:0.125;
	}	
		//检查复习时间方法
	function checkReviewTime(ftp,tmpArr){//tmpArr为复习数组
			var list = readReviewFiles(ftp,true);//获得文件数据
			var strListArr=list.split('\r\n');
			for(var i=0;i<strListArr.length;i++)
			{
				if(strListArr[i].length==0) continue;
				var ra=tmpArr;
				for(var j=0;j<ra.length-1;j++){
					var na_str=strListArr[i].substring(0,ra[j].length);//获取标题
					var flag3=(strListArr[i].charAt(ra[j].length) == '`');//确认是此标题的保险
					if(!flag3) continue;
					var strArr=strListArr[i].trim();
					var createTime=strArr.substring(strListArr[i].lastIndexOf('`')+1,strListArr[i].lastIndexOf('щ'));//创建时间的获取
					var pn=parseInt(strArr.substring(strListArr[i].lastIndexOf('щ')+1,strListArr[i].lastIndexOf('э')));//获取此条字符串中的阶段
					var lastReview=strArr.substring(strListArr[i].lastIndexOf('И')+1);//上次复习时间
					var EF=parseFloat(strArr.substring(strListArr[i].lastIndexOf('э')+1,strListArr[i].lastIndexOf('И')))//获取当前因子
					var now = +new Date();
					var LR = +new Date(lastReview);
					var cI=calcInterval(pn,EF)*86400000;
					var next=parseFloat((cI+LR-now)/60000).toFixed(3);
					if(tipTitle == na_str){
						tip_phase=pn;
						NRT=next;
					}
					if(!move_switch && na_str == thisHead){
						key_bl4=(next>0);
					}
					if(!move_switch){
						if(na_str == ra[j] && flag3)
						{
							if(next<=0){
								enableReviewBtn(na_str);//激活按钮
							}else{
								checkReviewNumber(na_str,'',false);
							}
							ra.splice(j,1);
							j--;
						}
					}	
				}
			}
		}
		
			//写Review文件的方法
		function writeReviewFiles(folder,pathr,type,st){
			var ml=fso.createtextfile(folder.concat(pathr),true);
			if(type)
				ml.WriteLine(st);
			else
				ml.Write(st);
			ml.close();
		}
	//数组去重
	function uniqueItem(array){
		var temp = {}, r = [], len = array.length, val, type;
    for (var i = 0; i < len; i++) {
        val = array[i];
        type = typeof val;
        if (!temp[val]) {
            temp[val] = [type];
            r.push(val);
        } else if(temp[val].indexOf(type) < 0) {
            temp[val].push(type);
            r.push(val);
        }
    }
    return r;
	}
		//禁用按钮方法
	function DisABtn(btn,goal){//btn为li标签上的记忆(复习)按钮
		btn.val(goal);
		btn.attr({"disabled":"disabled"});
		btn.css({backgroundColor:"grey",opacity:0.6});
		//放置一个透明标签
		btn.before('<div style="width:60px;height:28px;font-size:18px;float:right;position:absolute;left:70px;top:0px;border:none;background-color:rgba(255,255,255,0);z-index:100;"></div>');
	}
			//获取时间字符串的方法
		function getStrTime(){
			var today = new Date();
			var month = today.getMonth() + 1;
			month = month < 10 ? '0'+month : month;
			var day = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
			var hours = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
			var mins = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
			var secs = today.getSeconds() < 10 ? '0'+today.getSeconds() : today.getSeconds();
			var now1 = today.getFullYear() + '/' + month + '/' + day + " " + hours + ":" + mins + ":" + secs;
			return now1;
		}
		//播放音效方法
		function playSoundEffect(btnType,min,max){//min为最小随机数,max为最大随机数
			var combineStr=btnType.concat(randomNum(min,max),'.mp3');
			$('body').append('<embed src="sound/'+combineStr+'" autostart="true" hidden="true" loop="false" />');
		}
		function alterFloatBall(num){
			$("#glow_tip").text(num);
			if(num > 0){
				$("#glow_tip").css('border','dashed red 3px');
				$("#glow_tip").css('boxShadow','rgb(11, 234, 235) 0px 0px 18px inset');
			}
			else{
				num=0;
				$("#glow_tip").removeAttr('style','boxShadow');
				$("#glow_tip").css('border','dashed lime 3px');
			}	
			$("#glow_tip").text(num);
		}
		//判断待复习的数量
		function checkReviewNumber(title,rp,type){
			var num=modifyToDoList(title,rp,type);
			alterFloatBall(num);
		}
			//更新ReviewList和MemorizedList的方法
		function updateRandM(purpose,title,newHead){
			var el = findBtn(title);
			el=el.parent().prev().children("input:last-of-type");
			if(purpose == "记忆"){
				reviewListExists=ShowFolderFileList(reviewPath);
				reviewListExistsLen=getTitles(reviewListExists).length;//实时跟踪ReviewList文件的存在情况
				if(reviewListExistsLen == 0)//如果没有文件那就创建一个
				{
					var newt = title.concat('щ');
					writeReviewFiles(reviewPath,"\\MemorizedList.dat",false,newt);
					var str3=title.concat("`",getStrTime(),"щ",1,"э",2.5,"И",0);//初始待复习文件
					writeReviewFiles(reviewPath,"\\ReviewList.dat",true,str3);
				}
				else
				{
					var list2 = readReviewFiles("\\ReviewList.dat",true);//获得文件数据
					var mlist = readReviewFiles("\\MemorizedList.dat",false);
					var nmlist = mlist.concat(title,"щ");
					writeReviewFiles(reviewPath,"\\MemorizedList.dat",false,nmlist);
					var list3=list2.concat(title,'`',getStrTime(),"щ",1,"э",2.5,"И",0);
					writeReviewFiles(reviewPath,"\\ReviewList.dat",true,list3);
				}
				DisABtn(el,"复习");
			}else{
				var list = readReviewFiles("\\ReviewList.dat",true);//获得文件数据
				var Mlist = readReviewFiles("\\MemorizedList.dat",false);
				var strListArr=list.split('\r\n');
				for(var j=0;j<strListArr.length;j++){
					var cutT=strListArr[j].substring(0,title.length);
					var locateChar=strListArr[j].charAt(title.length);
					if(locateChar == '`' && cutT == title)//如果截取出的标题等于所给标题，说明此条记录需要被删除
					{
						if(purpose == "删除"){
							strListArr.splice(j,1);
							Mlist = Mlist.replace(title.concat('щ'),'').trim();//从MemorizedList中删除
							writeReviewFiles(reviewPath,"\\MemorizedList.dat",false,Mlist);
							checkReviewNumber(title,'',false);
							el.val("记忆");
							el.removeAttr('disabled');
							el.css('boxShadow','');
							el.css({backgroundColor:"#6E7B6C",opacity:1});
						}else{//替换
							strListArr[j]=strListArr[j].replace(title,newHead);
							Mlist = Mlist.replace(title.concat('щ'),newHead.concat('щ')).trim();//从MemorizedList中删除
							writeReviewFiles(reviewPath,"\\MemorizedList.dat",false,Mlist);
						}	
						break;	
					}	
				}
				for(var i=0;i<strListArr.length;i++)
						if(strListArr[i].length == 0 || strListArr[i] == "\r\n" || strListArr[i] == "")
							strListArr.splice(i,1);
				writeReviewFiles(reviewPath,"\\ReviewList.dat",true,strListArr.join('\r\n'));
			}
		}
		//修改待复习文件的方法
		function modifyToDoList(title,replacement,type){//标题,修改类型
			var head_str=readFiles(toReviewListPath,"toDoList").trim();
			var arr2;
			if(head_str == 0 && type){
				writeReviewFiles(toReviewListPath,"\\toDoList.dat",false,title.concat('〒'));
				head_str=readFiles(toReviewListPath,"toDoList");
			}
			else
			{
				if(type)
				{
					writeReviewFiles(toReviewListPath,"\\toDoList.dat",false,head_str.concat(title.concat('〒')));
					head_str=readFiles(toReviewListPath,"toDoList");
				}
				else
				{
					head_str=head_str.replace(title.concat('〒'),replacement);
				}
			}
			arr2=head_str.split('〒');
			var NewArr=uniqueItem(arr2);
			var newStr = NewArr.join('〒').trim();
			writeReviewFiles(toReviewListPath,"\\toDoList.dat",false,newStr);
			var NAL=NewArr.length-1;
			if(NAL == 0)
				writeReviewFiles(toReviewListPath,"\\toDoList.dat",false,0);
			return NAL;
		}
		//启用复习按钮
		function enableReviewBtn(k)
		{
			var btn = findBtn(k);
			btn=btn.parent().prev();
			btn.children("input:last-of-type").css({backgroundColor:"#6E7B6C",opacity:1});
			btn.children("input:last-of-type").parent().next().css('boxShadow','0 0 30px #f00');//标签发光
			checkReviewNumber(k,'',true);
		}
		
		//寻找对应标题li元素方法
		function findBtn(Rq_n)
		{
		 var el,k;
			for(var i=0;i<arr.length;i++){
				 el=$("#box  ul  li").eq(i).children("span");
				var va=el.text().trim();
				if(va == Rq_n)
				{
					k=el;
					break;
				}	
			}
			return k;
		}		
		//sologan显示方法
		function localTime(rect){
		var d,h,m,s,str;
			var flash = setInterval(function()
			{
				var now = +new Date();
				var input = +new Date(rect);
				var times = (input-now)/1000;
				d = parseInt(times/60/60/24);
				d = d < 10 ? '0' + d: d; 
				h = parseInt(times/60/60%24);
				h = h < 10 ? '0' + h: h; 
				m = parseInt(times/60%60);
				m = m < 10 ? '0' + m: m;
				s = parseInt(times%60);
				s = s < 10 ? '0' + s: s; 
				str="☢️距离"+study_slogan+"还剩 "+d+"天 "+h+"小时 "+m+"分 "+s+"秒";
				$("#time_sologan").text(str);
			},1000);
		
		}
	//随机数生成
	function randomNum(minNum,maxNum){ 
		switch(arguments.length){ 
        case 1: return parseInt(Math.random()*minNum+1,10);break; 
        case 2: return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);break; 
        default: return 0;break; 
			} 
		} 
		//删除按钮----单击事件
		$("#box>ul").on("click","button:first-of-type",function(){
			var name = $(this).parent().next().children("span").text();//button的value值就是标题
			if(confirm("😭确定永久删除此知识点吗？😭"))
			{
			playSoundEffect('D',1,3);//播放随机音效
			$(this).parent().animate({right:'500px'},100).animate({right:'-200px',top:'-800px'},400).fadeOut(function(){
				$(this).remove();
			});
			$(this).parent().next().animate({right:'2800px'},300).fadeOut(600,function(){
				$(this).remove();//移除li标签
			});
			updateRandM("删除",name,"");//删除复习文件
			deleteAFile(name);//删除文件
			var FileName2=ShowFolderFileList(allPath);
			var len=getTitles(FileName2).length;
			setTimeout(function(){if(len == 0)
				$("#tip").slideDown().text("还没有知识点哦，赶快创建一个吧~😜");},"150");
			}
		});
		//删除文件方法
		function deleteAFile(fileName){
			remove = fso.GetFile(allPath+"\\"+fileName+".dat");
			remove.Delete();  
		}
		//考察点触发/取消方法
		var cancel_arr=[];
		function GA5(num){
			if(el_ex != num)
				grid_cnt=0;
			if(grid_cnt >= 3)
			{
				grid_cnt=0;
				var el=(getPageName() == "02_CreatePage.html")?$("#table_list > input").eq(num):$("#alterFrameTable>input").eq(num);
				var select_ele=el.prop("style").borderStyle;
				var OpQ=('solid' == select_ele)?"设置":"取消";
				if(confirm("😯确定>>"+OpQ+"<<此条为考察点？😯")){
					if(OpQ == '设置')
					{
						arr_grid_ans[arr_grid_ans.length++]=num;
						el.css('border','dashed lime 1px');
					}
					else
					{
						if(dACP.length != 0)
							cancel_arr[cancel_arr.length++]=num;
						else
							arr_grid_ans.splice(arr_grid_ans.indexOf(num),1);
						el.css('border','solid #e2fff8 1px');
					}
					arr_grid_ans=uniqueItem(arr_grid_ans);
				}
			}
			else
			{
				grid_cnt++;
				el_ex=num;
			}
		}
		//检查文件是否存在
	function checkFileExists(fileName){
		var arr2=[];
		arr2=getTitles(FileName);
		for(var i=0;i<arr2.length;i++)
			if(arr2[i] == fileName)
					return true;
		return false;
	}
	//给标题补结束符的方法
		function addAcharacter(lch,title){
			if(lch == '.')
				title=title.substring(0,title.length-1).concat('。').trim();
			else if(lch == '?' )
				title=title.substring(0,title.length-1).concat('？').trim();
			else if(lch == ';' )
				title=title.substring(0,title.length-1).concat('；').trim();	
			else if(lch != '。' && lch != '？' && lch != '；')
				title=title.concat('。').trim();
			return title;	
		}
		//修改文件方法
		function ModifyAFile(content,text_t,type2,t4,r4,c4,keyPoint){
			deleteAFile(Na);
			updateRandM("修改",Na,text_t);//更新复习文件
			var f1 = fso.createtextfile(allPath+"\\"+text_t+".dat",true);//创建文件,利用 \\ 防止转义解析
			if(type2)
			{
			f1.Write("Ю"+text_t+"`"+r4+"`"+c4+"`"+"Ю");
			var content2;
			for(var i=0;i<t4;i++){
				content2 = $("#alterFrameTable > input").eq(i).val();
					f1.Write(content2+"щ");
				}
			if(keyPoint == '{')//考察点残留清除
				keyPoint='';
			f1.Write(keyPoint);
			}
			else
			{
				f1.Write("э"+text_t+"э");//标题
				f1.WriteLine(content);//增加换行符
			}
			f1.close;
		}
		//检查类型
		function checkType(head){//真为表格，假为文本域
			var str=readFiles(allPath,head);
			return (str.charAt(0)=="Ю")?true:false;
		}
		//读取文本方法
		function readFiles(ap,head){
			var str;
			var rd;
			rd=fso.OpenTextFile(ap+"\\"+head+".dat",1);
			str=rd.ReadAll();//ReadAll用于读取所有的文本内容
			rd.Close();
			return str;
		}
		//字符串截取方法
		function cutStr(keyChar,oldStr){//keyChar:选取唯一的关键字符 oldStr:原字符串
			var index=oldStr.lastIndexOf(keyChar);
			oldStr=oldStr.substring(index+1);
			return oldStr;
		}
		
		function rightPoint(str){
			var lp;
			if(str.charAt(str.lastIndexOf('щ')+1) != '{')
				lp=str.substring(str.lastIndexOf('щ')+1).split('{');
			else
				lp=str.substring(str.lastIndexOf('щ')+2).split('{');
			lp.pop();
			return lp;
		}
		
	
//延时滚动到页面底部
function scrollToLocate(dis){
    setTimeout(function(){
	window.scrollTo(0,dis);
	},378);
}
	//文本分析模式选择
	function DisplayMode(){
		var ch="diffChars";
			var a=layer.confirm('请您选择分析模式',{
			shade:false,
			skin: 'layui-layer-molv' ,
			anim: 1 ,
			icon: 6 ,
			title:'模式选择',
          btn: ['逐字','逐词','逐行']
		  ,btn3:function(index){//使用cancel回调必须再此加上{}参考https://www.cnblogs.com/jiqing9006/p/13404916.html    https://blog.csdn.net/u012764444/article/details/106720620?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~aggregatepage~first_rank_ecpm_v1~rank_v31_ecpm-4-106720620.pc_agg_new_rank&utm_term=layer.confirm+%E5%9B%9E%E8%B0%83&spm=1000.2123.3001.4430
			ch= "diffLines";
			changed(ch);
			layer.close(index);
			}
		  },function(index){
			ch= "diffChars";
			changed(ch);
			layer.close(index);	
		  },function(index){
			ch= "diffWords";
			changed(ch);
			layer.close(index); 
			});
		}		
		
/****************************************文本域字符对比实现方法区****************************************************/
var result = $(".changeContent  #res");//结果
function changed(mode) {//文本对比方法
var a=newTxt;// 用户输入内容
var b=Newstr3;// 正确答案
var diff = JsDiff[mode](a, b);
var fragment = document.createDocumentFragment();
	for (var i=0; i < diff.length; i++) {
		if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
			var swap = diff[i];
			diff[i] = diff[i + 1];
			diff[i + 1] = swap;
		}
		var node;
		if (diff[i].removed) {
			node = document.createElement('span');//输入错误部分
			node.style.color="black";//必须在这里改变css样式，其他地方不起作用
			node.style.opacity="0.2";
			node.style.textDecoration="line-through";
			node.style.background="#FF0000";
			node.appendChild(document.createTextNode(diff[i].value));
		} else if (diff[i].added) {
			node = document.createElement('span');//文本缺失部分
			node.style.borderStyle="solid";
			node.style.borderColor="green";
			node.style.borderWidth="1px";
			node.style.background="#eaf2c2";
			node.style.color="#FF5511";
			node.appendChild(document.createTextNode(diff[i].value));
		} else {
			node = document.createTextNode(diff[i].value);
		}
		fragment.appendChild(node);
	}
	result.textContent = '';
	result.append(fragment);
	$(".changeContent").css('display','block');
	$("#res").css('display','block');
	$("#res").css('overflow-y','scroll');
	scrollToLocate(document.body.scrollHeight);
}

//跟随时钟
function followClock(){
var cnt=min=hour=0;
	var Int=setInterval(function(){
		cnt++;
		if(cnt == 60)
		{
			cnt=0;
			min++;
		}
		else if(min == 60)
		{
			min=0;
			hour++;
		}
		$("#right_clock").text("用时 "+hour+" 时 "+min+" 分 "+cnt+" 秒");
	},1000);
	return Int;
}

//返回首页
	$("#return_index").click(function(){
		window.location.href="01_index.html";
	});
		//生成div节点
		function generateDiv(a_length){
			for(var k=0;k<a_length;k++)
				{
					var el=$('<div id='+"GT"+k+'></div>');
					$("#area_test").append(el);
				}
		}
//插入内容
	function insertContent(title,n){//传入文件标题，遍历编号	
		var str=readFiles(allPath,title);
		//插入标题
		$("#GT"+n).append("<p><span style='font-size:23px;color:aquamarine;background:silver'>"+title+"</span></p>");
		if(checkType(title))//表格
			{
				var a=str.indexOf('`');
				var b=str.lastIndexOf('`');
				str=str.slice(a,b);
				var c=str.indexOf('`')+1;
				var d=str.substring(c);
				var final_pos=d.split('`');
				rc[n]=[];
				for(var v=0;v<2;v++)
					rc[n][v]=final_pos[v];
				//插入表格
				var z=final_pos[0]*final_pos[1];//行*列
				 numOfgird[n]=z;
				var width_g=160*final_pos[1]+4*final_pos[1];
				$("#GT"+n).css('width',width_g+'px');//动态指定div的宽度
				for(var i=0;i<z;i++){
					var el=$('<input type="text" name="gird_gen">');
					$("#GT"+n).append(el);
				}
			}
			else//内容
			{
				var el=$('<textarea name="text_str" style="min-height: 500px;min-width: 600px;max-height: 500px; max-width: 600px;font-size:21px;"></textarea>');
				$("#GT"+n).append(el);
			}
}
		//随机执行
	function randomOperate(arr1,cn,ul){
			while(arr1.length != cn)
				{
					loop_num=cn-arr1.length;
					for(var u=0;u<loop_num;u++)
						arr1.push(randomNum(0,ul-1));
					arr1=uniqueItem(arr1);
				}
			num_arr=arr1;
		}
	
		//表格处理,返回一个表格答案数组
		function girdProcess(n,title,st){
			st=st.replace('Ю'+title[n].trim()+'`'+rc[n][0]+'`'+rc[n][1]+'`'+'Ю','').replace(/\,/g,'').replace(/\，/g,'').replace(/\(/g,'').replace(/\（/g,'').replace(/\)/g,'').replace(/\）/g,'').replace(/ /g,'').replace(/\。/g,'').replace(/的/g,'').replace(/\//g,'').trim();//符号替换需要进行转义
			var infoOfgird=st.split('щ');
			return infoOfgird;
		}
function getPageName(){
	var strUrl=location.href;
	var arrUrl=strUrl.split("/");
	var strPage=arrUrl[arrUrl.length-1];
	return strPage;
}
