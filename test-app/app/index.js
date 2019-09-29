document.addEventListener('DOMContentLoaded', () => {

const { Store, combineReducers } = require('redux-basic');
const SearchView = require('./views/SearchView');
const FilesView = require('./views/FilesView');
const Types = require('./Types');

function init(store, action) {
  switch(action.type) {
    case Types["@@init"]:
    default:
      break;
  }
}

function files(store, action) {
  switch(action.type) {
    case Types.APPLY_FILTER:
      if (action.filterValue !== '') {
        return store.map(file => {
          // escape взял из Интернета, чтобы время не тратить :)
          const escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const re = new RegExp(escape(action.filterValue), 'gi');
          return re.test(file.rawName) ?
            ({
              ...file,
              isVisible: true,
              outputName: file.rawName.replace(re, str => `<span class="text_highlight_yellow">${str}</span>`)
            }) :
            ({
              ...file,
              isVisible: false,
              outputName: file.rawName
            });
        });
      }
    default:
      return store.map(file => ({
        ...file,
        isVisible: true,
        outputName: file.rawName
      }));
  }
}

const reducer = combineReducers({
  init,
  files
});

const initialState = {
  files: [
    {
      rawName: 'README.md',
      outputName: 'README.md'
    },
    {
      rawName: 'app.js',
      outputName: 'app.js'
    },
    {
      rawName: 'package.json',
      outputName: 'package.json'
    }
  ]
};

const store = new Store(reducer, initialState);

const filesSearchWrapper = document.body.querySelectorAll('.files-actions__col')[1];
const tableBody = document.body.querySelector('.table-files__body');

const searchView = new SearchView(filesSearchWrapper, store);
const filesView = new FilesView(tableBody, store);

});