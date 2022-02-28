import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'whatwg-fetch';
import 'jest-canvas-mock';
import '@testing-library/jest-dom';

Enzyme.configure({ adapter: new Adapter() });
