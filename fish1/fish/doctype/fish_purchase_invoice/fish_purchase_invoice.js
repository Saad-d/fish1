// Copyright (c) 2025, Saad and contributors
// For license information, please see license.txt

frappe.ui.form.on("Fish Purchase Invoice", {
    // this function run for current date and time
    onload(frm){
        if (frm.is_new()) {
            let now = frappe.datetime.now_datetime();
            let [date, time] = now.split(' ');
            frm.set_value('date', date);          
            frm.set_value('posting_time', time);  
        }
    },
    //this tow funtion run for total_exp and total_pay field
    total_expenses: function (frm) {
        calculate_grand_total(frm);
    },
    total_payments: function (frm) {
        calculate_grand_total(frm);
    },
    //this funtion is for supplier prev bill no and prev bal
    supplier: function(frm) {
        if (frm.doc.supplier) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Fish Purchase Invoice",
                    filters: {
                        supplier: frm.doc.supplier
                    },
                    fields: ["name", "your_balance"],
                    order_by: "creation desc",
                    limit_page_length: 1
                },
                callback: function(r) {
                    if (r.message && r.message.length > 0) {
                        frm.set_value("previous_bill_no", r.message[0].name);
                        
                        // Check if your_balance exists and is greater than zero
                        if (r.message[0].your_balance && r.message[0].your_balance > 0) {
                            frm.set_value("balance", r.message[0].your_balance);
                            frm.set_df_property("balance", "hidden", 0); // Show field
                        } else {
                            frm.set_value("balance", "");
                            frm.set_df_property("balance", "hidden", 1); // Hide field
                        }
                    } else {
                        frm.set_value("previous_bill_no", "");
                        frm.set_value("balance", "");
                        frm.set_df_property("balance", "hidden", 1); // Hide field
                    }
                    frm.refresh_field("balance");
                }
            });
        }
    }
});
// this funtion run for Item rate and qty calculation
frappe.ui.form.on("Purchase Invoice Item",{
    qty:function(frm, cdt,cdn){
        update_amount_and_net_total(frm, cdt, cdn);
    },
    rate:function(frm, cdt,cdn){
        update_amount_and_net_total(frm, cdt, cdn);
    },
    table_alsd_add: function (frm) {
        calculate_net_total(frm);
      // console.log("calling from second row add")
    },
    table_alsd_remove: function (frm) {
        calculate_net_total(frm);
        //console.log("calling from second row del")
    }

})

//this function is for update the amount field in table
function update_amount_and_net_total(frm, cdt, cdn) {
    let d = locals[cdt][cdn];
    d.amount = d.qty * d.rate || 0;
    frappe.model.set_value(cdt, cdn, "amount", d.amount);
    calculate_net_total(frm);
    console.log(d.amount)
}

//this is the function for calcualte net total amount field
function calculate_net_total(frm) {
    let net_total = 0;
    frm.doc.table_alsd.forEach(item => {
        net_total += item.amount || 0;
    });
    frm.set_value("net_total", net_total);
}

frappe.ui.form.on("Expenses", {  // 
    rupee: function(frm, cdt, cdn) {
        update_total_expenses(frm);
    },
    table_sovl_remove: function (frm) { // Triggered when a row is removed
        update_total_expenses(frm);
    }
});

frappe.ui.form.on("Payments", {  // 
    rupes: function(frm, cdt, cdn) {
        update_total_payment(frm);
    },
    payments_remove: function (frm) { // Triggered when a row is removed
        update_total_payment(frm);
    }
});

function update_total_expenses(frm) {
    let dca = 0;
    $.each(frm.doc.table_sovl || [], function(i, d) {
        dca += flt(d.rupee);
    });
    frm.set_value("total_expenses", dca).then(() => {
        frm.refresh_field("total_expenses");
    });
}

function update_total_payment(frm) {
    let dca = 0;
    $.each(frm.doc.payments || [], function(i, d) {
        dca += flt(d.rupes);
    });
    frm.set_value("total_payments", dca).then(() => {
        frm.refresh_field("total_payments")
    });
}

// Helper funtion for sum of total_exp and total_pay grand total field
function calculate_grand_total(frm){
    let total_expense = frm.doc.total_expenses || 0;
    let total_payment = frm.doc.total_payments || 0;
    frm.set_value('grand_total',total_expense + total_payment);
}

