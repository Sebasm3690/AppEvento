import React, { useRef, useEffect } from "react";
import NavBarAsis from "./components/Asistente/navbaras";
import Footer from './components/footer';

function Payjs() {
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
    <div className="App">
      <NavBarAsis />
      <div style={{padding: '50px 0px 20px 0px'}}>
        <h1 className="display-4 text-center mb-4">METÓDOS DE PAGO</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#3498db', fontSize: '34px', marginBottom: '20px' }}>PayPal</h2>
        <div ref={paypal}></div>
      </div>
      <Footer/>  
    </div>
  );
}

export default Payjs;
