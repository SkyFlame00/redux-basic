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