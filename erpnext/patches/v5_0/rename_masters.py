import frappe

def execute():
	frappe.errprint("renaming master")
	if frappe.db.table_exists("tabRegion Master"):
		frappe.rename_doc("DocType", "Region Master", "Regions")

	if frappe.db.table_exists("tabZone Master"):
		frappe.rename_doc("DocType", "Zone Master", "Zones")

	if frappe.db.table_exists("tabGroup Church Master"):
		frappe.rename_doc("DocType", "Group Church Master", "Group Churches")

	if frappe.db.table_exists("tabChurch Master"):
		frappe.rename_doc("DocType", "Church Master", "Churches")


	if frappe.db.table_exists("tabPCF Master"):
		frappe.rename_doc("DocType", "PCF Master", "PCFs")


	if frappe.db.table_exists("tabSenior Cell Master"):
		frappe.rename_doc("DocType", "Senior Cell Master", "Senior Cells")


	if frappe.db.table_exists("tabCell Master"):
		frappe.rename_doc("DocType", "Cell Master", "Cells")


	if frappe.db.table_exists("tabFoundation School Exam Master"):
		frappe.rename_doc("DocType", "Foundation School Exam Master", "Foundation School Exams")


	if frappe.db.table_exists("tabFS Grade Master"):
		frappe.rename_doc("DocType", "FS Grade Master", "Foundation School Grades")



	if frappe.db.table_exists("tabPartnership Arm"):
		frappe.rename_doc("DocType", "Partnership Arm", "Partnership Arms")