import testImage from  '../../assets/user.png';

import UserChip from './UserChip';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import '@testing-library/jest-dom';
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
    const chip = screen.getByText('SK').parentElement;
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
    const items = screen.queryAllByRole('img');
    expect(items).toHaveLength(0);
  });

  it('should render a dropdown', async () => {
    render(<UserChip userName="Shinji Kagawa" userMenu={<div role="menu">Example menu</div>} />);
    const chip = screen.getByText('SK').parentElement;
    userEvent.click(chip);
    const menu = screen.getByText('Example menu');
    // `toBeVisible` does not work because antd seems to be in the way
    expect(menu).toBeInTheDocument();
  });

  it('should not render a dropdown for invalid configuration', () => {
    render(<UserChip userName="Shinji Kagawa" userMenu={null} />);
    const menus = screen.queryAllByRole('menu');
    expect(menus).toHaveLength(0);
  });

  it('should pass style prop', () => {
    render(<UserChip userName="Shinji Kagawa" style={{ backgroundColor: 'yellow' }} />);
    const chip = screen.getByText('Shinji Kagawa').parentElement;
    expect(chip).toHaveStyle({
      backgroundColor: 'yellow'
    });
  });

});
