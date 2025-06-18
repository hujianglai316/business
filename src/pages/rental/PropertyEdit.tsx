import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Card, Space, message, Modal } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;

interface PropertyFormData {
  name: string;
  type: string;
  rentType: string;
  area: number;
  layout: string;
  price: number;
  address: string;
  floor: string;
  orientation: string;
  decoration: string;
  facilities: string[];
  description: string;
  images: UploadFile[];
  ownershipProof?: UploadFile[];
  businessLicense?: UploadFile[];
  minRentPeriod: number;
  depositType: string;
}

const PropertyEdit: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 模拟获取房源数据
  const fetchPropertyData = async (propertyId: string) => {
    // 实际项目中应该从API获取数据
    return {
      name: '阳光花园 2室1厅',
      type: '住宅',
      rentType: '整租',
      area: 85,
      layout: '2室1厅1卫',
      price: 5000,
      address: '北京市朝阳区建国路88号',
      floor: '12/18层',
      orientation: '南北通透',
      decoration: '精装修',
      facilities: ['空调', '热水器', '洗衣机'],
      description: '房屋采光好，交通便利，周边配套设施齐全。',
      minRentPeriod: 3,
      depositType: '押一付一',
    };
  };

  React.useEffect(() => {
    if (id) {
      fetchPropertyData(id).then(data => {
        form.setFieldsValue(data);
      });
    }
  }, [id, form]);

  const onFinish = async (values: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      // 实际项目中应该调用API保存数据
      console.log('Success:', values);
      message.success('保存成功');
      navigate('/rental/property');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = () => {
    form.validateFields().then(values => {
      Modal.confirm({
        title: '提交审核',
        content: '确定要提交房源信息进行审核吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 实际项目中应该调用API提交审核
          message.success('提交审核成功');
          navigate('/rental/property');
        },
      });
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      Modal.confirm({
        title: '保存修改',
        content: '确定要保存当前修改吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          onFinish(values);
        },
      });
    });
  };

  return (
    <div>
      <h2>{id ? '编辑房源' : '新增房源'}</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={true}
        >
          <Form.Item
            label="房源名称"
            name="name"
            rules={[{ required: true, message: '请输入房源名称' }]}
          >
            <Input placeholder="请输入房源名称" />
          </Form.Item>

          <Form.Item
            label="房源类型"
            name="type"
            rules={[{ required: true, message: '请选择房源类型' }]}
          >
            <Select placeholder="请选择房源类型">
              <Option value="住宅">住宅</Option>
              <Option value="公寓">公寓</Option>
              <Option value="别墅">别墅</Option>
              <Option value="商铺">商铺</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="租赁方式"
            name="rentType"
            rules={[{ required: true, message: '请选择租赁方式' }]}
          >
            <Select placeholder="请选择租赁方式">
              <Option value="整租">整租</Option>
              <Option value="合租">合租</Option>
              <Option value="短租">短租</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="面积"
            name="area"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber min={1} addonAfter="㎡" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="户型"
            name="layout"
            rules={[{ required: true, message: '请选择户型' }]}
          >
            <Select placeholder="请选择户型">
              <Option value="1室0厅1卫">1室0厅1卫</Option>
              <Option value="1室1厅1卫">1室1厅1卫</Option>
              <Option value="2室1厅1卫">2室1厅1卫</Option>
              <Option value="2室2厅1卫">2室2厅1卫</Option>
              <Option value="2室2厅2卫">2室2厅2卫</Option>
              <Option value="3室1厅1卫">3室1厅1卫</Option>
              <Option value="3室2厅1卫">3室2厅1卫</Option>
              <Option value="3室2厅2卫">3室2厅2卫</Option>
              <Option value="4室2厅2卫">4室2厅2卫</Option>
              <Option value="4室2厅3卫">4室2厅3卫</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="月租金"
            name="price"
            rules={[{ required: true, message: '请输入月租金' }]}
          >
            <InputNumber min={1} prefix="¥" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            label="楼层"
            name="floor"
            rules={[{ required: true, message: '请输入楼层' }]}
          >
            <Input placeholder="例如：12/18层" />
          </Form.Item>

          <Form.Item
            label="朝向"
            name="orientation"
            rules={[{ required: true, message: '请选择朝向' }]}
          >
            <Select placeholder="请选择朝向">
              <Option value="南北通透">南北通透</Option>
              <Option value="东西朝向">东西朝向</Option>
              <Option value="东南">东南</Option>
              <Option value="西南">西南</Option>
              <Option value="东北">东北</Option>
              <Option value="西北">西北</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="装修情况"
            name="decoration"
            rules={[{ required: true, message: '请选择装修情况' }]}
          >
            <Select placeholder="请选择装修情况">
              <Option value="精装修">精装修</Option>
              <Option value="简装">简装</Option>
              <Option value="毛坯">毛坯</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="最短起租周期"
            name="minRentPeriod"
            rules={[{ required: true, message: '请输入最短起租周期' }]}
          >
            <InputNumber min={1} addonAfter="月" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="押金方式"
            name="depositType"
            rules={[{ required: true, message: '请选择押金方式' }]}
          >
            <Select placeholder="请选择押金方式">
              <Option value="无押金">无押金</Option>
              <Option value="押一付一">押一付一</Option>
              <Option value="押二付一">押二付一</Option>
              <Option value="押三付一">押三付一</Option>
              <Option value="押一付二">押一付二</Option>
              <Option value="押二付二">押二付二</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="配套设施"
            name="facilities"
            rules={[{ required: true, message: '请选择配套设施' }]}
          >
            <Select mode="multiple" placeholder="请选择配套设施">
              <Option value="空调">空调</Option>
              <Option value="热水器">热水器</Option>
              <Option value="洗衣机">洗衣机</Option>
              <Option value="冰箱">冰箱</Option>
              <Option value="电视">电视</Option>
              <Option value="宽带">宽带</Option>
              <Option value="衣柜">衣柜</Option>
              <Option value="沙发">沙发</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="房源描述"
            name="description"
            rules={[{ required: true, message: '请输入房源描述' }]}
          >
            <TextArea rows={4} placeholder="请输入房源详细描述" />
          </Form.Item>

          <Form.Item
            label="房源图片"
            name="images"
            rules={[{ required: true, message: '请上传房源图片' }]}
          >
            <Upload
              listType="picture-card"
              multiple
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="产权证明"
            name="ownershipProof"
            rules={[{ required: true, message: '请上传产权证明' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>上传产权证明</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="营业执照"
            name="businessLicense"
            rules={[{ required: true, message: '请上传营业执照' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>上传营业执照</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmitForReview} loading={isSubmitting}>
                提交审核
              </Button>
              <Button onClick={handleSave} loading={isSubmitting}>
                保存
              </Button>
              <Button onClick={() => navigate('/rental/property')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PropertyEdit; 