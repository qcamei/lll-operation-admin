import React, { Component } from 'react';
import { Form, Row, Col, Upload, Modal, Tabs, message } from 'antd';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import { checkFile, replaceObjFromArr } from '../../utils/tools';
import styles from './good-form.less';


const FormItem = Form.Item;
const { TabPane } = Tabs;
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型
const mapImageType = ['正面', '侧面', '反面', '包装图一', '包装图二', '包装图三'];

// 拼凑单个商品图片数据
function getPic(key, pics) {
  if (!Array.isArray(pics)) {
    throw new Error('传参必须是一个数组');
  }
  const pic = pics.filter(val => (val.img_type === key));
  if (pic.length > 0) {
    return [{ uid: pic[0].id, name: pic[0].img_type, url: pic[0].img_url }];
  } else {
    return [];
  }
}

@Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const fields = {};
    Object.keys(data).forEach((key) => {
      fields[key] = Form.createFormField({
        value: data[key],
      });
    });
    return {
      ...fields,
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
@Form.create()
export default class NewGoodForm extends Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleUploaderChange = this.handleUploaderChange.bind(this);
    this.pics = [];
    this.state = {
      previewVisible: false,
      previewImage: '',
      isPicture: true,
      isCad: true,
      file: { uid: '', name: '' },
      pics: this.pics, // 产品图片集合
      cad_url: [], // 产品cad文件集合
      a: getPic('正面', ['this.pics']),
      b: getPic('反面', ['this.pics']),
      c: getPic('侧面', ['this.pics']),
      d1: getPic('包装图1', ['this.pics']),
      d2: getPic('包装图2', ['this.pics']),
      d3: getPic('包装图3', ['this.pics']),
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('will reiceve', nextProps);
  }


  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  // 图片上传前处理：验证文件类型
  beforeUpload(key, file) {
    this.setState({ file });
    // console.log('before', file);
    if (checkFile(file.name, ['cad'])) {
      this.setState({ isCad: true });
    } else if (checkFile(file.name, FILE_TYPES)) {
      this.setState({ isPicture: true });
    }
    if (key === 'cad_url') {
      if (!checkFile(file.name, ['cad', 'dwt', 'dwg', 'dws', 'dxf'])) {
        message.error(`${file.name} 暂不支持上传`);
        this.setState({ isCad: false });
        return false;
      }
    } else if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // cad和图片上传时处理
  handleUploaderChange(key, fileList) {
    console.log('文件上传', key, fileList);
    const { pics, cad_url } = this.state;
    const { onAttrChange } = this.props;
    // 如果上传的是cad文件
    if (key === 'cad_url' && this.state.isCad) {
      fileList.slice(-1).forEach((file) => {
        if (file.status === 'done') {
          this.setState({ cad_url: [...cad_url, file.response.key] });
          onAttrChange({ cad_url: [...cad_url, file.response.key] });
        }
      });
      return;
    }
    // 如果上传的是图片
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
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '正面', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '正面', img_url: file.response.key }] });
          } else if (key === 'b') {
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '反面', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '反面', img_url: file.response.key }] });
          } else if (key === 'c') {
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '侧面', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '侧面', img_url: file.response.key }] });
          } else if (key.substr(0, 1) === 'd') {
            const idx = key.substr(1, 1);
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '包装图' + idx, img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '包装图' + idx, img_url: file.response.key }] });
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
        return file;
      });
    } else if (this.state.isCad) {
      console.log('cad fileList', fileList);
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { md: { span: 4 }, xxl: { span: 3 } },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const { data, loading } = this.props;
    const { category } = data;
    const slectedCatagory = category ? [
      category.category_name,
      category.children.category_name,
      category.children.children.category_name,
      category.children.children.children.category_name,
    ] : [];
    const { previewVisible, previewImage, a, b, c, d1, d2, d3, file } = this.state;

    let uploaders = []; // 商品图片
    let uploaderCAD = []; // 商品cad图   
    if (data.pics) {
      // 商品图片集合
      uploaders = data.pics.map(val => (
        <Col span={8} key={val.id}>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '测试',
              url: val.img_url,
            }]}
            onPreview={this.handlePreview}
            onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
          />
          <p className="upload-pic-desc">{mapImageType[val.img_type - 1]}</p>
        </Col>
      ));
      // 商品cad图
      if (data.cad_url) {
        uploaderCAD = data.cad_url.map((val, idx) => (
          <Col span={8} key={idx}>
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              listType="picture-card"
              fileList={[{
                uid: -1,
                name: 'CAD文件预览失败',
                url: val,
              }]}
              onPreview={this.handlePreview}
              onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
            />
            <p className="upload-pic-desc">cad图</p>
          </Col>
        ));
      }
    }


    return (
      <div className={styles['good-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal" style={{ width: '100%' }}>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              <span>{data.pno}</span>
            </FormItem>
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              <span>{slectedCatagory.join('-')}</span>
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              <span>{data.partnumber}</span>
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              <span>{data.brand_name}</span>
            </FormItem>
            <FormItem
              label="品牌英文名"
              {...formItemLayout}
            >
              <span>{data.english_name}</span>
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              <span>{data.prodution_place}</span>
            </FormItem>
          </Form>
        </div >
        {/* 产品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', width: '50%', maxWidth: 360 }}>
          <h3>产品图片</h3>
          <Row gutter={24}>
            {uploaders}
          </Row>
          <h3>CAD图</h3>
          <Row gutter={24}>
            {uploaderCAD}
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <RichEditorShow content={data.summary ? data.summary : ''} />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <RichEditorShow content={data.description ? data.description : ''} />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditorShow content={data.faq ? data.faq : ''} />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}
