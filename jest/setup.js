import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'whatwg-fetch';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

Enzyme.configure({ adapter: new Adapter() });
