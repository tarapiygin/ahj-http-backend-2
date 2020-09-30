const uuid = require('uuid');
const fs = require('fs');
const server = require('./server');

module.exports = class FileManager {
  constructor() {
    this.imageObjList = [];
  }

  createImageObj(data) {
    const id = uuid.v1();
    const extension = data.name.slice(data.name.lastIndexOf('.'), data.name.length);
    const URL = `img/${id + extension}`;
    const name = `${server.publicPath}/${URL}`;
    const file = fs.readFileSync(data.path, 'binary');
    fs.writeFileSync(name, file, 'binary');
    console.log(file);
    this.imageObjList.push({
      id,
      path: name,
      URL,
    });
    this.saveState();
    return { id, URL };
  }

  removeImageObj(id) {
    const index = this.imageObjList.findIndex((obj) => obj.id === id);
    const { path } = this.imageObjList[index];
    fs.unlinkSync(path);
    this.imageObjList.splice(index, 1);
    this.saveState();
  }

  getAllImageObj() {
    const imageObjList = this.imageObjList.map((obj) => ({ id: obj.id, URL: obj.URL }));
    return imageObjList;
  }

  saveState() {
    const data = JSON.stringify(this.imageObjList);
    fs.writeFile('./bd.json', data, (err) => err);
  }

  loadState() {
    const file = fs.readFileSync('./bd.json', 'utf8');
    if (file !== '') this.imageObjList = JSON.parse(file);
  }
};
