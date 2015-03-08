var _debounce = require('amp-debounce'),
  _filter = require('amp-filter'),
  _union = require('amp-union'),
  _difference = require('amp-difference'),
  _each = require('amp-each'),
  raf = require('component-raf'),
  debug = require('debug')('ampersand-collection-filterable');

module.exports = {
  _filtersListening: false,
  _initFilters: function() {
    if (this._filtersListening === false) {
      // this.listenTo(this, 'add sync remove reset', this._refilter);

      this.listenTo(this, 'add', _debounce(this._refilterForAdd));
      this.listenTo(this, 'remove', _debounce(this._refilterForRemove));
      this.listenTo(this, 'reset sync', _debounce(this._refilterAll));

      this._filtersListening = true;
    }
  },
  // The active filter function.
  _filter: null,

  // Models in the collection that have been filtered out.
  _filtered: [],
  _refilterForAdd: function(model, collection, options) {
    debug('reflitering because of add');
    this._refilter(collection, options);
  },
  _refilterForRemove: function(model, collection, options) {
    if (options.filtering) return;

    debug('reflitering because of remove');
    this._refilter(collection, options);
  },
  _refilterAll: function(collection, options) {
    debug('refiltering because of sync|reset', arguments);
    this._refilter(collection, options);
  },
  _refilter: function(collection, options) {
    if (options.filtering) {
      return debug('nooop because we caused refilter');
    }
    this._applyFilter();
  },
  _applyFilter: function() {
    if (!this._filter) return null; // No active filter or empty.

    var newModels = _filter(_union(this.models, this._filtered), this._filter);
    var toRemove = _difference(this.models, newModels);
    _each(toRemove, function _removeForFilter(model) {
      this.remove(model, {
        filtering: true
      });
      this._filtered.push(model);
    }, this);

    var toAdd = _difference(newModels, this.models);

    _each(toAdd, function(model) {
      this.add(model, {
        filtering: true
      });
    }, this);

    debug('removed %d, added back %d', toRemove.length, toAdd.length);
    this.filtered = _difference(this.filtered, toAdd);
    this._lengthChanged();
  },
  _lengthChanged: function() {
    raf(function() {
      this.trigger('change:length', this.length);
    }.bind(this));
  },
  filter: function(fn) {
    debug('filtering');
    this._initFilters();
    this._filter = fn;
    this._applyFilter();
  },
  unfilter: function() {
    debug('unfiltering');
    _each(this._filtered, function(model) {
      this.add(model, {
        filtering: true
      });
    }, this);

    this._filtered = [];
    this._lengthChanged();
  }
};
