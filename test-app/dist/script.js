(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = class Store {
  constructor(reducer) {
    this._reducer = reducer;
    this._listeners = [];
    this._state = undefined;
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
    this._listeners.forEach(listener => listener(this._state));
  }
}
},{}],2:[function(require,module,exports){
module.exports = function combineReducers(reducers) {
  return (previousState, action) => {
    return Object.keys(reducers).reduce((state, key) => {
      state[key] = reducers[key](previousState[key], action);
      return state;
    }, {});
  }
}
},{}],3:[function(require,module,exports){
module.exports = {
  combineReducers: require('./combineReducers/index'),
  Store: require('./Store/index')
}
},{"./Store/index":1,"./combineReducers/index":2}],4:[function(require,module,exports){
const Redux = require('redux-basic');

console.log(Redux);
},{"redux-basic":3}]},{},[4]);
