import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'whatwg-fetch';

Enzyme.configure({ adapter: new Adapter() });
