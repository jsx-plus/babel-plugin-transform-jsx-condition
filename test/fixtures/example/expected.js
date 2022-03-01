import { createCondition as __create_condition__ } from "babel-runtime-jsx-plus";
import { createElement } from 'react';

function Foo(props) {
  const renderBlock = function () {
    return <View>Block</View>;
  };

  return __create_condition__([[() => true, () => <View {...props} className="container">
      {__create_condition__([[() => ifCondition, () => <View>First</View>]])}
      {
      /* comment1 */
    }
      {__create_condition__([[() => ifCondition, () => <View>
        x-if show
        {
        /* comment1-1 */
      }
        {__create_condition__([[() => ifCondition, () => <View>x-if x-if show</View>], [() => elseifCondition, () => <View>x-if x-elseif show</View>], [() => true, () => <View>x-if x-else show</View>]])}
        {
        /* comment1-2 */
      }
        
        {
        /* comment1-3 */
      }
        
      </View>], [() => elseifCondition, () => <View>
        x-elseif show
        {__create_condition__([[() => ifCondition, () => <View>x-elseif x-if show</View>]])}
        {renderBlock()}
        <View x-elseif={elseifCondition}>x-elseif x-elseif show</View>
        <View x-else>x-elseif x-else show</View>
      </View>], [() => true, () => <View>
        x-else show
        {__create_condition__([[() => ifCondition, () => <View>x-else x-if show</View>], [() => true, () => <View>x-else x-else show</View>]])}
        
      </View>]])}
      {
      /* comment2 */
    }
      
      
      <View x-else>Third</View>
    </View>]]);
}