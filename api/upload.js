import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    const adminKey = fields.adminKey?.[0];
    if (adminKey !== process.env.ADMIN_KEY) return res.status(403).send('Forbidden');

    const file = files.script[0];
    const uploadPath = path.join(process.cwd(), 'uploads', file.originalFilename);

    fs.copyFile(file.filepath, uploadPath, (err) => {
      if (err) return res.status(500).send('Upload failed');
      res.status(200).send('Script uploaded successfully');
    });
  });
}