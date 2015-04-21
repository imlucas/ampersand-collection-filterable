# ampersand-collection-filterable

[![build status](https://secure.travis-ci.org/mongodb-js/ampersand-collection-filterable.png)](http://travis-ci.org/mongodb-js/ampersand-collection-filterable)

Simple filterable ampersand collections

## Example

```javascript
var filterable = require('../ampersand-collection-filterable'),
  AmpersandCollection = require('ampersand-collection'),
  AmpersandState = require('ampersand-state');

var Candy = AmpersandState.extend({
  props: {
    id: 'number',
    name: 'string'
  }
});

var CandyCollection = AmpersandCollection.extend(filterable, {model: Candy});

var bag = new CandyCollection([
  {id: 1, name: 'Reese\'s Egg'},
  {id: 2, name: 'Snickers'},
  {id: 3, name: 'Three Musketeers'},
  {id: 4, name: 'Milky Way'},
  {id: 5, name: 'Twix'}
]);

bag.filter(function(candy){
  return candy.name === 'Twix';
});

assert.equal(bag.length, 1);

bag.add({id: 6, name: 'Peppermint Patty'});

assert.equal(bag.length, 1);

bag.unfilter();

assert.equal(bag.length, 6);
```

## Installation

```
npm install --save ampersand-collection-filterable
```

## Testing

```
npm test
```

## License

MIT
