import React from 'react';
import { Row, Col, Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 筛选项配置
export interface FilterItem {
  key: string;
  type: 'input' | 'select' | 'dateRange' | 'date';
  label?: string;
  placeholder: string;
  options?: { label: string; value: any }[];
  value?: any;
  onChange: (value: any) => void;
  allowClear?: boolean;
  span?: number; // 列宽度，默认为4
}

// 操作按钮配置
export interface ActionButton {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

// 搜索筛选组件属性
export interface SearchFilterProps {
  // 筛选项配置
  filters: FilterItem[];
  
  // 操作按钮配置
  actions?: ActionButton[];
  
  // 搜索按钮点击事件
  onSearch?: () => void;
  
  // 重置按钮点击事件
  onReset?: () => void;
  
  // 是否显示搜索按钮
  showSearchButton?: boolean;
  
  // 是否显示重置按钮
  showResetButton?: boolean;
  
  // 自定义样式
  style?: React.CSSProperties;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  actions = [],
  onSearch,
  onReset,
  showSearchButton = true,
  showResetButton = true,
  style = {},
}) => {
  // 渲染筛选控件
  const renderFilterItem = (filter: FilterItem) => {
    const commonProps = {
      placeholder: filter.placeholder,
      allowClear: filter.allowClear !== false,
      style: { width: '100%' },
      value: filter.value,
      onChange: filter.onChange,
    };

    switch (filter.type) {
      case 'input':
        return (
          <Input
            {...commonProps}
            prefix={<SearchOutlined />}
          />
        );
      
      case 'select':
        return (
          <Select {...commonProps}>
            {filter.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'dateRange':
        return (
          <RangePicker
            placeholder={[filter.placeholder, filter.placeholder]}
            allowClear={filter.allowClear !== false}
            style={{ width: '100%' }}
            value={filter.value}
            onChange={filter.onChange}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            {...commonProps}
            style={{ width: '100%' }}
          />
        );
      
      default:
        return null;
    }
  };

  // 计算列的总宽度
  const totalFilterSpan = filters.reduce((sum, filter) => sum + (filter.span || 4), 0);
  const actionSpan = Math.max(24 - totalFilterSpan, 4);

  return (
    <div style={style}>
      <Row gutter={16} align="middle">
        {/* 渲染筛选项 */}
        {filters.map(filter => (
          <Col span={filter.span || 4} key={filter.key}>
            {filter.label && (
              <div style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>
                {filter.label}
              </div>
            )}
            {renderFilterItem(filter)}
          </Col>
        ))}
        
        {/* 操作按钮区域 */}
        <Col span={actionSpan} style={{ textAlign: 'right' }}>
          <Space>
            {/* 默认搜索和重置按钮 */}
            {showSearchButton && (
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={onSearch}
              >
                搜索
              </Button>
            )}
            {showResetButton && (
              <Button 
                icon={<ReloadOutlined />} 
                onClick={onReset}
              >
                重置
              </Button>
            )}
            
            {/* 自定义操作按钮 */}
            {actions.map(action => (
              <Button
                key={action.key}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
                danger={action.danger}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter; 