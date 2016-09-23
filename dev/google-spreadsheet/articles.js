const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const fs = require('fs');
const md = require('node-markdown').Markdown;

const doc = new GoogleSpreadsheet('1jsqLkgCY-QywUwTtL-3yuIaoc2jhZAMPL7jnWgGKbjo');
let sheets = {
  articles: null,
  categories: null
};
let articles = [];
let categories = [];


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
        if(elem.title === '記事') {
          sheets.articles = elem;
        }
        if(elem.title === 'カテゴリー') {
          sheets.categories = elem;
        }
      }
      if(!sheets.articles || !sheets.categories) {
        console.log('Error: 指定したワークシートが見つかりませんでした。');
      }
      step();
    });
  },
  function generateCategories(step) {
    sheets.categories.getCells({
      'return-empty': false
    }, (err, cells) => {
      if(err) {
        console.log('Error: Spreadsheetのデータを取得できませんでした。 @ Categories');
        return;
      }
      for(let i = 2, len = cells.length; i < len; i += 2) {
        const id = cells[i].value;
        const title = cells[i + 1].value;
        categories.push({
          id,
          title,
          count: 0
        });
      }
      step();
    });
  },
  function generateArticle(step) {
    sheets.articles.getCells({
      'return-empty': true
    }, (err, cells) => {
      if(err) {
        console.log('Error: Spreadsheetのデータを取得できませんでした。 @ Articles');
        return;
      }
      for(let i = 6, len = cells.length; i < len; i += 6) {
        let id = cells[i].value;
        const date = cells[i + 1].value;
        const time = cells[i + 2].value;
        const categoryName = cells[i + 3].value === '' ? '未分類' : cells[i + 3].value;
        const title = cells[i + 4].value;
        const body = md(cells[i + 5].value).replace(/\n/g, '');
        if(id === '') {
          id = `article${date.replace(/-/g, "")}`;
        }
        let category;
        for(let j = 0, jLen = categories.length; j < jLen; j++) {
          const item = categories[j];
          if(categoryName === item.title) {
            category = item;
            item.count ++;
            break;
          }
        }
        if(!category) {
          console.log(`Error: 無効なカテゴリーです。 @ ${title}`);
        }
        articles.push({
          id,
          title,
          body,
          category: {
            id: category.id,
            title: category.title
          },
          date,
          time
        });
      }
      step();
    });
  },
  function writeJson(step) {
    fs.writeFile('./docs/public/articles.json', JSON.stringify(articles, null, ''));
    fs.writeFile('./docs/public/categories.json', JSON.stringify(categories, null, ''));
    console.log('Finish: メニューリストのjsonファイル書き出しに成功しました。');
    step();
  }
]);