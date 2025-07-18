exports.uploadReceipt = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = req.file.path;

  return res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: imagePath,
  });
};
