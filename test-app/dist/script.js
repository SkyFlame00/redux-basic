(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = class Store {
  constructor(reducer, initialState) {
    this._reducer = reducer;
    this._listeners = [];
    this._state = initialState;
    this.dispatch({ type: '@@init' });
  }

  getState() {
    return this._state;
  }

  subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      const index = this._listeners.indexOf(callback);
      this._listeners.splice(index, 1);
    }
  }

  dispatch(action) {
    this._state = this._reducer(this._state, action);
    this._notifyListeners();
  }

  _notifyListeners() {
    this._listeners.forEach(listener => listener(this.getState()));
  }
}
},{}],2:[function(require,module,exports){
module.exports = function combineReducers(reducers) {
  return (previousState, action) => {
    return Object.keys(reducers).reduce((state, key) => {
      state[key] = reducers[key](previousState[key], action);
      return state;
    }, {});
  }
}
},{}],3:[function(require,module,exports){
module.exports = {
  combineReducers: require('./combineReducers/index'),
  Store: require('./Store/index')
}
},{"./Store/index":1,"./combineReducers/index":2}],4:[function(require,module,exports){
const Types = require('../Types');

const applyFilterAction = filterValue => ({
  type: Types.APPLY_FILTER,
  filterValue
});

module.exports = {
  applyFilterAction
};
},{"../Types":7}],5:[function(require,module,exports){
module.exports = class FilesView {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._unsubscribe = this._store.subscribe(
      this._prepareRender.bind(this)
    );
    this._prepareRender(this._store.getState());
  }

  _prepareRender(state) {
    this._el.innerHTML = this.render(state);
  }

  render({ files }) {
    return files.map(file => {
      return `
        <tr class="table-files__item ${!file.isVisible ? 'table-files__item_nodisplay' : ''}">
          <td>${file.outputName}</td>
          <td><a href="#">${file.hash}</a></td>
          <td>${file.commitMessage}</td>
          <td><a href="@#">${file.committer}</a></td>
          <td></td>
          <td>${file.datetime}</td>
          <td></td>
        </tr>
      `;
    }).join('');
  }

  destroy() {
    this._el.innerHTML = '';
    this._unsubscribe();
  }
}
},{}],6:[function(require,module,exports){
const { applyFilterAction } = require('../ActionTypes');

module.exports = class SearchView {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._el.innerHTML = `
      <div class="files-search">
        <input class="files-search__search" value="" />
        <button class="files-search__btn">x</button>
      </div>
    `;
    this._searchInput = this._el.querySelector('.files-search__search');
    this._searchInput.addEventListener('input', this._onInput.bind(this));
  }

  _onInput(event) {
    this._store.dispatch(applyFilterAction(event.target.value));
  }

  destroy() {
    this._el.innerHTML = '';
    // this._unsubscribe();
  }
}
},{"../ActionTypes":4}],7:[function(require,module,exports){
const Types = {
  APPLY_FILTER: 'APPLY_FILTER',
  '@@init': '@@init'
};

module.exports = {
  ...Types
};
},{}],8:[function(require,module,exports){
document.addEventListener('DOMContentLoaded', () => {

const { Store, combineReducers } = require('redux-basic');
const SearchView = require('./SearchView');
const FilesView = require('./FilesView');
const Types = require('./Types');

function files(store, action) {
  switch(action.type) {
    case Types.APPLY_FILTER:
      if (action.filterValue !== '') {
        return store.map(file => {
          // escape взял из Интернета, чтоб время не тратить :)
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
},{"./FilesView":5,"./SearchView":6,"./Types":7,"redux-basic":3}]},{},[8]);
