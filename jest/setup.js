import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { XMLSerializer } from 'xmldom';
import 'whatwg-fetch';
import 'jest-canvas-mock';

global.XMLSerializer = XMLSerializer;

Enzyme.configure({ adapter: new Adapter() });
