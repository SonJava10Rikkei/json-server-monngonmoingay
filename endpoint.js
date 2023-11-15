// Thêm endpoint để lấy thông tin về các tệp tin đã tải lên
server.get('/uploadedFiles', (req, res) => {
  res.jsonp(uploadedFiles);
});
