import React, { FC } from 'react';

import _isNil from 'lodash/isNil';

import useCoordinateInfo, {
  CoordinateInfoResult,
  UseCoordinateInfoArgs
} from '@terrestris/react-util/dist/Hooks/useCoordinateInfo/useCoordinateInfo';

export type CoordinateInfoProps = {
  /**
   * The children component that should be rendered. The render prop function
   * receives the state of the component (this is the clicked coordinate, the
   * list of GFI features if any and the loading state).
   */
  resultRenderer?: (childrenProps: CoordinateInfoResult) => React.ReactNode;
} & UseCoordinateInfoArgs;

/**
 * Constructs a wrapper component for querying features from the clicked
 * coordinate. The returned features can be passed to a child component
 * to be visualized.
 *
 */
export const CoordinateInfo: FC<CoordinateInfoProps> = ({
  resultRenderer = () => <></>,
  ...passThroughProps
}) => {

  const result = useCoordinateInfo(passThroughProps);

  if (_isNil(result)) {
    return null;
  }

  return (
    <>
      {resultRenderer(result)}
    </>
  );
};

export default CoordinateInfo;
