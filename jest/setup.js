import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import 'whatwg-fetch';
import 'jest-canvas-mock';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';
import {
  TextEncoder,
  TextDecoder
} from 'util';

Object.assign(global, {
  TextDecoder,
  TextEncoder
});

Enzyme.configure({ adapter: new Adapter() });
