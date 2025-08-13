import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveClient() {
  const jwt = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive']
  );
  return google.drive({ version: 'v3', auth: jwt });
}

export async function uploadBufferToDrive({ buffer, mimeType, name, parents }) {
  const drive = getDriveClient();
  const file = await drive.files.create({
    requestBody: { name, parents: parents?.length ? parents : [process.env.GOOGLE_DRIVE_FOLDER_ID], mimeType },
    media: { mimeType, body: Buffer.isBuffer(buffer) ? Readable.from(buffer) : buffer },
    fields: 'id, webViewLink, webContentLink, name',
  }, { maxBodyLength: Infinity, maxContentLength: Infinity });

  const fileId = file.data.id;
  await drive.permissions.create({ fileId, requestBody: { role: 'reader', type: 'anyone' } });
  const link = `https://drive.google.com/file/d/${fileId}/view`;
  return { fileId, link, name: file.data.name };
}