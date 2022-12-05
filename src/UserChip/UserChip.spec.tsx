import testImage from  '../../assets/user.png';

import UserChip from './UserChip';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

describe('<UserChip />', () => {

  it('is defined', () => {
    expect(UserChip).not.toBeUndefined();
  });

  it('can be rendered', () => {
    const { container } = render(<UserChip />);
    expect(container).toBeVisible();
  });

  it('determines initials from given user name', () => {
    render(<UserChip userName="Shinji Kagawa" />);
    const chip = screen.getByText('SK');
    expect(chip).toBeVisible();
  });

  it('uses imageSrc if image is given', () => {
    render(<UserChip imageSrc={testImage} />);
    const userImage = screen.getByRole('img');
    expect(userImage).toBeVisible();
    expect(userImage).toHaveAttribute('src', testImage);
  });

  it('uses initials if image is not given', () => {
    render(<UserChip userName="Shinji Kagawa" />);
    const image = screen.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('should render a dropdown', async () => {
    const exampleMenu = {
      items: [{
        label: <div role="menu">Example menu</div>,
        key: 'example'
      }]
    };
    render(<UserChip userName="Shinji Kagawa" userMenu={exampleMenu}/>);
    const chip = screen.getByText('SK').parentElement;
    await userEvent.click(chip);
    const menu = screen.getByText('Example menu');
    // `toBeVisible` does not work because antd seems to be in the way
    expect(menu).toBeInTheDocument();
  });

  it('should not render a dropdown for invalid configuration', () => {
    render(<UserChip userName="Shinji Kagawa" userMenu={undefined} />);
    const menu = screen.queryByRole('menu');
    expect(menu).not.toBeInTheDocument();
  });

  it('should pass style prop', () => {
    render(<UserChip userName="Shinji Kagawa" style={{ backgroundColor: 'yellow' }} />);
    const chip = screen.getByText('Shinji Kagawa').parentElement;
    expect(chip).toHaveStyle({
      backgroundColor: 'yellow'
    });
  });

});
