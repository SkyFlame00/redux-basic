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