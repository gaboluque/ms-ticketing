import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: '/auth/sign-up' },
    !currentUser && { label: "Sign In", href: '/auth/sign-in' },
    currentUser && { label: "Sign Out", href: '/auth/sign-out' },
  ].filter(Boolean).map(({ label, href }) => (
    <li key={label} className="nav-item">
      <Link href={href}>
        <a className="nav-link">
          {label}
        </a>
      </Link>
    </li>
  ));

  return (
    <nav className="navbar navbar-light bg-light p-2">
      <Link href="/">
        <a href="#" className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items center">
          {links}
        </ul>
      </div>
    </nav>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object
};

Header.defaultProps = {
  currentUser: undefined
};


export default Header;