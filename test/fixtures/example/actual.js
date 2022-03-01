import { createElement } from 'react';

function Foo(props) {
  const renderBlock = function () {
    return <View>Block</View>;
  };
  return (
    <View {...props} x-if={true} className="container">
      <View x-if={ifCondition}>First</View>
      {/* comment1 */}
      <View x-if={ifCondition}>
        x-if show
        {/* comment1-1 */}
        <View x-if={ifCondition}>x-if x-if show</View>
        {/* comment1-2 */}
        <View x-elseif={elseifCondition}>x-if x-elseif show</View>
        {/* comment1-3 */}
        <View x-else>x-if x-else show</View>
      </View>
      {/* comment2 */}
      <View x-elseif={elseifCondition}>
        x-elseif show
        <View x-if={ifCondition}>x-elseif x-if show</View>
        {renderBlock()}
        <View x-elseif={elseifCondition}>x-elseif x-elseif show</View>
        <View x-else>x-elseif x-else show</View>
      </View>
      <View x-else>
        x-else show
        <View x-if={ifCondition}>x-else x-if show</View>
        <View x-else>x-else x-else show</View>
      </View>
      <View x-else>Third</View>
    </View>
  )
}
