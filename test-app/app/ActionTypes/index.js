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