var assert = require('assert'),
  collectionFilterable = require('../ampersand-collection-filterable'),
  AmpersandCollection = require('ampersand-collection'),
  AmpersandState = require('ampersand-state');

var Candy = AmpersandState.extend({
  props: {
    id: 'number',
    name: 'string'
  }
});

var CandyCollection = AmpersandCollection.extend(collectionFilterable, {
  model: Candy
});

var bag = new CandyCollection([
  {
    id: 1,
    name: 'Reese\'s Egg'
  },
  {
    id: 2,
    name: 'Snickers'
  },
  {
    id: 3,
    name: 'Three Musketeers'
  },
  {
    id: 4,
    name: 'Milky Way'
  },
  {
    id: 5,
    name: 'Twix'
  }
]);

describe('ampersand-collection-filterable', function() {
  it('should not puke', function() {
    bag._initFilters();
    bag.add({
      id: 7,
      name: 'Reese\'s Peanut Butter Cup'
    });
    bag.remove(7);
  });
  it('should filter out candy that does not start with `T`', function(done) {
    bag.once('change:length', function(newLength) {
      assert.equal(newLength, 2);
      done();
    });
    bag.filter(function(candy) {
      return candy.name.charAt(0) === 'T';
    });
  });

  it('should maintain the filter if another candy added', function(done) {
    bag.add({
      id: 6,
      name: 'Peppermint Patty'
    });
    setTimeout(function() {
      assert.equal(bag.models.length, 2);
      assert.equal(bag._filtered.length, 4);
      done();
    }, 100);
  });

  it('should handle indirect removes', function(done) {
    bag.remove(5);
    setTimeout(function() {
      assert.equal(bag.models.length, 1);
      assert.equal(bag._filtered.length, 4);
      done();
    }, 100);
  });

  it('should add back all candies when unfiltered', function(done) {
    bag.once('change:length', function(newLength) {
      assert.equal(newLength, 5);
      done();
    });
    bag.unfilter();
  });

  it('should handle indirect resets', function(done) {
    bag.reset();
    setTimeout(function() {
      assert.equal(bag.models.length, 0);
      assert.equal(bag._filtered.length, 0);
      done();
    }, 100);
  });
});
