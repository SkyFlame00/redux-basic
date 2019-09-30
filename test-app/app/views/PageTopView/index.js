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