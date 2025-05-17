import { useEffect, useRef,useContext } from "react";
import AnxiosInstance from "./GetToken";
import { MusicContext } from "./Home";
function PayPal() {
    const paypalRef = useRef();
    const {setUser} = useContext(MusicContext);
    useEffect(() => {
        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            description: 'Cool',
                            amount: {
                                currency_code: 'USD',
                                value: 5.0,
                            }
                        }
                    ]
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                AnxiosInstance.post('profile/').then(()=>setUser(u=>({...u,is_premium:true})))
            },
            onError: (err) => {
                console.log(err);
            }
        }).render(paypalRef.current);
    }, []);

    return (
        <div ref={paypalRef}></div>
    );
}

export default PayPal;
