import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Modal } from 'antd';
import SupplyInformation from '../../components/SupplyInformation/SupplyInformation';
import styles from './product-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 上下架状态
const GoodsStatusMap = ['default', 'success'];// 商品状态


class ProductTable extends React.Component {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    isShowModal: false,
    productId: '',
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }


  // 关闭供货信息弹窗
  onCancel = () => {
    this.setState({ isShowModal: false });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  // 点击供货信息
  handleSupplyInfoBtnClick = (productId) => {
    this.setState({ isShowModal: true, productId });
    this.props.querySupplyInfo(productId);
  }

  render() {
    const { selectedRowKeys, isShowModal } = this.state;
    const { data, loading, total, isShowAlert } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        fixed: 'left',
      },
      {
        title: '产品ID',
        dataIndex: 'pno',
        key: 'pno',
        width: 110,
        fixed: 'left',
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        render: val => val.map((item, idx) => {
          if (idx < 3) {
            return (
              <img
                className="product-thumb"
                alt={item.img_tyle}
                key={idx}
                src={item.img_url}
              />);
          }
        }),
        width: 150,
        fixed: 'left',
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: '型号',
        dataIndex: 'partnumber',
        align: 'partnumber',
        render: val => `${val}`,
        width: 150,
      },
      {
        title: '一级类目',
        dataIndex: 'category',
        render: val => (val.category_name),
        width: 100,
        key: 'menu-1',
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        render: val => (val.children.category_name),
        width: 100,
        key: 'menu-2',
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        render: val => (val.children.children.category_name),
        width: 150,
        key: 'menu-3',
      },
      {
        title: '四级类目',
        dataIndex: 'category',
        render: val => (val.children.children.children.category_name),
        width: 150,
        key: 'menu-4',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        width: 100,
      },
      {
        title: '已有商品条数',
        dataIndex: 'goods_count',
        width: 110,
      },
      {
        title: '创建人',
        dataIndex: 'staff_name',

      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        sorter: true,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a href={'#/product/list/detail?prdId=' + record.id}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => { this.props.editProduct(record.id); }}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => { this.handleSupplyInfoBtnClick(record.id); }}>供货信息</a>
          </Fragment>
        ),
        width: 180,
        fixed: 'right',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
      total,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.goods_count >= 1,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          {
            isShowAlert ?
              (
                <Alert
                  message={(
                    <div>
                      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                    </div>
                  )}
                  type="info"
                  showIcon
                />
              )
              :
              null
          }
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 2300 }}
        />
        {/* 供货信息 */}
        <Modal
          width="60%"
          visible={isShowModal}
          title="供货信息"
          okText=""
          cancelText=""
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <SupplyInformation productId={this.state.productId} />
        </Modal>
      </div>
    );
  }
}

export default ProductTable;
