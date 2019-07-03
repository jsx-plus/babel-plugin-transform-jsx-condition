# babel-plugin-transform-jsx-condition

Support of transform jsx condition directive.

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-transform-jsx-condition
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-jsx-condition"]
}
```

### Via CLI

```sh
$ babel --plugins transform-jsx-condition script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-jsx-condition"]
});
```
