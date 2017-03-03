frappe.ui.form.on("Requisition For Expense", "onload", function(frm,doc,dt,dn) {
   cur_frm.set_query("approver", function() {
		return {
			filters: [["UserRole", "role", "=", "Expense Approver"]]
		};
	});
});

