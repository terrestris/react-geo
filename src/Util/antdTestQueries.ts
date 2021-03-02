import { buildQueries, queryAllByTitle } from '@testing-library/react';

function _queryAllAntdDropdownOption(container) {
  return container.querySelectorAll('.ant-select-dropdown-option');
}

function _queryAllAntdDropdownOptionByText(container, text: string) {
  const dropdowns = Array.from(container.querySelectorAll('.ant-select-dropdown'));
  const options = dropdowns.map(dropdown => queryAllByTitle(dropdown, text))
    .reduce((acc, val) => val !== null ? acc.concat(val) : acc, []);
  return options;
}

const _multipleError = () => 'Found multiple antd dropdown options.';

const _getMissingError = () => 'Unable to find antd dropdown option.';

function buildDocumentQueries(queryAll, multipleError, getMissingError) {
  const [
    query,
    getAll,
    get,
    findAll,
    find
  ] = buildQueries(queryAll, multipleError, getMissingError);
  return [
    () => queryAll(document),
    () => query(document),
    () => getAll(document),
    () => get(document),
    () => findAll(document, null),
    () => find(document, null)
  ];
}

function buildDocumentByTextQueries(queryAll, multipleError, getMissingError) {
  const [
    query,
    getAll,
    get,
    findAll,
    find
  ] = buildQueries(queryAll, multipleError, getMissingError);
  return [
    (text: string) => queryAll(document, text),
    (text: string) => query(document, text),
    (text: string) => getAll(document, text),
    (text: string) => get(document, text),
    (text: string) => findAll(document, text),
    (text: string) => find(document, text)
  ];
}

const [
  queryAllAntdDropdownOption,
  queryAntdDropdownOption,
  getAllAntdDropdownOption,
  getAntdDropdownOption,
  findAllAntdDropdownOption,
  findAntdDropdownOption
] = buildDocumentQueries(_queryAllAntdDropdownOption, _multipleError, _getMissingError);

const [
  queryAllAntdDropdownOptionByText,
  queryAntdDropdownOptionByText,
  getAllAntdDropdownOptionByText,
  getAntdDropdownOptionByText,
  findAllAntdDropdownOptionByText,
  findAntdDropdownOptionByText
] = buildDocumentByTextQueries(_queryAllAntdDropdownOptionByText, _multipleError, _getMissingError);

export {
  queryAllAntdDropdownOption,
  queryAntdDropdownOption,
  getAllAntdDropdownOption,
  getAntdDropdownOption,
  findAllAntdDropdownOption,
  findAntdDropdownOption,
  queryAllAntdDropdownOptionByText,
  queryAntdDropdownOptionByText,
  getAllAntdDropdownOptionByText,
  getAntdDropdownOptionByText,
  findAllAntdDropdownOptionByText,
  findAntdDropdownOptionByText
};
