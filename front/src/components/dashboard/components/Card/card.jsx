import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, span, description, link }) => {
  return (
    <Link to={link} className="card">
      <div className="card-content">
        <div className="card-title">
          <h3>
             {title}<span>{span}</span>
          </h3>
          <div className="arrow">
            <svg stroke="currentColor" fill="none" strokeidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>
        <p className="card-description">{description}</p>
      </div>
    </Link>
  );
};

export default Card;
