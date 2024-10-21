// @ts-nocheck
import {buildQueries, queryAllByTitle} from '@testing-library/react';

const allAntdDropdownOptionQuery = (container) => {
  // eslint-disable-next-line testing-library/no-node-access
  return container.querySelectorAll('.ant-select-dropdown-option');
};

const allAntdDropdownOptionByTextQuery = (container, text: string) => {
  // eslint-disable-next-line testing-library/no-node-access
  const dropdowns = Array.from(container.querySelectorAll('.ant-select-dropdown'));
  // eslint-disable-next-line testing-library/prefer-screen-queries
  return dropdowns.map(dropdown => queryAllByTitle((dropdown as HTMLElement), text))
    .reduce((acc, val) => val !== null ? acc.concat(val) : acc, []);
};

const multipleError = () => 'Found multiple antd dropdown options.';

const missingError = () => 'Unable to find antd dropdown option.';

const buildDocumentQueries = (queryAll, getMultipleError, getMissingError) => {
  const [
    query,
    getAll,
    get,
    findAll,
    find
  ] = buildQueries(queryAll, getMultipleError, getMissingError);
  return [
    () => queryAll(document),
    () => query(document),
    () => getAll(document),
    () => get(document),
    () => findAll(document, null),
    () => find(document, null)
  ];
};

const buildDocumentByTextQueries = (queryAll, getMultipleError, getMissingError) => {
  const [
    query,
    getAll,
    get,
    findAll,
    find
  ] = buildQueries(queryAll, getMultipleError, getMissingError);
  return [
    (text: string) => queryAll(document, text),
    (text: string) => query(document, text),
    (text: string) => getAll(document, text),
    (text: string) => get(document, text),
    (text: string) => findAll(document, text),
    (text: string) => find(document, text)
  ];
};

const [
  queryAllAntdDropdownOption,
  queryAntdDropdownOption,
  getAllAntdDropdownOption,
  getAntdDropdownOption,
  findAllAntdDropdownOption,
  findAntdDropdownOption
] = buildDocumentQueries(allAntdDropdownOptionQuery, multipleError, missingError);

const [
  queryAllAntdDropdownOptionByText,
  queryAntdDropdownOptionByText,
  getAllAntdDropdownOptionByText,
  getAntdDropdownOptionByText,
  findAllAntdDropdownOptionByText,
  findAntdDropdownOptionByText
] = buildDocumentByTextQueries(allAntdDropdownOptionByTextQuery, multipleError, missingError);

export {
  findAllAntdDropdownOption,
  findAllAntdDropdownOptionByText,
  findAntdDropdownOption,
  findAntdDropdownOptionByText,
  getAllAntdDropdownOption,
  getAllAntdDropdownOptionByText,
  getAntdDropdownOption,
  getAntdDropdownOptionByText,
  queryAllAntdDropdownOption,
  queryAllAntdDropdownOptionByText,
  queryAntdDropdownOption,
  queryAntdDropdownOptionByText};
