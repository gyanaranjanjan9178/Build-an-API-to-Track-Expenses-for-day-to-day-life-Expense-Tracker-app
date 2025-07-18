const Queue = require('bull');
const sendReportJob = require('../jobs/report.job');


const reportQueue = new Queue('reportQueue');
reportQueue.process(async (job) => {
  const user = job.data;
  if (!user || !user.email) {
    console.log('Invalid user data in report job');
    return;
  }

  await sendReportJob(user); 
});

module.exports = reportQueue;
