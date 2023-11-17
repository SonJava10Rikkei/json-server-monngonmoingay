// Thêm endpoint để lấy thông tin về các tệp tin đã tải lên
server.get('/uploadedFiles', (req, res) => {
  res.jsonp(uploadedFiles);
});

const express = require('express');
const path = require('path');

const app = express();

// Đường dẫn đến thư mục chứa các tệp tĩnh (hình ảnh, v.v.)
const staticPath = path.join(__dirname, './public/uploads');
app.use('/uploadedFiles', express.static(staticPath));