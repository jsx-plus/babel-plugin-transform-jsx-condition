import { createElement } from 'react';

function Foo() {
  return (
    <View x-if={true} className="container">
      <View x-if={condition}>First</View>
      <View x-if={condition}>First</View><View x-elseif={another}>Second</View><View x-else>Third</View>
      <View x-else>Third</View>
    </View>
  )
}
