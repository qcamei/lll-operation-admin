import React from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { STOCK_OPERATION_STATUS } from "../../constant/statusList"
export default class GoodsStockTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { total, data, loading, onRecordChange, current, pageSize } = this.props;
        data.map((ele, idx) => {
            ele.idx = idx + 1;
        })
        const columns = [{
            title: "序号",
            width:60,
            dataIndex: "idx",
            key: 'idx'
        }, {
            title: "单号",
            dataIndex: 'order_id',
            key: "order_id"
        },
        {
            title: "供应商名称",
            key: "supplier_name",
            dataIndex: "supplier_name"
        },
        {
            title: "操作类型",
            dataIndex: "change_option",
            key: 'change_option',
            render: (val) => <span>{STOCK_OPERATION_STATUS[val]}</span>
        }, {
            title: "库存变动数量",
            dataIndex: "change_count",
            key: "change_count"
        }, {
            title: "商品ID",
            dataIndex: "gno",
            key: 'gno',
        },
        {
            title: "产品名称",
            key: 'product_name',
            dataIndex: "product_name"
        }, {
            title: "产品型号",
            key: 'partnumber',
            dataIndex: "partnumber"
        }, {
            title: "品牌",
            key: 'brand_name',
            dataIndex:"brand_name"
        }, {
            title: "产地",
            key: 'registration_place',
            dataIndex:"registration_place"
        }, {
            title: "操作人",
            dataIndex: "operator",
            key: 'operator',
        },
        {
            title: "操作时间",
            dataIndex: "add_time",
            key: 'add_time',
            render: (val) => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const paginationOptions = {
            total,
            current,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true
        }
        return (
            <Table columns={columns} dataSource={data}
                loading={loading}
                rowKey={record => record.idx}
                pagination={paginationOptions}
                scroll={{ x: 1500 }}
                onChange={onRecordChange}
            />
        )
    }
}