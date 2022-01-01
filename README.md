# Polygraph
Polygraph is a library for testing objects given a query that is constructed using logical and comparison operators.

```Javascript
const jobs = [...];
const query = and().gt('salary', 20000).any('title', ['Developer', 'Astronaut']).done();
const interestingJobs = jobs.filter(job => query.evaluate(job));
```

Polygraph is quite flexible and can:
- Construct complex queries easily
- Combine many queries into one
- Serialize and store it for later, or maybe push to a webworker.

## Installation

Modern browsers and bundlers (es):
```shell
$ npm install --save @wootapa/polygraph
```
```typescript
import { Polygraph } from '@wootapa/polygraph';
// Polygraph.and()... (types included)
```

Legacy (umd):
```javascript
<script src="https://unpkg.com/@wootapa/polygraph"></script>
// polygraph.and()...
```


## Methods

### Constructors
* `and()` - Creates new query with a root ```and``` logical operator.
* `or()` - Creates new builder with a root ```or``` logical operator.
* `not()` - Creates new builder with a root ```not``` logical operator.
* `fromJson(json)` - Creates new builder from a serialized builder.
* `define(alias, function)` - Defines a new operator.

### Logical operators
* `and()` - True if all child operators are true.
* `or()` - True if one of the child operators are true.
* `not()` - True if all child operators are false.

### Comparison operators
* `equals(key, value)` - True if object[key] equals to value. Alias=```eq```.
* `isNull(key)` - True if object[key] is null or undefined. Alias=```isnull```.
* `greaterThan(key, value)` - True if object[key] is greater than value. Alias=```gt```.
* `greaterThanEquals(key, value)` - True if object[key] is greater or equal to value. Alias=```gte```. 
* `lessThan(key, value)` - True if object[key] is less than value. Alias=```lt```.
* `lessThanEquals(key, value)` - True if object[key] is less or equal to value. Alias=```lte```.
* `like(key, value)` - True if object[key] is like value (case sensitive). Use * as wildcard. Alias=```like```.
* `ilike(key, value)` - True if object[key] is like value (case insensitive). Use * as wildcard. Alias=```ilike```.
* `any(key, values[])` - True if object[key] equals to any of the values.

### Evaluation
* `evaluate(object)` - Evaluates object. True if object passed all operators.

### Logical traversal
* `done()` - Moves up to root logical.
* `up()` - Moves up to parent logical.
* `down()` - Moves to first logical child.
* `next()` - Moves to next logical sibling.
* `prev()` - Moves to previous logical sibling.

### Other
* `asJson()` - Serializes to json. Restore with ```fromJson```.
* `asTree()` - Returns a more human readable tree.
* `clone()` - Returns a deeply cloned builder.
* `clear()` - Clears all operators and below.
* `operator(alias, key, value?, opts?)` - Use operator by its alias.
* `op(alias, key, value?, opts?)` - shorthand for above.
* `addBuilder(builder)` - Adds another builder.
* `getReport()` - Returns a report with statistics. Useful for finding the breaking operator or bottlenecks.
* `resetReport()` - Reset statistics.
* `getKeysAndValues()` - Returns keys and values for all comparison operators. This can be useful when restoring state to something (forms etc). If the same key has been used multiple times an array of values are returned.

## An example
So maybe you have a bunch of movies and you want some good comedies.
```javascript
const q = and().eq('category', 'comedy').gte('ranking', 6).done();
```
However, you just realized you have issues with some actors.
```javascript
q.not().any('actor', ['Jim Carrey', 'Ben Stiller']).done();
```
Its better, but you heard there will be kids around.
```javascript
q.eq('rating', 'G').done();
```
Also, you know your buddy likes the old movies better.
```javascript
q.gt('year', new Date(1990,0)).lt('year', new Date(2000,0)).done();
```

In the end, this is the result.
```javascript
const q = and()  // <- Will only return true if all children do
    .eq('category', 'comedy') // <- category must be comedy
    .gte('ranking', 6) // <- ranking must be greater than 6
    .not() // <- Will only return true if all children are false
        .any('actor', ['Jim Carrey', 'Ben Stiller']) // <- actors must not be these
        .up() // <- Moves up one level to 'and' operator
    .eq('rating', 'G') // <- rating must be G
    .gt('year', new Date(1990,0)) // <- year must be greater than 1990
    .lt('year', new Date(2000,0)) // <- year must be less than 2000
    .done() // <- moves to the root 'and' operator (which is unnecessary here but easy to forget)

const movies = [...];
const comedies = movies.filter(q.evaluate);
```

## Custom operator
With ```define``` you can create your own operator.
Supply an alias and a function that takes a value and returns a boolean.
```javascript
define('divisibleby2', (value: number) => value % 2 === 0);
```
Then use it with the ```operator``` (or shorthand ```op```) method.
```javascript
and().op('divisibleby2', 'age').done().evaluate({ age: 20 }); // => true
```
The operator will survive serialization, but can break or have sideffects if you depend on ```this``` or some other state that might not be there after deserialization.

## Aliases
All operators (except `any`) can be used with its alias, just as custom operators. It can be useful in situations where you simply want polygraph to figure out the operator for you.
For example, the following is equivalent:
```javascript
and().eq('name', 'Foo').gte('age', 20).done();
and().op('eq', 'name', 'Foo').op('gte', 'age', 20).done();
```

## Objects
Polygraph tries to be somewhat intelligent, so the evaluating object can be a plain dict, have nested properties...or be a function.
So, given the following:
```javascript
const person = {
    name: {
        first: 'Nariyoshi',
        last: 'Miyagi'
    },
    age: () => 60
};
```
Nested properties will resolve.
```javascript
and().eq('name.first', 'Nariyoshi').done().evaluate(person); // => true
```

Property functions also resolves.
```javascript
and().gte('age', 50).done().evaluate(person); // => true
```

You can also pass a function and resolve values anyway you want. Key is passed as argument.
```javascript
and().eq('name.first', 'Nariyoshi').done().evaluate(key => {
    if (key === 'name.first') {
        return person.name.first;
    }
}); // => true
```
Which then means you can have nonexistent properties if you want.
```javascript
and().eq('isKarateMan', true).done().evaluate(key => {
    if (key === 'isKarateMan') {
        return person.name.first === 'Nariyoshi' && person.name.last === 'Miyagi';
    }
}); // => true
```