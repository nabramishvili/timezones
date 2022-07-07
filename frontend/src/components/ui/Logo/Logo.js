import React from 'react';
import styles from './Logo.module.css';
import logo from '../../../img/logo.png';
import PropTypes from 'prop-types';

const Logo = ({ width, align }) => {
  return (
    <div
      className={`${styles.container} margin-align-${align}`}
      style={{ width: `${width}px` }}
    >
      <img className={styles.logo} src={logo} alt={'logo'} data-test={'logo'} />
    </div>
  );
};

Logo.propTypes = {
  width: PropTypes.number.isRequired,
  align: PropTypes.string.isRequired
};

export default Logo;
