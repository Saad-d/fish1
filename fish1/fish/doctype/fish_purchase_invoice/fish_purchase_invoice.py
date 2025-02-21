# Copyright (c) 2025, Saad and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FishPurchaseInvoice(Document):
	def validate(self):
		# Ensure balance is treated as 0.0 if empty
		balance = frappe.utils.flt(self.balance) if self.balance else 0.0
		net_total = frappe.utils.flt(self.net_total)
		# Calculate net_total_amount
		self.net_total_amount = balance + net_total

		# #for net_total field
		# net_total = self.balance + self.net_total
		# self.net_total_amount = net_total
		#for expe table
		total_expenses = sum(frappe.utils.flt(row.rupee) for row in self.table_sovl)
		self.total_expenses = total_expenses
        #for payment table
		total_payment = sum(frappe.utils.flt(row.rupes) for row in self.payments)
		self.total_payments = total_payment
        #for grand_total calculation
		self.grand_total = self.total_expenses + self.total_payments
        #for your balance field calcuation
		your_bal  = self.net_total_amount - self.grand_total
		self.your_balance = your_bal
	

		

	

