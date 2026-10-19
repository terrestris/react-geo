import React, {
  CSSProperties,
  FC,
  useEffect,
  useRef,
  useState
} from 'react';

import _isNil from 'lodash/isNil';

import useCoordinateInfo, {
  CoordinateInfoResult,
  UseCoordinateInfoArgs
} from '@terrestris/react-util/dist/Hooks/useCoordinateInfo/useCoordinateInfo';

import KeyboardFeatureSelector, { KeyboardFeatureSelectorProps } from '../KeyboardFeatureSelector/KeyboardFeatureSelector';

export type CoordinateInfoProps = {
  /**
   * The children component that should be rendered. The render prop function
   * receives the state of the component (this is the clicked coordinate, the
   * list of GFI features if any and the loading state).
   */
  resultRenderer?: (childrenProps: CoordinateInfoResult) => React.ReactNode;
  /**
   * Enables keyboard operation of the map (fine arrow-key panning, Enter queries
   * the map center). Pass an object to configure it. Default: off.
   */
  keyboardControl?: boolean | KeyboardFeatureSelectorProps;
  /**
   * Announces query progress and results to screen readers via a live region.
   * Pass a function to provide your own (translated) text. Default: off.
   */
  announceResults?: boolean | ((result: CoordinateInfoResult) => string);
} & UseCoordinateInfoArgs;

const defaultAnnouncement = (result: CoordinateInfoResult): string => {
  if (result.loading) {
    return 'Querying features…';
  }
  const n = result.features?.length ?? 0;
  return n ? `${n} features found` : 'No features at this position';
};

/**
 * Constructs a wrapper component for querying features from the clicked
 * coordinate. The returned features can be passed to a child component
 * to be visualized.
 *
 */
export const CoordinateInfo: FC<CoordinateInfoProps> = ({
  resultRenderer = () => <></>,
  keyboardControl = false,
  announceResults = false,
  ...passThroughProps
}) => {

  const result = useCoordinateInfo(passThroughProps);

  const [message, setMessage] = useState('');
  const wasLoading = useRef(false);
  const visuallyHidden: CSSProperties = {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0,
    overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0
  };

  useEffect(() => {
    if (!announceResults || _isNil(result)) {
      return;
    }
    const getText = typeof announceResults === 'function' ? announceResults : defaultAnnouncement;
    if (result.loading) {
      wasLoading.current = true;
      setMessage(getText(result));
    } else if (wasLoading.current) {
      wasLoading.current = false;
      setMessage(getText(result));
    }
  }, [announceResults, result?.loading, result?.features]);

  if (_isNil(result)) {
    return null;
  }

  const keyboardProps = keyboardControl === true ? {} : keyboardControl || null;

  return (
    <>
      {keyboardProps && passThroughProps.active !== false && (
        <KeyboardFeatureSelector {...keyboardProps} />
      )}
      {announceResults && (
        <div role="status" aria-live="polite" style={visuallyHidden}>{message}</div>
      )}
      {resultRenderer(result)}
    </>
  );
};
export default CoordinateInfo;
