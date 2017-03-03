# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe, json

from frappe.utils import getdate, today
from frappe import _


from frappe.model.document import Document

class Task(Document):

	# def onload(self):
	#     frappe.errprint("hi in onload")
	# 	if self.region:
	# 		value = frappe.db.sql("select zone,church_group,church,pcf,senior_cell,name from `tabCells` where region='%s'"%(self.region),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"zone": value[0][0],
	# 				"church_group": value[0][1],
	# 				"church" : value[0][2],
	# 				"pcf" : value[0][3],
	# 				"senior_cell" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.zone:
	# 		value = frappe.db.sql("select region,church_group,church,pcf,senior_cell,name from `tabCells` where zone='%s'"%(self.zone),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"church_group": value[0][1],
	# 				"church" : value[0][2],
	# 				"pcf" : value[0][3],
	# 				"senior_cell" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.church_group:
	# 		value = frappe.db.sql("select region,zone,church,pcf,senior_cell,name from `tabCells` where church_group='%s'"%(self.church_group),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"zone": value[0][1],
	# 				"church" : value[0][2],
	# 				"pcf" : value[0][3],
	# 				"senior_cell" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.church:
	# 		value = frappe.db.sql("select region,zone,church_group,pcf,senior_cell,name from `tabCells` where church='%s'"%(self.church),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"zone": value[0][1],
	# 				"church_group" : value[0][2],
	# 				"pcf" : value[0][3],
	# 				"senior_cell" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.pcf:
	# 		value = frappe.db.sql("select region,zone,church_group,church,senior_cell,name from `tabCells` where pcf='%s'"%(self.pcf),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"zone": value[0][1],
	# 				"church_group" : value[0][2],
	# 				"church" : value[0][3],
	# 				"senior_cell" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.senior_cell:
	# 		value = frappe.db.sql("select region,zone,church_group,church,pcf,name from `tabCells` where senior_cell='%s'"%(self.senior_cell),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"zone": value[0][1],
	# 				"church_group" : value[0][2],
	# 				"church" : value[0][3],
	# 				"pcf" : value[0][4],
	# 				"cell" : value[0][5]
	# 			}
	# 		return ret
	# 	elif self.cell:
	# 		value = frappe.db.sql("select region,zone,church_group,church,pcf,senior_cell from `tabCells` where name='%s'"%(self.cell),as_list=1)
	# 		ret={}
	# 		if value:
	# 			ret={
	# 				"region": value[0][0],
	# 				"zone": value[0][1],
	# 				"church_group" : value[0][2],
	# 				"church" : value[0][3],
	# 				"pcf" : value[0][4],
	# 				"senior_cell" : value[0][5]
	# 			}


	def get_feed(self):
		return '{0}: {1}'.format(_(self.status), self.subject)

	def get_project_details(self):
		return {
			"project": self.project
		}

	def get_customer_details(self):
		cust = frappe.db.sql("select customer_name from `tabCustomer` where name=%s", self.customer)
		if cust:
			ret = {'customer_name': cust and cust[0][0] or ''}
			return ret

	def validate(self):
		if self.exp_start_date and self.exp_end_date and getdate(self.exp_start_date) > getdate(self.exp_end_date):
			frappe.throw(_("'Expected End Date' should be greater than 'Expected Start Date'"))

		if self.act_start_date and self.act_end_date and getdate(self.act_start_date) > getdate(self.act_end_date):
			frappe.throw(_("'Actual Start Date' can not be greater than 'Actual End Date'"))

		self.update_status()

	def update_status(self):
		status = frappe.db.get_value("Task", self.name, "status")
		if self.status=="Working" and status !="Working" and not self.act_start_date:
			self.act_start_date = today()

		if self.status=="Closed" and status != "Closed" and not self.act_end_date:
			self.act_end_date = today()

		if self.status=="Closed" and status != "Closed" :
			#receiver_list=frappe.db.sql("")
			from erpnext.setup.doctype.sms_settings.sms_settings import send_sms
			receiver_list=[]
			receiver_list.append("9960066444")
			send_sms(receiver_list, "Hi the task is closed")

	def on_update(self):
		"""update percent complete in project"""
		if self.project and not self.flags.from_project:
			project = frappe.get_doc("Project", self.project)
			project.run_method("update_percent_complete")

	

@frappe.whitelist()
def get_events(start, end, filters=None):
	from frappe.desk.reportview import build_match_conditions
	if not frappe.has_permission("Task"):
		frappe.msgprint(_("No Permission"), raise_exception=1)

	conditions = build_match_conditions("Task")
	conditions = conditions and (" and " + conditions) or ""

	if filters:
		filters = json.loads(filters)
		for key in filters:
			if filters[key]:
				conditions += " and " + key + ' = "' + filters[key].replace('"', '\"') + '"'

	data = frappe.db.sql("""select name, exp_start_date, exp_end_date,
		subject, status, project from `tabTask`
		where ((ifnull(exp_start_date, '0000-00-00')!= '0000-00-00') \
				and (exp_start_date between %(start)s and %(end)s) \
			or ((ifnull(exp_start_date, '0000-00-00')!= '0000-00-00') \
				and exp_end_date between %(start)s and %(end)s))
		{conditions}""".format(conditions=conditions), {
			"start": start,
			"end": end
		}, as_dict=True, update={"allDay": 0})

	return data

def get_project(doctype, txt, searchfield, start, page_len, filters):
	from erpnext.controllers.queries import get_match_cond
	return frappe.db.sql(""" select name from `tabProject`
			where %(key)s like "%(txt)s"
				%(mcond)s
			order by name
			limit %(start)s, %(page_len)s """ % {'key': searchfield,
			'txt': "%%%s%%" % txt, 'mcond':get_match_cond(doctype),
			'start': start, 'page_len': page_len})



def get_permission_query_conditions(user):
	if not user: user = frappe.session.user

	if "System Manager" in frappe.get_roles(user):
		return None
	else:
		return """(tabTask.owner = '{user}' or  tabTask._assign like '%{user}%' )"""\
			.format(user=frappe.db.escape(user))

def has_permission(doc, user):
	if "System Manager" in frappe.get_roles(user):
		return True
	else:
		res=frappe.db.sql("select name from `tabTask` where owner='%s' or _assign like '%%%s%%'"%(user,user))
		if res:
			return True
		else:
			return False
