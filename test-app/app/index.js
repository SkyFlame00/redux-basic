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