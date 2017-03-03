# Copyright (c) 2015, Web Notes Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class InternalCommunication(Document):
	# pass

	def on_update(self):
		frappe.errprint("in method")
		if self.flag=='not':
			frappe.sendmail(recipients=self.email_id, sender='gangadhar.k@indictranstech.com', content=self.description, subject=self.subject)
		

	# def send_email(self):
	# 	frappe.errprint("in method")
	# 	if self.flag=='not':
	# 		frappe.sendmail(recipients=self.email_id, sender='gangadhar.k@indictranstech.com', content=self.description, subject=self.subject)
			# frappe.db.sql("update `tabInternalCommunication` set flag='fst' where name='%s'"%(self.name))
