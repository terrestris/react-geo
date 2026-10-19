import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import OlMap from 'ol/Map';
import * as React from 'react';
import useCoordinateInfo from '@terrestris/react-util/dist/Hooks/useCoordinateInfo/useCoordinateInfo';

import CoordinateInfo from '../CoordinateInfo/CoordinateInfo';
import TestUtil from '../Util/TestUtil';

jest.mock('@terrestris/react-util/dist/Hooks/useCoordinateInfo/useCoordinateInfo', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('<CoordinateInfo />', () => {
  let map: OlMap;

  beforeEach(() => {
    map = TestUtil.createMap();
    (useCoordinateInfo as jest.Mock).mockReturnValue({
      loading: false,
      features: [],
      clickCoordinate: [0, 0]
    });
  });

  afterEach(() => {
    cleanup();
    TestUtil.removeMap(map);
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(CoordinateInfo).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<CoordinateInfo
      active={false}
    />);
    expect(container).toBeVisible();
  });

  it('passes query options to useCoordinateInfo', () => {
    const layerFilter = jest.fn();
    const onSuccess = jest.fn();

    render(<CoordinateInfo
      active
      drillDown
      registerOnClick={false}
      layerFilter={layerFilter}
      onSuccess={onSuccess}
    />);

    expect(useCoordinateInfo).toHaveBeenCalledWith(expect.objectContaining({
      active: true,
      drillDown: true,
      registerOnClick: false,
      layerFilter,
      onSuccess
    }));
  });

  it('renders nothing when useCoordinateInfo returns null', () => {
    (useCoordinateInfo as jest.Mock).mockReturnValue(null);

    const { container } = render(<CoordinateInfo active />);

    expect(container).toBeEmptyDOMElement();
  });

  it('passes the query result to resultRenderer', () => {
    const result = {
      loading: false,
      features: [],
      clickCoordinate: [1, 2]
    };
    (useCoordinateInfo as jest.Mock).mockReturnValue(result);
    const resultRenderer = jest.fn(() => <div>Rendered query result</div>);

    render(<CoordinateInfo active resultRenderer={resultRenderer} />);

    expect(resultRenderer).toHaveBeenCalledWith(result);
    expect(screen.getByText('Rendered query result')).toBeInTheDocument();
  });

  it('announces loading and result counts when enabled', () => {
    (useCoordinateInfo as jest.Mock).mockReturnValue({ loading: true });
    const { rerender } = render(<CoordinateInfo active announceResults />);

    expect(screen.getByRole('status')).toHaveTextContent('Querying features');

    (useCoordinateInfo as jest.Mock).mockReturnValue({
      loading: false,
      features: [{}, {}]
    });
    rerender(<CoordinateInfo active announceResults />);

    expect(screen.getByRole('status')).toHaveTextContent('2 features found');
  });

  it('uses a custom announcement formatter when provided', () => {
    const announceResults = jest.fn(() => 'Custom query status');
    (useCoordinateInfo as jest.Mock).mockReturnValue({ loading: true });

    render(<CoordinateInfo active announceResults={announceResults} />);

    expect(announceResults).toHaveBeenCalledWith({ loading: true });
    expect(screen.getByRole('status')).toHaveTextContent('Custom query status');
  });

  it('does not enable keyboard selection by default', () => {
    renderInMapContext(map, <CoordinateInfo active />);

    expect(map.getViewport().querySelector('.react-geo-keyboard-feature-selector-crosshair')).not.toBeInTheDocument();
    expect(map.getTargetElement()).not.toHaveClass('react-geo-keyboard-map');
  });

  it('enables and configures keyboard selection when requested', () => {
    const helpText = 'Use arrows to pan and Enter to query.';
    renderInMapContext(map, <CoordinateInfo
      active
      keyboardControl={{ panStep: 5, clickEventType: 'click', helpText }}
    />);

    const target = map.getTargetElement();
    const center = map.getView().getCenter()!;
    expect(map.getViewport().querySelector('.react-geo-keyboard-feature-selector-crosshair')).toBeInTheDocument();
    expect(target).toHaveClass('react-geo-keyboard-map');
    expect(target.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.body).toHaveTextContent(helpText);

    fireEvent.keyDown(target, { key: 'ArrowRight' });

    expect(map.getView().getCenter()).toEqual([center[0] + 5, center[1]]);
  });

  it('does not enable keyboard selection when inactive', () => {
    renderInMapContext(map, <CoordinateInfo active={false} keyboardControl />);

    expect(map.getViewport().querySelector('.react-geo-keyboard-feature-selector-crosshair')).not.toBeInTheDocument();
    expect(map.getTargetElement()).not.toHaveClass('react-geo-keyboard-map');
  });
});
