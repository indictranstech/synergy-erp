frappe.pages['open-office'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Open Meeting',
		single_column: true
	});
	$("<div class='apllybtn' style='min-height: 20px;padding-left: 20px;padding-right: 20px;align:right;'  align='right'></div><div class='assignt' style='min-height: 20px;padding-left: 20px;padding-right: 20px;padding-bottom: 20px;'></div>").appendTo($(wrapper).find('.layout-main-section'));
	new frappe.assign(wrapper);
}


frappe.assign = Class.extend({
	init: function(wrapper) {
		this.wrapper = wrapper;
		this.body = $(this.wrapper).find(".assignt");
		//this.make();
		this.setup_page();
	},
	setup_page: function(){
		var me = this;
		$(me.wrapper).find('.assignt').empty();
		frappe.call({
				method:"church_ministry.church_ministry.page.convert_invitees_and.convert_invitees_and.loadrec",
				args:{
	        	},
				callback: function(r) {
					if (r.message){
						window.open('./files/video.html');
						//console.log(r.message);
						/*cntnt="<audio id='speech' src='file:///home/gangadhar/Desktop/rec_2_stream_4_2015_04_02_19_21_15_WAVE.wav' controls='controls' autoplay='autoplay'>Your browser does not support the audio element.</audio>"
						console.log(cntnt);
						w=window.open('');
						w.document.write(cntnt);
						w.document.close();	*/					
						h1=''	            
			            for (i=0;i<r.message.length;i++){
			                        h1 += '<tr >'
			                        h1 += '<td style="padding=0px;width=100%">'+i+'</td>'
			                        h1 += "<td style='padding=0px;width=100%'><a href='./files/"+r.message[i]+"' target='_blank'>"+r.message[i]+"</a></td></tr>"
			                        //h1 += '<td style="padding=0px;width=100%"><audio id="speech" src="/home/gangadhar/Desktop/red5/webapps/openmeetings/streams/1/'+r.message[i]+'" controls="controls">'+r.message[i]+'</audio></td>'                  
			                        //h1 += "<td style='padding=0px;width=100%'><input type='checkbox' data-name='"+r.message[i]+"' ></td></tr>"
			                        
			            }
			            $('<br><button  class="btn btn-primary btn-search" id="test">Go To Meeting</button><br>').appendTo($(me.wrapper).find('.apllybtn'));    
			            h="<br><table class='members1' border='1' style='width:100%;background-color: #f9f9f9;'><tr><td style='padding=0px;width=100%''><b>Sr No.</b></td><td><b>Recording</b></td></tr>"+h1+"<tbody>";	               
			            $(h).appendTo($(me.wrapper).find('.assignt'))
					    $('.apllybtn').find('.btn-search').click(function() {
						    window.open("http://localhost:5080/openmeetings");
						})
					}
			 	}                
	    });	
	}	
});
