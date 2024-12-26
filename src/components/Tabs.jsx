import React, { useState } from 'react';

    const Tabs = ({ children }) => {
      const [activeTab, setActiveTab] = useState(0);

      const handleTabClick = (index) => {
        setActiveTab(index);
      };

      return (
        <div className="tabs">
          <div className="tab-buttons">
            {children.map((child, index) => (
              <button
                key={index}
                className={index === activeTab ? 'active' : ''}
                onClick={() => handleTabClick(index)}
              >
                {child.props.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {children[activeTab]}
          </div>
        </div>
      );
    };

    export default Tabs;
