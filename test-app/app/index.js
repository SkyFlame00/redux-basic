const { Store, combineReducers } = require('redux-basic');
const SearchView = require('./SearchView');
const FilesView = require('./FilesView');
const Types = require('./Types');

function files(store, action) {
  switch(action.type) {
    case Types.APPLY_FILTER:
      return store.map(file => {
        const escape = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const re = new RegExp(escape(action.filterValue), 'gi');
        return re.test(file.rawName) ?
          {
            ...file,
            isVisible: true,
            outputName: file.rawName.replace(re, str => `<span class="text_highlight_yellow">${str}</span>`)
          } :
          {
            ...file,
            isVisible: false,
            outputName: file.rawName
          };
      });
    default:
      return {
        ...file,
        isVisible: true
      };
  }
}

