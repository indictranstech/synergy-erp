// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext.projects");

cur_frm.add_fetch("project", "company", "company");

cur_frm.add_fetch("cell", "pcf", "pcf");
cur_frm.add_fetch("cell", "church", "church");
cur_frm.add_fetch("cell", "church_group", "church_group");
cur_frm.add_fetch("cell", "region", "region");
cur_frm.add_fetch("cell", "zone", "zone");
cur_frm.add_fetch("cell", "senior_cell", "senior_cell");

cur_frm.add_fetch("senior_cell", "pcf", "pcf");
cur_frm.add_fetch("senior_cell", "church", "church");
cur_frm.add_fetch("senior_cell", "church_group", "church_group");
cur_frm.add_fetch("senior_cell", "region", "region");
cur_frm.add_fetch("senior_cell", "zone", "zone");


cur_frm.add_fetch("pcf", "church", "church");
cur_frm.add_fetch("pcf", "church_group", "church_group");
cur_frm.add_fetch("pcf", "region", "region");
cur_frm.add_fetch("pcf", "zone", "zone");

cur_frm.add_fetch("church", "church_group", "church_group");
cur_frm.add_fetch("church", "region", "region");
cur_frm.add_fetch("church", "zone", "zone");

cur_frm.add_fetch("church_group", "region", "region");
cur_frm.add_fetch("church_group", "zone", "zone");

cur_frm.add_fetch("zone", "region", "region");

erpnext.projects.Task = frappe.ui.form.Controller.extend({

	setup: function() {
		this.frm.fields_dict.project.get_query = function() {
			return {
				query: "erpnext.projects.doctype.task.task.get_project"
			}
		};
	},

	project: function() {
		if(this.frm.doc.project) {
			return get_server_fields('get_project_details', '','', this.frm.doc, this.frm.doc.doctype, 
				this.frm.doc.name, 1);
		}
	},

	validate: function() {
		this.frm.doc.project && frappe.model.remove_from_locals("Project",
			this.frm.doc.project);
	},

    // exp_start_date: function(doc) {
    //     if(doc.exp_start_date) {
    //         var date = frappe.datetime.get_today()
    //         if(doc.exp_start_date < date){
    //             msgprint("Expected Start Date should be todays or greater than todays date.");
    //             // throw "Check Start Date"
    //         }
    //     }
    // },

    // exp_end_date: function(doc) {
    //     if(doc.exp_start_date) {
    //         if(doc.exp_start_date > doc.exp_end_date){
    //             msgprint("End Date should be greater than start date.");
    //             // throw "Check Date";
    //         }       
    //     }
    // },

    onload : function(){
        if (in_list(user_roles, "Cell Leader")){
            set_field_permlevel('cell',1);
            set_field_permlevel('senior_cell',2);
            set_field_permlevel('church',2);
            set_field_permlevel('church_group',2);
            set_field_permlevel('pcf',2);
            set_field_permlevel('zone',2);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "Senior Cell Leader")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',1);
            set_field_permlevel('church',2);
            set_field_permlevel('church_group',2);
            set_field_permlevel('pcf',2);
            set_field_permlevel('zone',2);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "PCF Leader")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',0);
            set_field_permlevel('pcf',1);
            set_field_permlevel('church',2);
            set_field_permlevel('church_group',2);
            set_field_permlevel('zone',2);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "Church Pastor")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',0);
            set_field_permlevel('pcf',0);
            set_field_permlevel('church',1);
            set_field_permlevel('church_group',2);
            set_field_permlevel('zone',2);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "Group Church Pastor")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',0);
            set_field_permlevel('pcf',0);
            set_field_permlevel('church',0);
            set_field_permlevel('church_group',1);
            set_field_permlevel('zone',2);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "Zonal Pastor")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',0);
            set_field_permlevel('pcf',0);
            set_field_permlevel('church',0);
            set_field_permlevel('church_group',0);
            set_field_permlevel('zone',1);
            set_field_permlevel('region',2);
        }
        else if(in_list(user_roles, "Regional Pastor")){
            set_field_permlevel('cell',0);
            set_field_permlevel('senior_cell',0);
            set_field_permlevel('pcf',0);
            set_field_permlevel('church',0);
            set_field_permlevel('church_group',0);
            set_field_permlevel('zone',0);
            set_field_permlevel('region',1);
        } 
    },
});

cur_frm.cscript = new erpnext.projects.Task({frm: cur_frm});
