import { renderInMapContext } from '@terrestris/react-util/dist/Util/rtlTestUtils';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TestUtil from '../../Util/TestUtil';
import ScaleCombo from './ScaleCombo';

describe('<ScaleCombo />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is defined', () => {
    expect(ScaleCombo).toBeDefined();
  });

  it('can be rendered', () => {
    const { container } = render(<ScaleCombo />);
    expect(container).toBeVisible();
  });

  it('calls onZoomLevelSelect when a scale is selected', async () => {
    const onZoomLevelSelect = jest.fn();
    const map = TestUtil.createMap();
    renderInMapContext(map,
      <ScaleCombo
        onZoomLevelSelect={onZoomLevelSelect}
        scales={[100, 200]}
        open
      />
    );

    const entry = screen.getByText('1:100');

    await userEvent.click(entry);

    expect(onZoomLevelSelect).toHaveBeenCalledWith('100');
    TestUtil.removeMap(map);
  });

  it('creates options array from given map with resolutions', () => {
    const testResolutions = [560, 280, 140, 70, 28];
    const map = TestUtil.createMap({
      resolutions: testResolutions
    });

    renderInMapContext(map, (
      <ScaleCombo
        open
      />
    ));

    const options = screen.getAllByText((text, element) => element?.tagName === 'DIV' && /1:/.test(text));

    expect(options).toHaveLength(testResolutions.length);
    TestUtil.removeMap(map);
  });

  it('creates options array from given map with filtered resolutions', () => {
    const testResolutions = [560, 280, 140, 70, 28, 19, 15, 14, 13, 9];
    const map = TestUtil.createMap({
      resolutions: testResolutions
    });

    const resolutionsFilter = (res: number) => {
      return res >= 19 || res <= 13;
    };

    const expectedLength = testResolutions.filter(resolutionsFilter).length;

    renderInMapContext(map, (
      <ScaleCombo
        open
        resolutionsFilter={resolutionsFilter}
      />
    ));

    const options = screen.getAllByText((text, element) => element?.tagName === 'DIV' && /1:/.test(text));

    expect(options).toHaveLength(expectedLength);
    TestUtil.removeMap(map);
  });

  it('zooms the map to the clicked scale', async () => {
    const map = TestUtil.createMap();

    renderInMapContext(map,
      <ScaleCombo
        scales={[100, 200, 300, 400, 500]}
        open
      />
    );

    expect(map.getView().getResolution()).toBeCloseTo(1);

    const entry = screen.getByText('1:300');

    await userEvent.click(entry);

    expect(map.getView().getResolution()).toBeCloseTo(0.08);
    TestUtil.removeMap(map);
  });

  it('sets the correct scale on map zoom', () => {
    const map = TestUtil.createMap();

    renderInMapContext(map,
      <ScaleCombo
        scales={[100, 200, 300, 400, 500]}
      />
    );

    expect(map.getView().getResolution()).toBeCloseTo(1);

    act(() => {
      map.getView().setZoom(4);
    });

    const entry = screen.getByText('1:100');

    expect(entry).toBeVisible();
  });
});
