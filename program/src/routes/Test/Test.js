import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';
import { HOME_PAGE } from '../../constant/config';

@connect((state) => {
  return { ...state };
})
class Test extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'user/verify',
    });
  }

  render() {
    return <div>跳转中...</div>;
  }
}
export default Test;
