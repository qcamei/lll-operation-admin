import React, { Component } from 'react';
import { Form, Cascader, message, Input, Row, Col, Upload, Icon, Modal, Button, Tabs } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';
import { checkFile, getFileSuffix } from '../../utils/tools';
import styles from './product-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const FILE_TYPES = ['jpg', 'png', 'gif']; // 支持上传的文件类型

function getStanrdCatalog(data) {
  data.forEach((val) => {
    val.value = val.id;
    val.label = val.category_name;
    if (val.children.length > 0) {
      getStanrdCatalog(val.children);
    }
  });
}

@Form.create({
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.state = {
      previewVisible: false,
      previewImage: '',
      isPicture: true,
      file: { uid: '', name: '' },
      pics: [], // 产品图片集合
      a: [],
      b: [],
      c: [],
      d1: [],
      d2: [],
      d3: [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 输入框有改变时
  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  // 图片上传前处理：验证文件类型
  beforeUpload(key, file) {
    this.setState({ file });
    // console.log('before', file);
    if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // 图片上传时处理
  handleUploaderChange(key, fileList) {
    const { pics } = this.state;
    const { onAttrChange } = this.props;
    if (this.state.isPicture) {
      const tempJson = {};
      tempJson[key] = fileList;
      this.setState(tempJson);
      // console.log('状态改变', fileList);
      const that = this;
      // 上传成功，则将图片放入state里的pics数组内
      fileList.map((file) => {
        if (file.status === 'done') {
          message.success(`${file.name} 文件上传成功`);
          // that.setState({ file_url: file.response.key });
          if (key === 'a') {
            this.setState({ pics: [...pics, { img_type: '正面', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '正面', img_url: file.response.key }] });
          } else if (key === 'b') {
            this.setState({ pics: [...pics, { img_type: '反面', img_url: file.response.key }] });            
            onAttrChange({ pics: [...pics, { img_type: '反面', img_url: file.response.key }] });            
          } else if (key === 'c') {
            this.setState({ pics: [...pics, { img_type: '侧面', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '侧面', img_url: file.response.key }] });
          } else if (key.substr(0, 1) === 'd') {
            this.setState({ pics: [...pics, { img_type: '包装图', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '包装图', img_url: file.response.key }] });
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
        return file;
      });
    }
  }

  render() {
    console.log('state:', this.state);
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;
    const { catalog, uploadToken } = this.props;
    const UPLOAD_URL = '//up.qiniu.com'; // 文件上传地址
    const { previewVisible, previewImage, a, b, c, d1, d2, d3, file } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    getStanrdCatalog(catalog);// 将服务器目录结构转换成组件标准结构    
    // console.log('目录', uploadToken);

    return (
      <div className={styles['product-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
              })(
                <Cascader
                  options={catalog}
                  placeholder="请您选择类目"
                />
              )}
            </FormItem>
            <FormItem
              label="产品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('brand_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('english_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
              })(
                <Input />
              )}
            </FormItem>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label="CAD图"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10 }}
                >
                  <Upload>
                    <Button icon="upload">上传</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label=""
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 10, offset: 9 }}
                >
                  <span>商品设计图.cad</span>
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem
                  labelCol={{ span: 1 }}
                  wrapperCol={{ span: 23 }}
                >
                  <span>2017-12-29 12:36:45</span>
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem
                  labelCol={{ span: 1 }}
                  wrapperCol={{ span: 12 }}
                >
                  <div>
                    <a>删除</a>
                    <a>查看</a>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div >
        {/* 商品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', maxWidth: 360 }}>
          <h3>商品图片</h3>
          <Row gutter={24}>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('a', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {a.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">正面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}                
                onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {b.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">反面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"              
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}                
                onChange={({ fileList }) => { this.handleUploaderChange('c', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {c.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">侧面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"              
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}                
                onChange={({ fileList }) => { this.handleUploaderChange('d1', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d1.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"              
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}                
                onChange={({ fileList }) => { this.handleUploaderChange('d2', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d2.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"              
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}                
                onChange={({ fileList }) => { this.handleUploaderChange('d2', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d3.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>
            </Col>
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditor
                onChange={(html) => { this.handleChange('faq', html); }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}

export default ProductForm;

