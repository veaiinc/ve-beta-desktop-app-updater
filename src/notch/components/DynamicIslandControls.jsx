import React, { useState, useEffect } from 'react';
import { Button, Switch, Space, Card, Typography, Row, Col } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  ExpandOutlined, 
  CompressOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DynamicIslandControls = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if we're in Electron environment
    if (window.electronAPI && window.electronAPI.dynamicIsland) {
      setIsConnected(true);
      // Listen for dynamic island state changes
      window.electronAPI.dynamicIsland.onStateChange((data) => {
        setIsExpanded(data.expanded);
      });
    }
  }, []);

  const toggleVisibility = async () => {
    if (!window.electronAPI || !window.electronAPI.dynamicIsland) return;
    
    try {
      const result = await window.electronAPI.dynamicIsland.toggle();
      if (result.success) {
        setIsVisible(!isVisible);
      }
    } catch (error) {
      console.error('Failed to toggle dynamic island visibility:', error);
    }
  };

  const expand = async () => {
    if (!window.electronAPI || !window.electronAPI.dynamicIsland) return;
    
    try {
      const result = await window.electronAPI.dynamicIsland.expand();
      if (result.success) {
        setIsExpanded(true);
      }
    } catch (error) {
      console.error('Failed to expand dynamic island:', error);
    }
  };

  const collapse = async () => {
    if (!window.electronAPI || !window.electronAPI.dynamicIsland) return;
    
    try {
      const result = await window.electronAPI.dynamicIsland.collapse();
      if (result.success) {
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Failed to collapse dynamic island:', error);
    }
  };

  const show = async () => {
    if (!window.electronAPI || !window.electronAPI.dynamicIsland) return;
    
    try {
      const result = await window.electronAPI.dynamicIsland.show();
      if (result.success) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to show dynamic island:', error);
    }
  };

  const hide = async () => {
    if (!window.electronAPI || !window.electronAPI.dynamicIsland) return;
    
    try {
      const result = await window.electronAPI.dynamicIsland.hide();
      if (result.success) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Failed to hide dynamic island:', error);
    }
  };

  if (!isConnected) {
    return (
      <Card title="Dynamic Island Controls" style={{ margin: 16 }}>
        <Text type="secondary">
          Dynamic Island controls are only available in the desktop app.
        </Text>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <Space>
          <SettingOutlined />
          Dynamic Island Controls
        </Space>
      } 
      style={{ margin: 16 }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Visibility:</Text>
              <Switch
                checked={isVisible}
                onChange={toggleVisibility}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
                style={{ marginLeft: 8 }}
              />
            </div>
            
            <div>
              <Text strong>State:</Text>
              <Text code style={{ marginLeft: 8 }}>
                {isExpanded ? 'Expanded' : 'Collapsed'}
              </Text>
            </div>
          </Space>
        </Col>
        
        <Col span={24}>
          <Space wrap>
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              onClick={show}
              disabled={isVisible}
            >
              Show
            </Button>
            
            <Button 
              icon={<EyeInvisibleOutlined />}
              onClick={hide}
              disabled={!isVisible}
            >
              Hide
            </Button>
            
            <Button 
              type="default" 
              icon={<ExpandOutlined />}
              onClick={expand}
              disabled={!isVisible || isExpanded}
            >
              Expand
            </Button>
            
            <Button 
              type="default" 
              icon={<CompressOutlined />}
              onClick={collapse}
              disabled={!isVisible || !isExpanded}
            >
              Collapse
            </Button>
          </Space>
        </Col>
        
        <Col span={24}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Use <Text code>Cmd+I</Text> to toggle the dynamic island visibility globally.
            <br />
            💡 Hover over the dynamic island to expand it automatically.
            <br />
            💡 The dynamic island is now built with React components for better maintainability.
          </Text>
        </Col>
      </Row>
    </Card>
  );
};

export default DynamicIslandControls;
