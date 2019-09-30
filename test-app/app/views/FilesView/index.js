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