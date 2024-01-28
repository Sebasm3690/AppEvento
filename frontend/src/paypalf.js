import React, { useState } from "react";

import Paypal from "./components/Paypal";

function Payjs() {
  const [checkout, setCheckOut] = useState(false);

  return (
    <div className="App">
      {checkout ? (
        <Paypal />
      ) : (
        <button
          onClick={() => {
            setCheckOut(true);
          }}
        >
          Ver metodos de pago
        </button>
      )}
    </div>
  );
}

export default Payjs;