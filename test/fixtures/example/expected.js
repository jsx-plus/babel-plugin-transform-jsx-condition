import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
import { createElement } from 'react';

function Foo(props) {
  return __create_condition__([[() => true, () => <View {...props} className="container">
      {__create_condition__([[() => condition, () => <View>First</View>]])}
      {__create_condition__([[() => condition, () => <View>First</View>], [() => another, () => <View>Second</View>], [() => true, () => <View>Third</View>]])}
      <View x-else>Third</View>
    </View>]]);
}
