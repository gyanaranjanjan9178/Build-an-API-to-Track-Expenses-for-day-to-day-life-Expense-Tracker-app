const { reportQueue } = require('../queue/report.queue'); 

const sendReport = async (req, res) => {
  try {
    const userId = req.user.id;
    await reportQueue.add({ userId }); 
    return res.status(200).json({ message: 'Weekly report job added to queue!' });
  } catch (err) {
    console.error('Error in sendReport:', err);
    return res.status(500).json({ error: 'Failed to send report' });
  }
};

const generateReport = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Generating report for user ${userId}`);
    return res.status(200).json({ message: 'Report generated' });
  } catch (err) {
    console.error('Error in generateReport:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = {
  sendReport,
  generateReport,
};
