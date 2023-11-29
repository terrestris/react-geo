// LoadingSpinComponent.tsx
import React from 'react';
import { Spin } from 'antd';

type LoadingSpinProps = {
  loading: boolean;
};

const LoadingSpinComponent: React.FC<LoadingSpinProps> = ({ loading }) => {
  return <Spin spinning={loading} />;
};

export default LoadingSpinComponent;
