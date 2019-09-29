module.exports = class FilesView {
  constructor(el, store) {
    super(el, store);
    this._unsubscribe = this._store.subscribe(
      this._prepareRender.bind(this)
    );
    this._prepareRender(this._store.getState());
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