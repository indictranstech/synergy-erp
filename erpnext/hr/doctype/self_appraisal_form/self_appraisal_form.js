cur_frm.add_fetch("employee_id", "employee_name", "employee_name");
frappe.ui.form.on("Self Appraisal Form", "employee_id", function(frm,dt,dn) {
        frappe.call({
        method:"church_ministry.church_ministry.doctype.member.member.get_attendance_points",
        args:{"args":frm.doc.employee_id  },
        callback: function(r) {
          if (r.message){
            frm.doc.data_7=r.message
            refresh_field('data_7');          
          }
        }
      });
});

/*cur_frm.add_fetch("employee_id", "employee_name", "employee_name");
frappe.ui.form.on("Self Appraisal Form", "employee_id", function(frm,dt,dn) {
        frappe.call({
        method:"church_ministry.church_ministry.doctype.member.member.get_attendance_points",
        args:{"args":frm.doc.employee_id  },
        callback: function(r) {
          if (r.message){
            frm.doc.data_7=r.message
            refresh_field('data_7');          
          }
        }
      });
});*/