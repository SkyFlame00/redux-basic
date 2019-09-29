module.exports = class View {
  constructor(el, store) {
    this._el = el;
    this._store = store;
  }

  _prepareRender(state) {
    this._el.innerHTML = this.render(state);
  }

  render() {
    throw new Error('This method should be overriden');
  }
}