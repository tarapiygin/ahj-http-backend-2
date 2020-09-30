/* eslint-disable no-shadow */
const path = require('path');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const serve = require('koa-static');
const FileManager = require('./FileManager');

const app = new Koa();
const publicPath = path.join(__dirname, '/public');
module.exports.publicPath = publicPath;
app.use(serve(publicPath));
app.use(cors());
app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

const fileManager = new FileManager();
fileManager.loadState();

app.use(async (ctx) => {
  const { method } = ctx.query;
  switch (method) {
    case 'allImages':
      ctx.response.body = fileManager.getAllImageObj();
      return;
    case 'createImage':
      if (ctx.request.method === 'POST') {
        try {
          ctx.response.body = fileManager.createImageObj(ctx.request.files.image);
          ctx.response.status = 201;
        } catch (error) {
          ctx.response.body = `Ошибка добавления изображения ${error}`;
          ctx.response.status = 501;
        }
      } else {
        ctx.response.body = 'the method must be "POST"';
        ctx.response.status = 405;
      }
      return;
    case 'removeImage':

      if (ctx.request.method === 'POST') {
        try {
          const { id } = JSON.parse(ctx.request.body);
          fileManager.removeImageObj(id);
          ctx.response.status = 202;
        } catch (error) {
          ctx.response.body = `Ошибка удаления изображения ${error}`;
          ctx.response.status = 501;
        }
      } else {
        ctx.response.body = 'the method must be "POST"';
        ctx.response.status = 405;
      }
      return;
    default:
      ctx.response.status = 404;
  }
});
const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
