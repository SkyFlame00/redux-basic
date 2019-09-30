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