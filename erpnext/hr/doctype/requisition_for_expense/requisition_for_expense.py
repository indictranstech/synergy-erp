# Copyright (c) 2015, Web Notes Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RequisitionForExpense(Document):
	# pass

	def on_submit(self):
		if self.approval_status=="Draft":
			frappe.throw("""Approval Status must be 'Approved' or 'Rejected'""")
