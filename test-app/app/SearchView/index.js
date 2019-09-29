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
    this._searchInput = this._el.querySelector('files-search__search');
    this._searchInput.addEventListener('change', this._onInput);
  }

  _onInput(event) {
    this._store.dispatch(applyFilterAction(event.target.value));
  }
}