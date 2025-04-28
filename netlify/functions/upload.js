const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const boundary = event.headers['content-type'].split('boundary=')[1];
  const buffer = Buffer.from(event.body, 'base64');
  const parts = buffer.toString().split(boundary);

  const filePart = parts.find(part => part.includes('filename='));
  if (!filePart) {
    return { statusCode: 400, body: 'No file found' };
  }

  const matches = /filename="(.+?)"/.exec(filePart);
  const originalFilename = matches[1];
  const content = filePart.split('\r\n\r\n')[1].split('\r\n')[0];

  const randomFilename = uuidv4() + "_" + originalFilename;

  // In real world, upload to S3 / Supabase Storage here
  // Temporary fake URL for now
  const fakePublicUrl = `https://yourproject.netlify.app/uploads/${randomFilename}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: fakePublicUrl
    }),
  };
};
