import React from "react";

// type Props = {
//   activeKey: any;
//   onKeyChange: any;
// };
const TabHeader = ({ activeKey, onKeyChange }) => {
  return (
    <div className="mobile-tab-new-header">
    <div
      style={{width: '126px', color: activeKey === 1 ? '#f26a5a' : 'black'}}
      className='custom-tab-order-header'
      onClick={() => onKeyChange(1)}
    >
      <center>
      <span className="d-flex gap-1 align-items-center" style={{width: '126px',borderBottom: activeKey === 1 ? '2px solid #f26a5a' :'', fontSize: "18px"}}>
        Services
    </span>
      </center>
    </div>
    <div
      style={{color: activeKey === 2 ? '#f26a5a' : 'black'}}
      className='custom-tab-order-header'
      onClick={() => onKeyChange(2)}
    >
      <center>
      <span className="d-flex gap-1 align-items-center"  style={{ borderBottom: activeKey === 2 ? '2px solid #f26a5a' :'', fontSize: "18px"}}>
        Service Categories
    </span>
      </center>
    </div>
    <div
      style={{color: activeKey === 3 ? '#f26a5a' : 'black', marginLeft: "30px"}}
      className='custom-tab-order-header'
      onClick={() => onKeyChange(3)}
    >
      <center>
      <span className="d-flex gap-1 align-items-center"  style={{ borderBottom: activeKey === 3 ? '2px solid #fe741f' :'', fontSize: "18px"}}>
        Specialists
    </span>
      </center>
    </div>
  </div>
  );
};

export default TabHeader;
