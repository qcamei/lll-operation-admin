import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Row, Col, Form, Input, Select, Icon, DatePicker, Modal, message, Divider, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';
import { handleServerMsgObj } from '../../utils/tools';
import styles from './order-list.less';

const { Option } = Select;
const FormItem = Form.Item;
// 订单状态
const returnsStatus = ['申请退货中', '退货中', '退货失败', '退货完成'];
// 处理状态
const dealStatus = ['未处理', '已处理'];

// 退货单列表
@connect(({ returns, loading }) => ({
  returns,
  loading: loading.models.returns,
}))
@Form.create()
export default class ReturnsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
  }

  componentDidMount() {
    console.log('我渲染好了', this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'returns/fetch',
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 处理表单搜索
  handleSearch = (e) => {
    e.preventDefault();
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        start_time: fieldsValue.create_time ? fieldsValue.create_time[0].format('YYYY-MM-DD') : '',
        end_time: fieldsValue.create_time ? fieldsValue.create_time[1].format('YYYY-MM-DD') : '',
      };

      console.log('搜索字段', values);
      dispatch({
        type: 'orders/fetchSearch',
        data: values,
      });
    });
  }

  // 是否展开查询条件表单
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  jumpToPage = (url) => {
    const { history } = this.props;
    history.push(url);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'returns/fetch',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货单编号">
              {getFieldDecorator('returns_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="源订单编号">
              {getFieldDecorator('order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('is_deal')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">通过</Option>
                  <Option value="3">未通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货单编号">
              {getFieldDecorator('returns_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="源订单编号">
              {getFieldDecorator('order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('is_deal')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">通过</Option>
                  <Option value="3">未通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="客户公司名称">
              {getFieldDecorator('guest_company_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="供应商公司名称">
              {getFieldDecorator('supplier_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货状态">
              {getFieldDecorator('return_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">申请退货组</Option>
                  <Option value="2">退货中</Option>
                  <Option value="3">已退货完成</Option>
                  <Option value="4">退货失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { returns, loading } = this.props;
    const { total, list } = returns;


    const columns = [
      {
        title: '退货单编号',
        dataIndex: 'returns_sn',
        key: 'returns_sn',
        width: 200,
        fixed: 'left',
      },
      {
        title: '源订单编号',
        dataIndex: 'order_sn',
        key: 'order_sn',
        width: 200,
        fixed: 'left',
      },
      {
        title: '客户公司名称',
        dataIndex: 'guest_company_name',
        align: 'guest_company_name',
        width: 150,
        fixed: 'left',
        render: val => `${val}`,
      },
      {
        title: '供应商公司名称',
        dataIndex: 'supplier_company_name',
        key: 'supplier_company_name',
        width: 150,
        fixed: 'left',
      },
      {
        title: '退货申请时间',
        dataIndex: 'return_add_time',
        key: 'return_add_time',
        sorter: true,
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '交易总金额(元)',
        dataIndex: 'subtotal_money',
        key: 'subtotal_money',
        width: 150,
      },
      {
        title: '退货金额(元)',
        dataIndex: 'return_money',
        key: 'return_money',
        width: 150,
      },
      {
        title: '退货状态',
        dataIndex: 'return_status',
        key: 'return_status',
        width: 150,
        render: text => (<span>{returnsStatus[text - 1]}</span>),
      },
      {
        title: '处理状态',
        dataIndex: 'is_deal',
        key: 'is_deal',
        width: 150,
        render: text => (<span><Badge status={text === 2 ? 'success' : 'default'} />{dealStatus[text - 1]}</span>),
      }, 
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a href={`#/returns/list/detail?orderId=${record.return_id}&audit=1`} >审核</a>
            <Divider type="vertical" />
            <a href={'#/returns/list/detail?orderId=' + record.return_id}>查看</a>
          </Fragment>
        ),
        width: 150,
        fixed: 'right',
      },
    ];

    return (
      <PageHeaderLayout title="退货单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <CustomizableTable
              onHandleOrderClick={this.handleModalToggle}
              data={list}
              columns={columns}
              loading={loading}
              onChange={this.handleStandardTableChange}
              total={total}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
