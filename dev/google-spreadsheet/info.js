const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const fs = require('fs');

const doc = new GoogleSpreadsheet('1oFVNRkyqK1ceAHQGpb6wPNy-1t6l8aEIowWzUlTtV2s');
let sheet;
let json = {};

async.series([
  function setAuth(step) {
    const creds = require('./google-generated-creds.json');

    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      // 作成するシートのタイトル
      for(let i = 0, len = info.worksheets.length; i < len; i++) {
        const elem = info.worksheets[i];
        if(elem.title === '店舗情報') {
          sheet = elem;
          step();
          break;
        }
      }
      if(!sheet) {
        console.log('Error: 指定したワークシートが見つかりませんでした。');
      }
    });
  },
  function generateJson(step) {
    sheet.getCells({
      'return-empty': false
    }, (err, cells) => {
      if(err) {
        console.log('Error: Spreadsheetのデータを取得できませんでした。');
        return;
      }
      for(let i = 3, len = cells.length; i < len; i += 3) {
        const key = cells[i].value;
        const value = cells[i + 2].value;
        json[key] = value;
      }
      step();
    })
  },
  function writeJson(step) {
    fs.writeFile('./docs/public/info.json', JSON.stringify(json, null, ''));
    console.log('Finish: メニューリストのjsonファイル書き出しに成功しました。');
    step();
  }
]);