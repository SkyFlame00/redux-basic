module.exports = class FilesView {
  constructor(el, store) {
    this._el = el;
    this._store = store;
    this._unsubscribe = this._store.subscribe(
      this._prepareRender.bind(this)
    );
  }

  _prepareRender(state) {
    this._el.innerHTML = this.render(state);
  }

  render({ files }) {
    return files.map(file => {
      return `
        <tr class="table-files__item ${!file.isVisible ? 'table-files__item' : ''}">
          <td>${file.rawName}</td>
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
}