const Queue = require('bull');
const reportQueue = new Queue('report-queue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

reportQueue.process(async (job) => {
  const { userId } = job.data;
  console.log(`Generating weekly report for user ${userId}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Report generated for user ${userId}`);
});

module.exports = {
  reportQueue,
};
