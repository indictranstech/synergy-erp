// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.add_fetch('employee', 'company', 'company');
cur_frm.add_fetch('employee', 'employee_name', 'employee_name');

cur_frm.cscript.onload = function(doc,cdt,cdn){
	if(!doc.status)
		set_multiple(cdt,cdn,{status:'Draft'});
	if(doc.amended_from && doc.__islocal) {
		doc.status = "Draft";
	}

	// if (in_list(user_roles, "Employee")){
 //    	set_field_permlevel('score_by_hr_team',1);
 //    	set_field_permlevel('hr_score_earned',1);
 //    }
 //    else if (in_list(user_roles, "HR User")){
 //    	set_field_permlevel('score',1);
 //    }
}

cur_frm.cscript.onload_post_render = function(doc,cdt,cdn){
	if(doc.__islocal && doc.employee==frappe.defaults.get_user_default("employee")) {
		cur_frm.set_value("employee", "");
		cur_frm.set_value("employee_name", "")
	}
}

cur_frm.cscript.refresh = function(doc,cdt,cdn){

}

cur_frm.cscript.kra_template = function(doc, dt, dn) {
	frappe.model.map_current_doc({
		method: "erpnext.hr.doctype.appraisal.appraisal.fetch_appraisal_template",
		source_name: cur_frm.doc.kra_template,
		frm: cur_frm
	});
}

cur_frm.cscript.calculate_total_score = function(doc,cdt,cdn){
	//return get_server_fields('calculate_total','','',doc,cdt,cdn,1);
	var val = doc.goals || [];
	var total =0;
	var total_hr=0;
	for(var i = 0; i<val.length; i++){
		total = flt(total)+flt(val[i].score_earned)
	}
	doc.total_score = flt(total)
	refresh_field('total_score')

	for(var i = 0; i<val.length; i++){
		total_hr = flt(total_hr)+flt(val[i].hr_score_earned)
	}
	doc.total_by_hr = flt(total_hr)
	refresh_field('total_by_hr')
}

cur_frm.cscript.score = function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	if (d.score){
		if (flt(d.score) > 5) {
			msgprint(__("Score must be less than or equal to 5"));
			d.score = 0;
			refresh_field('score', d.name, 'goals');
		}
		total = flt(d.per_weightage*d.score)/100;
		d.score_earned = total.toPrecision(2);
		refresh_field('score_earned', d.name, 'goals');
	}
	else{
		d.score_earned = 0;
		refresh_field('score_earned', d.name, 'goals');
	}
	cur_frm.cscript.calculate_total(doc,cdt,cdn);
}

cur_frm.cscript.score_by_hr_team = function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	if (d.score_by_hr_team){
		if (flt(d.score_by_hr_team) > 5) {
			msgprint(__("Score must be less than or equal to 5"));
			d.score_by_hr_team = 0;
			refresh_field('score_by_hr_team', d.name, 'goals');
		}
		total = flt(d.per_weightage*d.score_by_hr_team)/100;
		d.hr_score_earned = total.toPrecision(2);
		refresh_field('hr_score_earned', d.name, 'goals');
	}
	else{
		d.hr_score_earned = 0;
		refresh_field('hr_score_earned', d.name, 'goals');
	}
	cur_frm.cscript.calculate_total(doc,cdt,cdn);
}

cur_frm.cscript.calculate_total = function(doc,cdt,cdn){
	var val = doc.goals || [];
	var total =0;
	var total_hr=0;
	for(var i = 0; i<val.length; i++){
		total = flt(total)+flt(val[i].score_earned);
	}
	doc.total_score = flt(total);
	refresh_field('total_score');

	for(var i = 0; i<val.length; i++){
		total_hr = flt(total_hr)+flt(val[i].hr_score_earned);
	}
	doc.total_by_hr = flt(total_hr);
	refresh_field('total_by_hr');
}

cur_frm.fields_dict.employee.get_query = function(doc,cdt,cdn) {
	return{	query: "erpnext.controllers.queries.employee_query" }
}
