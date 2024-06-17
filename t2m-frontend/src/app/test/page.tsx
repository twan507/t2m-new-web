import React from 'react';
import { Button } from 'antd';
import './test.css';

const YourComponent = () => {
  return (
    <div className="container">
      <div className="image-container">
        <img 
          src="https://i.imgur.com/Yl1TO9x.png" 
          alt="background" 
          className="background-image"
        />
        <div className="overlay">
          <img 
            src="https://i.imgur.com/Yl1TO9x.png" 
            alt="hand holding phone" 
            className="phone-image"
          />
        </div>
      </div>
      <div className="content">
        <div className="logo">Logo</div>
        <p className="subtitle">Lorem ipsum dolor sit amet</p>
        <h1>Choose <span className="highlight">one</span> great offer for your customers</h1>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam leo leo, tincidunt ac lectus vel, tincidunt scelerisque sapien. 
          Quisque commodo orci at odio aliquet pretium. Sed faucibus eget turpis tincidunt tincidunt. Maecenas vel lorem finibus, iaculis diam id, 
          venenatis odio. Curabitur ante metus.
        </p>
        <Button type="primary" className="cta-button">Call to Action</Button>
      </div>
    </div>
  );
}

export default YourComponent;
