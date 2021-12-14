import '@babel/polyfill';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { XMLSerializer } from 'xmldom';
import 'whatwg-fetch';
import 'jest-canvas-mock';
import '@testing-library/jest-dom';

global.XMLSerializer = XMLSerializer;

Enzyme.configure({ adapter: new Adapter() });
