module.exports = class Store {
  constructor(reducer, initialState) {
    this._reducer = reducer;
    this._listeners = [];
    this._state = initialState;
    this.dispatch({ type: '@@init' });
  }

  getState() {
    return this._state;
  }

  subscribe(callback) {
    this._listeners.push(callback);
    return () => {
      const index = this._listeners.indexOf(callback);
      this._listeners.splice(index, 1);
    }
  }

  dispatch(action) {
    this._state = this._reducer(this._state, action);
    this._notifyListeners();
  }

  _notifyListeners() {
    this._listeners.forEach(listener => listener(this.getState()));
  }
}