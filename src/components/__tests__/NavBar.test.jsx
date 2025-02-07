import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar';

describe('NavBar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Заказ')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const logo = screen.getByAltText('Sirkonovalov Logo');
    expect(logo).toBeInTheDocument();
  });
}); 