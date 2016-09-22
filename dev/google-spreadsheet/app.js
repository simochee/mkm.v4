const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const fs = require('fs');

const doc = new GoogleSpreadsheet('1PUHDMamc37EbZYlRJTMsMMxd1tpkkFyKCYogeS1RigU');
let sheet;
let json = [];
let isExit = false;

async.series([
  function setAuth(step) {
    const creds = require('./google-generated-creds.json');

    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      // 作成するシートのタイトル
      const title = process.argv[2];
      for(let i = 0, len = info.worksheets.length; i < len; i++) {
        const elem = info.worksheets[i];
        if(elem.title === title) {
          sheet = elem;
          step();
          break;
        }
        console.log('Error: 指定したワークシートが見つかりませんでした。');
      }
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
      let tmpOuter = null;
      let tmpInner = {
        title: null, menu: []
      };
      for(let i = 0, len = cells.length; i < len; i += 4) {
        const cell = cells[i];
        // ヘッダー行は無視する
        if(cell.row === 1) continue;
        // 大見出し行処理
        if(cell.value === '#') {
          if(tmpOuter !== null) {
            json.push(tmpOuter);
          }
          const ja = cells[i + 1].value;
          const en = cells[i + 2].value;
          tmpOuter = {
            ja,
            en,
            list: []
          };
        }
        // 小見出し行処理
        else if(cell.value === '##') {
          if(tmpInner.title !== null) {
            tmpOuter.list.push(tmpInner);
          }
          const ja = cells[i + 1].value;
          const en = cells[i + 2].value;
          tmpInner = {
            ja,
            en,
            menu: []
          }
        }
        // メニューリスト処理
        else if(cell.value !== '') {
          const name = cell.value;
          const price = cells[i + 1].value;
          const image = cells[i + 2].value;
          const comment = cells[i + 3].value;
          tmpInner.menu.push({
            name,
            price,
            image,
            comment
          });
        }
      }
      if(tmpOuter !== []) {
        json.push(tmpOuter);
      }
      step();
    })
  },
  function writeJson(step) {
    fs.writeFile('./docs/public/menu-list.json', JSON.stringify(json, null, ''));
    console.log('Finish: メニューリストのjsonファイル書き出しに成功しました。');
    step();
  }
]);