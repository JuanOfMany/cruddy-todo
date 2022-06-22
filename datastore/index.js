const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


exports.create = (text, callback) => {
  counter.getNextUniqueId(function (err, value) {
    var filePath = path.join(exports.dataDir, `${value}.txt`);
    fs.writeFile(filePath, text, function (error) {
      if (error) {
      } else {
        callback(err, { id: value, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var resultArr = [];
  fs.readdir(exports.dataDir, function (err, filenames) {
    if (err) {
      // onError(err);
      // return;
    }
    if (filenames.length === 0) {
      callback(err, []);
    }
    filenames.forEach(function (filename, i) {
      fs.readFile(exports.dataDir + filename, 'utf-8', function (err, content) {
        if (err) {
          // onError(err);
          // return;
        }
        var todoObj = {id: filename.slice(0, 5), text: filename.slice(0, 5)};
        resultArr.push(todoObj);

        if (i === (filenames.length - 1)) {
          callback(err, resultArr);
        }
      });
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile((path.join(exports.dataDir, `${id}.txt`)), 'utf-8', function (err, data) {
    if (err) {
      callback(err);
    } else {
      var todoObj = {id: id.slice(0, 5), text: data};
      callback(err, todoObj);
    }
  });

};

exports.update = (id, text, callback) => {
  exports.readOne(id, function(error) {
    if (error) {
      callback(error);
    } else {
      fs.writeFile((path.join(exports.dataDir, `${id}.txt`)), text, function(error) {
        callback(error);
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink((path.join(exports.dataDir, `${id}.txt`)), function(error) {
    if (error) {
      callback(error);
    } else {
      callback(error);
    }

  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
