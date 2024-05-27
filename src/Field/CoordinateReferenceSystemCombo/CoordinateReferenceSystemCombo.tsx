import './CoordinateReferenceSystemCombo.less';

import Logger from '@terrestris/base-util/dist/Logger';
import {
  ProjectionDefinition,
  useProjFromEpsgIO
} from '@terrestris/react-util/dist/Hooks/useProjFromEpsgIO/useProjFromEpsgIO';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib/auto-complete';
import { DefaultOptionType } from 'antd/lib/select';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _isNil from 'lodash/isNil';
import React, { FC, useEffect, useMemo, useState } from 'react';

import { CSS_PREFIX } from '../../constants';

const { Option } = AutoComplete;

interface OwnProps {
  /**
   * The API to query for CRS definitions
   * default: https://epsg.io
   */
  crsApiUrl?: string;
  /**
   * The empty text set if no value is given / provided
   */
  emptyTextPlaceholderText?: string;
  /**
   * A function
   */
  onSelect?: (projectionDefinition: ProjectionDefinition | undefined) => void;
  /**
   * An optional CSS class which should be added.
   */
  className?: string;
  /**
   * An array of predefined crs definitions having at least value (name of
   * CRS) and code (e.g. EPSG-code of CRS) property
   */
  predefinedCrsDefinitions?: Record<string, ProjectionDefinition>;
}

export type CRSComboProps = OwnProps & AutoCompleteProps;
const defaultClassName = `${CSS_PREFIX}coordinatereferencesystemcombo`;

/**
 * Class representing a combo to choose coordinate projection system via a
 * dropdown menu and / or autocompletion
 *
 * @class The CoordinateReferenceSystemCombo
 * @extends React.Component
 */
const CoordinateReferenceSystemCombo: FC<CRSComboProps> = ({
  crsApiUrl,
  className,
  emptyTextPlaceholderText = 'Please select a CRS',
  onSelect = () => undefined,
  predefinedCrsDefinitions,
  ...passThroughOpts
}) => {

  const [projectionDefinitions, setProjectionDefinitions] = useState<Record<string,
    ProjectionDefinition | undefined>>({});
  const [searchValue, setSearchValue] = useState<string>();
  const [selected, setSelected] = useState<ProjectionDefinition>();

  /**
   * This function gets called when the EPSG.io fetch returns an error.
   * It logs the error to the console.
   *
   */
  const onFetchError = (error: any) => {
    Logger.error(`Error while requesting in CoordinateReferenceSystemCombo: ${error}`);
  };

  const crsObjects = useMemo(
    () => predefinedCrsDefinitions || projectionDefinitions,
    [projectionDefinitions, predefinedCrsDefinitions]
  );

  const epsgIoResults = useProjFromEpsgIO({
    crsApiUrl,
    onFetchError,
    searchValue
  });

  const getEpsgDescription = (projDefinition: ProjectionDefinition) =>
    `${projDefinition.name} (EPSG:${projDefinition.code})`;

  /**
   * Handles selection of a CRS item in Autocomplete
   *
   * @param _
   * @param option The selected OptionData
   */
  const onCrsItemSelect = (_: string, option: DefaultOptionType) => {
    const selectedProjection = _find(crsObjects, (p?: ProjectionDefinition) => p?.code === option.code);
    setSelected(selectedProjection);
    if (!_isNil(selectedProjection)) {
      setSearchValue(undefined);
    }
  };

  /**
   * Transform CRS object returned by EPSG.io to antd Option component
   *
   * @param code The EPSG code of the ProjectionDefinition
   * @param projDefinition Single plain CRS object returned by EPSG.io
   *
   * @return Option component to render
   */
  const transformCrsObjectsToOptions = ([, projDefinition]: [string, ProjectionDefinition | undefined]) => {
    if (!projDefinition) {
      return;
    }

    const epsgDescription = getEpsgDescription(projDefinition);
    return (
      <Option
        key={projDefinition.code}
        code={projDefinition.code}
        value={epsgDescription}
      >
        {epsgDescription}
      </Option>
    );
  };

  const onClear = () => {
    setSelected(undefined);
    setSearchValue(undefined);
    setProjectionDefinitions({});
  };

  useEffect(() => {
    if (!_isNil(epsgIoResults) && !_isEqual(epsgIoResults, projectionDefinitions) && _isNil(selected)) {
      setProjectionDefinitions(epsgIoResults);
    }
  }, [epsgIoResults, projectionDefinitions, selected]);

  useEffect(() => {
    if (!_isNil(selected)) {
      onSelect(selected);
    }
  }, [onSelect, selected]);

  const finalClassName = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <AutoComplete
      allowClear={true}
      className={finalClassName}
      onChange={setSearchValue}
      onClear={onClear}
      onSelect={onCrsItemSelect}
      placeholder={emptyTextPlaceholderText}
      {...passThroughOpts}
    >
      {
        Object.entries(crsObjects).map(transformCrsObjectsToOptions)
      }
    </AutoComplete>
  );
};

export default CoordinateReferenceSystemCombo;
