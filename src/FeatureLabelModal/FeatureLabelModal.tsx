import React, { FC , useEffect, useState } from 'react';


import { Modal, ModalProps } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

import StringUtil from '@terrestris/base-util/dist/StringUtil/StringUtil';

interface OwnProps {
  feature: Feature<Geometry>;
  onOk: () => void;
  onCancel: () => void;
  /**
   * Maximal length of feature label.
   * If exceeded label will be divided into multiple lines. Optional.
   */
  maxLabelLineLength?: number;
}

export type FeatureLabelModalProps = OwnProps & Omit<ModalProps, 'closable'|'visible'|'onOk'|'onCancel'>;

export const FeatureLabelModal: FC<FeatureLabelModalProps> = ({
  feature,
  onOk,
  onCancel,
  maxLabelLineLength,
  ...passThroughProps
}) => {
  const [label, setLabel] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (feature) {
      setLabel(feature.get('label') ?? '');
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [feature]);

  const onOkInternal = () => {
    feature.set('label', maxLabelLineLength !== undefined ?
      StringUtil.stringDivider(label, maxLabelLineLength, '\n') :
      label
    );
    onOk();
  };

  const onLabelChange = (e: any) => setLabel(e.target.value);

  if (!showPrompt) {
    return null;
  }

  return (
    <Modal
      open={showPrompt}
      closable={false}
      onOk={onOkInternal}
      onCancel={onCancel}
      {...passThroughProps}
    >
      <TextArea
        value={label}
        onChange={onLabelChange}
        autoSize
      />
    </Modal>
  );
};

export default FeatureLabelModal;
