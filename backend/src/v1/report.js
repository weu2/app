const express = require('express');
const router = express.Router();
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');

const reportDir = 'data/reports/';

const professionalReports = {
    callouts: {
        header: function(rpt, data) {
            rpt.print(`Callouts for ${data.name}`, {fontSize:24});
            rpt.print([new Date().toLocaleString()], {fontSize:18});

        },
        detail: function(rpt, data) {
            rpt.band([
                {data: "Date", width: 75},
                {data: "Status", width: 80},                    
                {data: "Number Plate", width: 60},
                {data: "Customer", width: 140},
                {data: "Location", width: 120},
                                
            ], {border: 1, padding:5});
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 75},
                {data: data.status.toUpperCase(), width: 80},                    
                {data: data.numberPlate, width: 60},
                {data: data.customerName, width: 140},                    
                {data: data.locationLat, width: 60},                    
                {data: data.locationLong, width: 60}                   
            ], {border: 1, padding:5});
            rpt.print(data.description, {addY:5});
            
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
            rpt.pageNumber( {footer: true, align: "center", text:"Page {0} of {1}"} );  
        }
    },
    payments: {
        header: function(rpt, data) {
            rpt.print(`Statement for ${data.name}`, {fontSize:24});
            rpt.print([new Date().toLocaleString()], {fontSize:18});
            rpt.band([
                {data: "Date", width: 80},
                {data: "Customer", width: 140},
                {data: "Status", width: 80},                    
                {data: "Owed", width: 80},
                {data: "Paid", width: 80},
            ], {border: 1, padding:5});
        },
        detail: function(rpt, data) {
            rpt.band([
                {data: new Date(parseInt(data.dateTime)).toLocaleDateString(), width: 80},
                {data: data.customerName, width: 140},     
                {data: data.status.toUpperCase(), width: 80},                    
                {data: `$${data.price}`, width: 80},
                {data: data.paymentComplete ? `$${data.price}` : '$0.0', width: 80},
            ], {border: 1, padding:5});
        },
        summary: function(rpt) {
        },
        footer: function(rpt) {
        }
    }//,
//    statement: {}
};

const userReports = {
//    statement: {}
};

const adminReports = {
//    users: {}
};

const Report = require('fluentreports').Report;
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
        }
        catch (err)
        {
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
        reports = Object.keys(userReports);
    } else if (user.ADMINISTRATOR) {
        reports = Object.keys(adminstratorReports);
    }
    res.status(200).send(reports);
});

router.post('/generate', (req, res) => {

    if (!apiValidator.validate(req, {
        type: {type:"string", required:true},
    })) {
        res.status(400).send('Missing API parameters');
        return;
    }

    const users = new JsonDB('data/users.json');
    const callouts = new JsonDB('data/callouts.json');
    const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again

    let report;
    let data;
    
    if (user.PROFESSIONAL) {
        report = professionalReports[req.body.type];
        data = Object.assign([], callouts.find({ assignedTo: req.userUuid }));
        data.forEach(item => {
            const customer = users.find({ uuid: item.customer })[0]; // user uuid should be checked already so no need to check it again
            item.customerName = `${customer.firstName} ${customer.lastName}`;
        });
    } else if (user.CUSTOMER) {
        report = customerReports[req.body.type];
    } else if (user.ADMINISTRATOR) {
        report = administratorReports[req.body.type];
    }

    let header = {
        name: `${user.firstName} ${user.lastName}`
    };

    if(report)
        createReport(report, header, data)
            .then(name => {
                //console.log(name);
                res.status(200).download(`./${reportDir}${name}`);//send({name:name});
            }).catch(err => {
                res.status(400).send();
            });
    else 
        res.status(400).send();
});

module.exports = router;