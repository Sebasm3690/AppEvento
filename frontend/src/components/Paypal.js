// src/components/Paypal.js
import React, { useRef, useEffect } from "react";

export default function Paypal() {
  const paypal = useRef();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const total = urlParams.get('total');
    const totalboletos = urlParams.get('totalBoletosSeleccionados');
    const idBoletoEncoded = urlParams.get('idboleto');

    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `${totalboletos}`,
                amount: {
                  currency_code: "USD",
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          const description = order.purchase_units[0].description;
          const value = order.purchase_units[0].amount.value;
          window.location.href = `/comprarEv?description=${description}&id=${idBoletoEncoded}&value=${value}/`;
          console.log(description, value);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);
  return (
    <div>
      <h2>Paypal Checkout</h2>
      <div ref={paypal}></div>
    </div>
  );
}
