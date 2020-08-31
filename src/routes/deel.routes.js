const { authenticate } = require("../middleware");
const deelController = require("../controllers").deel;

module.exports = function (app) {
    app.get('/contracts/:id', [authenticate.getProfile], deelController.getContract)
    app.get('/contracts', [authenticate.getProfile], deelController.getAllContracts)
    app.get('/jobs/unpaid', [authenticate.getProfile], deelController.getUnpaidJobs)
    app.post('/jobs/:job_id/pay', [authenticate.getProfile], deelController.setJobPay)
    app.post('/balances/deposit/:userId', deelController.setDeposit)
    app.get('/admin/best-profession', deelController.getBestProfession)
    app.get('/admin/best-clients', deelController.getBestClients)
};
