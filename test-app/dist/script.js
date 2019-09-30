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
const Types = {
  '@@init': '@@init',
  APPLY_FILTER: 'APPLY_FILTER',
  SET_REPOS: 'SET_REPOS',
  RENDER_FILES: 'RENDER_FILES'
};

module.exports = {
  ...Types
};
},{}],5:[function(require,module,exports){
const Types = require('../Types');

const applyFilterAction = filterValue => ({
  type: Types.APPLY_FILTER,
  filterValue
});

const setReposAction = repos => ({
  type: Types.SET_REPOS,
  repos
});

const renderFilesAction = (files, repo) => ({
  type: Types.RENDER_FILES,
  files,
  repo
});

module.exports = {
  applyFilterAction,
  setReposAction,
  renderFilesAction
};
},{"../Types":4}],6:[function(require,module,exports){
function init() {
  const { Store, combineReducers } = require('redux-basic');
  const HeaderMenuView = require('./views/HeaderMenuView');
  const SearchView = require('./views/SearchView');
  const FilesView = require('./views/FilesView');
  const PageTopView = require('./views/PageTopView');
  const { setReposAction, renderFilesAction } = require('./actionTypes')
  const { repos, filesPage } = require('./reducers');

  const reducer = combineReducers({
    filesPage,
    repos
  });

  const initialState = {
    repos: [],
    filesPage: {
      repo: '',
      files: []
    }
  };

  const store = new Store(reducer, initialState);

  const headerItemsContainer = document.body.querySelector('.header-items-container');
  const filesSearchWrapper = document.body.querySelectorAll('.files-actions__col')[1];
  const tableBody = document.body.querySelector('.table-files__body');
  const pageTop = document.body.querySelector('.page-top');

  const headerMenuView = new HeaderMenuView(headerItemsContainer, store);
  const searchView = new SearchView(filesSearchWrapper, store);
  const filesView = new FilesView(tableBody, store);
  const pageTopView = new PageTopView(pageTop, store);

  let repoName;

  fetch('http://localhost:8080/api/repos/')
    .then(res => res.json())
    .then(repos => {
      repoName = repos[0];
      store.dispatch(setReposAction(repos));
      return fetch('http://localhost:8080/api/repos/' + repos[0]);
    })
    .then(res => res.json())
    .then(rawFiles => {
      const files = rawFiles.map(file => ({
        rawName: file,
        outputName: file,
        isVisible: true
      }));
      store.dispatch(renderFilesAction(files, repoName));
    });
}

document.addEventListener('DOMContentLoaded', () => {

  init();

});
},{"./actionTypes":5,"./reducers":7,"./views/FilesView":8,"./views/HeaderMenuView":9,"./views/PageTopView":10,"./views/SearchView":11,"redux-basic":3}],7:[function(require,module,exports){
const Types = require('../Types');

function repos(store, action) {
  switch(action.type) {
    case Types.SET_REPOS:
      return action.repos || store;
    default:
      return store;
  }
}

function filesPage(store, action) {
  switch(action.type) {
    case Types.RENDER_FILES:
      return {
        repo: action.repo,
        files: action.files
      }
    case Types.APPLY_FILTER:
      if (action.filterValue !== '') {
        return {
          ...store,
          files: store.files.map(file => {
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
            })
        }
      }
    default:
      return {
        ...store,
        files: store.files.map(file => ({
          ...file,
          isVisible: true,
          outputName: file.rawName
        }))
      };
  }
}

module.exports = {
  repos,
  filesPage
};
},{"../Types":4}],8:[function(require,module,exports){
const View = require('../View');

module.exports = class FilesView extends View {
  constructor(el, store) {
    super(el, store);
    this._unsubscribe = this._store.subscribe(
      this._prepareRender.bind(this)
    );
    this._prepareRender(this._store.getState());
  }

  render(state) {
    return state.filesPage.files.map(file => {
      return `
        <tr class="table-files__item ${!file.isVisible ? 'table-files__item_nodisplay' : ''}">
          <td>${file.outputName}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td></td>
          <td>-</td>
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
},{"../View":12}],9:[function(require,module,exports){
const View = require('../View');
const { renderFilesAction } = require('../../actionTypes');

module.exports = class HeaderMenuView extends View {
  constructor(el, store) {
    super(el, store);
    this._unsubscribe = this._store.subscribe(
      this._prepareRenderLinks.bind(this)
    );
    this._prepareRender();

    this._btnOpenMenuEl = this._el.querySelector('.header-menu__link');
    this._menuEl = this._el.querySelector('.header-menu__dropdown');
    this._bindEvents();
  }

  render(state) {
    return `
      <ul class="header-menu">
          <li class="header-menu__item header-menu__dropdown-item header-menu__item_selected">
              <button class="header-menu__link">
                  <div class="header-menu__text"><b>Repository</b> <span>Arc</span></div><i class="i i-arrow i-arrow_color_primary i-arrow_size_s"></i>
              </button>
              <ul class="header-menu__dropdown">
                ${ this.renderLinks(state) }
              </ul>
          </li>
      </ul>
    `;
  }

  _bindEvents() {
    this._btnOpenMenuEl.addEventListener('click', () => {
      this._menuEl.classList.toggle('header-menu__dropdown_visible');
    });

    this._menuEl.addEventListener('click', event => {
      const link = event.target.closest('a');

      if (!link) return;

      const {repoId} = link.dataset;
      
      fetch('http://localhost:8080/api/repos/' + repoId)
        .then(res => res.json())
        .then(rawFiles => {
          const files = rawFiles.map(file => ({
            rawName: file,
            outputName: file,
            isVisible: true
          }));
          this._store.dispatch(renderFilesAction(files, repoId));
          this._menuEl.classList.toggle('header-menu__dropdown_visible');
        });
    });
  }

  _prepareRenderLinks() {
    this._menuEl.innerHTML = this.renderLinks(this._store.getState());
  }

  renderLinks(state) {
    return state && state.repos && state.repos.length > 0
      ? state.repos.map(repo =>
          `<li><a href="#" data-repo-id="${repo}">${repo}</a></li>`).join('')
      : '';
  }

  destroy() {
    this._unsubscribe();
    this._el.innerHTML = '';
  }
}
},{"../../actionTypes":5,"../View":12}],10:[function(require,module,exports){
const View = require('../View');

module.exports = class PageTopView extends View {
  constructor(el, store) {
    super(el, store);
    this._unsubscribe = this._store.subscribe(
      this._prepareRender.bind(this)
    );
  }

  render(state) {
    const repo = state && state.filesPage && state.filesPage.repo;

    return `
      <div class="breadcrumbs breadcrumbs_border_bottom"><a class="breadcrumbs__item breadcrumbs__item_selected">${repo}</a></div>
      <div class="page-title">
          <div class="page-title__title">${repo}</div>
          <div class="page-title__trunk">
              <div class="page-title__trunk">trunk</div><i class="i i-arrow i-arrow_color_secondary i-arrow_size_m"></i></div>
      </div>
    `;
  }

  destroy() {
    this._unsubscribe();
    this._el = '';
  }
}
},{"../View":12}],11:[function(require,module,exports){
const View = require('../View');
const { applyFilterAction } = require('../../actionTypes');

module.exports = class SearchView extends View {
  constructor(el, store) {
    super(el, store);
    this._prepareRender();
    this._bindEvents();
  }

  render() {
    return `
      <div class="files-search">
        <input class="files-search__search" value="" />
      </div>
    `;
  }

  _bindEvents() {
    this._searchInput = this._el.querySelector('.files-search__search');
    this._searchInput.addEventListener('input', this._onInput.bind(this));
  }

  _onInput(event) {
    this._store.dispatch(applyFilterAction(event.target.value));
  }

  destroy() {
    this._el.innerHTML = '';
  }
}
},{"../../actionTypes":5,"../View":12}],12:[function(require,module,exports){
module.exports = class View {
  constructor(el, store) {
    this._el = el;
    this._store = store;
  }

  _prepareRender(state) {
    this._el.innerHTML = this.render(state);
  }

  render() {
    throw new Error('This method should be overriden');
  }
}
},{}]},{},[6]);
