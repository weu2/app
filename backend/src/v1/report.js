const express = require('express');
const router = express.Router();
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');
const Report = require('fluentreports').Report;

const reportDir = 'data/reports/';

const professionalReports = {
    callouts: {
        header: function(rpt, data) {
            rpt.print(`Callouts for ${data.name}`, {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: "Date", width: 75},
                {data: "Status", width: 80},
                {data: "Plate", width: 60},
                {data: "Customer", width: 140},
                {data: "Location", width: 120},
            ], {border: 1, padding: 5});
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 75},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.numberPlate, width: 60},
                {data: data.customerName, width: 140},
                {data: data.locationLat, width: 60},
                {data: data.locationLong, width: 60}
            ], {border: 1, padding: 5});
            rpt.print(data.description, {addY: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    },
    payments: {
        header: function(rpt, data) {
            rpt.print(`Statement for ${data.name}`, {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
            rpt.band([
                {data: "Date", width: 80},
                {data: "Customer", width: 140},
                {data: "Status", width: 80},
                {data: "Owed", width: 80},
                {data: "Paid", width: 80},
            ], {border: 1, padding: 5});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 80},
                {data: data.customerName, width: 140},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set", width: 80},
                {data: data.paymentComplete ? (data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set") : '$0.00', width: 80},
            ], {border: 1, padding: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    }
};

const customerReports = {
    callouts: {
        header: function(rpt, data) {
            rpt.print(`Callouts by ${data.name}`, {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: "Date", width: 75},
                {data: "Status", width: 80},
                {data: "Plate", width: 60},
                {data: "Professional", width: 140},
                {data: "Location", width: 120},
            ], {border: 1, padding: 5});
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 75},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.numberPlate, width: 60},
                {data: data.professionalName, width: 140},
                {data: data.locationLat, width: 60},
                {data: data.locationLong, width: 60}
            ], {border: 1, padding: 5});
            rpt.print(data.description, {addY: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    },
    payments: {
        header: function(rpt, data) {
            rpt.print(`Statement for ${data.name}`, {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
            rpt.band([
                {data: "Date", width: 80},
                {data: "Professional", width: 140},
                {data: "Status", width: 80},
                {data: "Owed", width: 80},
                {data: "Paid", width: 80},
            ], {border: 1, padding: 5});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 80},
                {data: data.professionalName, width: 140},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set", width: 80},
                {data: data.paymentComplete ? (data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set") : '$0.00', width: 80},
            ], {border: 1, padding: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    }
};

const adminReports = {
    callouts: {
        header: function(rpt, data) {
            rpt.print("All callouts", {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: "Date", width: 75},
                {data: "Status", width: 80},
                {data: "Plate", width: 60},
                {data: "Customer", width: 100},
                {data: "Professional", width: 100},
                {data: "Location", width: 120},
            ], {border: 1, padding: 5});
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 75},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.numberPlate, width: 60},
                {data: data.customerName, width: 100},
                {data: data.professionalName, width: 100},
                {data: data.locationLat, width: 60},
                {data: data.locationLong, width: 60}
            ], {border: 1, padding: 5});
            rpt.print(data.description, {addY: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    },
    payments: {
        header: function(rpt, data) {
            rpt.print("All statements", {fontSize: 24});
            rpt.print([new Date().toLocaleString()], {fontSize: 18});
            rpt.band([
                {data: "Date", width: 80},
                {data: "Customer", width: 140},
                {data: "Status", width: 80},
                {data: "Owed", width: 80},
                {data: "Paid", width: 80},
            ], {border: 1, padding: 5});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 80},
                {data: data.customerName, width: 140},
                {data: data.status.toUpperCase(), width: 80},
                {data: data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set", width: 80},
                {data: data.paymentComplete ? (data.price ? `$${parseFloat(data.price).toFixed(2)}` : "Not set") : '$0.00', width: 80},
            ], {border: 1, padding: 5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber({footer: true, align: "center", text: "Page {0} of {1}"});
        }
    }
};

function createReport(report, header, data) {
    return new Promise(function(res, rej) {
        try {
            fs.mkdir(reportDir, { recursive: true }, (err) => {
                if (err) throw err; // not sure why this would happen, no perms maybe unix moment

                const rpt = new Report(`${reportDir}${uuid.v4()}.pdf`);

                if (report.footer) {
                    rpt.pageFooter(report.footer);
                }
                if (report.header) {
                    rpt.pageHeader((rpt) => report.header(rpt, header));
                }
                if (report.finalSummary) {
                    rpt.finalSummary(report.summary);
                }
                if (report.detail) {
                    rpt.detail(report.detail);
                }
                report.headerData = header;
                rpt.data(data)
                    .render(function(err, filepath){
                        res(filepath.split("/").pop());
                    });
            });
        } catch (err) {
            rej(err);
        }
    });
}

// this is the catch all express router that sinks all files 
// to either a static request or the index.html
// added it here because it looks ugly in index.js

router.use((req, res, next) => {
    // first we validate the user
    const userUuid = auth.verifyClaim(req.cookies.claim)
    if (userUuid) {
        req.userUuid = userUuid;
        next();
    } else {
        res.status(401).send();
    }
});

router.get('/types', (req, res) => {
    const users = new JsonDB('data/users.json');
    const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
    let reports;
    if (user.PROFESSIONAL) {
        reports = Object.keys(professionalReports);
    } else if (user.CUSTOMER) {
        reports = Object.keys(customerReports);
    } else if (user.ADMINISTRATOR) {
        reports = Object.keys(adminReports);
    }
    res.status(200).send(reports);
});

function addNames(data, users) {
    const callouts = Object.assign([], data);
    callouts.forEach(item => {
        const customer = users.find({ uuid: item.customer })[0]; // user uuid should be checked already so no need to check it again
        item.customerName = `${customer.firstName} ${customer.lastName}`;
        if (item.assignedTo) {
            const pro = users.find({ uuid: item.assignedTo })[0];
            item.professionalName = `${pro.firstName} ${pro.lastName}`;
        } else {
            item.professionalName = "None";
        }
    });
    return callouts;
}

router.post('/generate', (req, res) => {

    if (!apiValidator.validate(req, {
        type: {type: "string", required: true},
    })) {
        res.status(400).send('Missing API parameters');
        return;
    }

    const users = new JsonDB('data/users.json');
    const callouts = new JsonDB('data/callouts.json');
    const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again

    let report;
    let data;
    
    if (user.CUSTOMER) {
        report = customerReports[req.body.type];
        data = addNames(callouts.find({ customer: req.userUuid }), users);
    } else if (user.PROFESSIONAL) {
        report = professionalReports[req.body.type];
        data = addNames(callouts.find({ assignedTo: req.userUuid }), users);
    } else if (user.ADMINISTRATOR) {
        report = adminReports[req.body.type];
        data = addNames(callouts.getAll(), users);
    }

    if (report) {
        createReport(report, {name: `${user.firstName} ${user.lastName}`}, data)
            .then(name => {
                res.status(200).download(`./${reportDir}${name}`);
            }).catch(err => {
                res.status(400).send();
            });
    } else {
        res.status(400).send();
    }
});

module.exports = router;