# babel-plugin-transform-jsx-condition

Support of transform jsx condition directive.

## Example

**In**

```jsx
// input code
<View x-if={condition}>First</View>
<View x-elseif={another}>Second</View>
<View x-else>Third</View>
```

**Out**

```jsx
{
  createCondition([
    [
      () => condition,
      () => <View}>First</View>
    ],
    [
      () => another,
      () => <View}>Second</View>
    ],
    [
      () => true,
      () => <View}>Third</View>
    ],
  ])
}
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
