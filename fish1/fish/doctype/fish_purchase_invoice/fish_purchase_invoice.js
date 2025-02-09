// Copyright (c) 2025, Saad and contributors
// For license information, please see license.txt

frappe.ui.form.on("Fish Purchase Invoice", {

    onload(frm){
        if (frm.is_new()) {
            let now = frappe.datetime.now_datetime();
            let [date, time] = now.split(' ');
            frm.set_value('date', date);          
            frm.set_value('posting_time', time);  
        }
    },
});

frappe.ui.form.on("Expenses", {  // 
    rupee: function(frm, cdt, cdn) {
        update_total_expenses(frm);
    }
});

frappe.ui.form.on("Payments", {  // 
    rupes: function(frm, cdt, cdn) {
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



