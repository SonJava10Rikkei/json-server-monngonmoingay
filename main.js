const jsonServer = require('json-server');
const queryString = require('query-string');
const multer = require('multer');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const fs = require('fs');

// Set default middlewares (logger, static, cors, and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT, and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Custom id tracker
const idTracker = {};

let uploadedFiles = [];

// Multer configuration for handling file uploads to disk storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/uploads');
  },
  filename: (req, file, callback) => {
    const uniqueId = generateUniqueId();
    const fileName = `${uniqueId}_${file.originalname}`;
    callback(null, fileName);
  },
});

const upload = multer({ storage });

// Middleware for handling file uploads
server.post('/api/upload', upload.single('uploaded_file'), (req, res) => {
  const file = req.file;

  // Save file information to the uploadedFiles array
  const fileInfo = {
    id: generateUniqueId(),
    filename: file.filename,
    createdAt: formatTimestamp(Date.now()),
    updatedAt: formatTimestamp(Date.now()),
  };

  // Load existing data from db.json
  const db = JSON.parse(fs.readFileSync('db.json'));

  // Add the new file info to uploadedFiles
  db.uploadedFiles.push(fileInfo);

  // Save the updated data back to db.json
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

  uploadedFiles.push(fileInfo);

  res.json({ message: 'File uploaded successfully', file: fileInfo });
});

// Middleware to convert id to number
server.use((req, res, next) => {
  if (isPostRequest(req, '/api/upload')) {
    handlePostRequest(req);
  } else if (req.method === 'PATCH') {
    handlePatchRequest(req);
  }
  next();
});

// Custom output for LIST with pagination
router.render = (req, res) => {
  const headers = res.getHeaders();

  const totalCountHeader = headers['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCountHeader),
      },
    };

    return res.jsonp(result);
  }

  // Otherwise, keep the default behavior
  res.jsonp(res.locals.data);
};

// Use the default router
server.use('/api', router);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('JSON Server is running');
});

function isPostRequest(req, path) {
  return req.method === 'POST' && req.path !== path;
}

function handlePostRequest(req) {
  const uniqueId = generateUniqueId();
  req.body.id = uniqueId;
  req.body.createdAt = formatTimestamp(Date.now());
  req.body.updatedAt = formatTimestamp(Date.now());
}

function handlePatchRequest(req) {
  req.body.updatedAt = formatTimestamp(Date.now());
}

function generateUniqueId() {
  let uniqueId;
  do {
    uniqueId = Math.floor(Math.random() * 1000000) + 1;
  } while (idTracker[uniqueId]);
  idTracker[uniqueId] = true;
  return uniqueId;
}

function formatTimestamp(timestamp) {
  const dateObject = new Date(timestamp);
  return dateObject.toLocaleString('vi-VN'); // Chọn ngôn ngữ và định dạng phù hợp
}
