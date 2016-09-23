const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const fs = require('fs');

const doc = new GoogleSpreadsheet('1oFVNRkyqK1ceAHQGpb6wPNy-1t6l8aEIowWzUlTtV2s');
let sheet;
let infoSheet;
let info = {type: "time"};
let json = [];

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
          infoSheet = elem;
        }
        if(elem.title === '営業時間') {
          sheet = elem;
        }
      }
      if(!sheet || !infoSheet) {
        console.log('Error: 指定したワークシートが見つかりませんでした。');
      } else {
        step();
      }
    });
  },
  function getInfo(step) {
    infoSheet.getCells({
      'return-empty': true
    }, (err, cells) => {
      if(err) {
        }
        for(let i = 3, len = cells.length; i < len; i += 3) {
          const key = cells[i].value;
          switch(key) {
            case 'open':
            case 'close':
            case 'lo':
              const value = cells[i + 2].value;
              info[key] = value;
              break;
          }
        }
        json = [info];
        step();
    });
  },
  function generateJson(step) {
    sheet.getCells({
      'return-empty': true
    }, (err, cells) => {
      if(err) {
        console.log('Error: Spreadsheetのデータを取得できませんでした。');
        return;
      }
      for(let i = 5, len = cells.length; i < len; i += 5) {
        const date = cells[i].value;
        if(cells[i + 1].value === '休業日') {
          json.push({
            date,
            type: 'close'
          })
        } else {
          const open = cells[i + 2].value;
          const close = cells[i + 3].value;
          const lo = cells[i + 4].value;
          json.push({
            date,
            type: 'time',
            open: open === '' ? info.open : open,
            close: close === '' ? info.close : close,
            lo: lo === '' ? info.lo : lo
          });
        }
      }
      step();
    })
  },
  function writeJson(step) {
    fs.writeFile('./docs/public/open.json', JSON.stringify(json, null, ''));
    console.log('Finish: メニューリストのjsonファイル書き出しに成功しました。');
    step();
  }
]);