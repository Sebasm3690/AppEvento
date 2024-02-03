// src/components/Card.js
import React from 'react';

function Card({ title, value }) {
    return (
      <div className="col-md-3 mb-4 d-flex">
        <div className="card flex-fill p-3">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-uppercase text-muted mb-2">{title}</h5>
            <div className="h3 mb-0 mt-auto">{value}</div>
          </div>
        </div>
      </div>
    );
  }

export default Card;
