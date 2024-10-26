import React from 'react';

const HeaderLeft = ({toggle, setToggle}) => {
  return (
    <div className="header-left">
        <div className="header-logo">
          <i className="bi bi-search"></i>
          <strong>WhereMe</strong>
        </div>
        <div className="header-menu" onClick={()=>{setToggle(prev => !prev)}}>
          {toggle ? <i  className="bi bi-x-lg"></i> :<i  className="bi bi-list"></i>}
        </div>
      </div>
  );
}

export default HeaderLeft;
