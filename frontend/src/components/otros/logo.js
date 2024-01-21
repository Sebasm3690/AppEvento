// Logo.js

import React from 'react';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="logo-link">
      PartyConnect
    </Link>
  );
}

export default Logo;
