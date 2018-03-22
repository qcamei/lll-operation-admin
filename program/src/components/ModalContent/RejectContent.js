/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-22 14:13:51
 */

import React, { PureComponent } from 'react';
import { Row, Col, Select, Input } from 'antd';

import styles from './modal-content.less';

const { Option } = Select;
const { TextArea } = Input;

// 无货驳回弹出层内容 
export default class RejectContent extends PureComponent {
   // 处理下拉列表改变
   handleSelectChange = (key, value) => {
    const { data, onChange } = this.props;     
    const tempJson = {};
    tempJson[key] = value;
    onChange({
      ...data,
      ...tempJson,
    });
  }

  // 处理输入框改变
  handleTextChange = (key, text) => {
    const { data, onChange } = this.props;        
    const tempJson = {};
    tempJson[key] = text;
    onChange({
      ...data,
      ...tempJson,
    });
  }

  render() {
    const { data } = this.props;    
    console.log('无货驳回modal', data);
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：123456789</Col>
          <Col span={12}>下单时间：2017-01-02 12:12:11</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：长沙ABC公司</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：长沙DEF公司</Col>
        </Row>
        <Row>
          <Col span={5}>说明：</Col>
          <Col span={12}>
            <TextArea
              value={data.desc}
              onChange={(e) => { this.handleTextChange('desc', e.target.value); }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}