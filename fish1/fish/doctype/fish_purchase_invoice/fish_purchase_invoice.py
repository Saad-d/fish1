# Copyright (c) 2025, Saad and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FishPurchaseInvoice(Document):
	def validate(self):
		total_expenses = sum(frappe.utils.flt(row.rupee) for row in self.table_sovl)
		self.total_expenses = total_expenses

		total_payment = sum(frappe.utils.flt(row.rupes) for row in self.payments)
		self.total_payments = total_payment
