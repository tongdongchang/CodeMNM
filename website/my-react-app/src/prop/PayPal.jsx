import { useEffect, useRef, useContext } from "react";
import AnxiosInstance from "./GetToken";
import { MusicContext } from "./Home";
import Footer from "./Footer";

function PayPal() {
    const paypalRef = useRef();
    const {setUser} = useContext(MusicContext);

    useEffect(() => {
        // Đảm bảo chỉ render một lần
        if (paypalRef.current && paypalRef.current.children.length === 0) {
            window.paypal.Buttons({
                // Tùy chỉnh style để phù hợp với theme tối
                style: {
                    color: 'gold',  // 'gold' là màu chuẩn của PayPal
                    shape: 'rect',
                    layout: 'vertical',
                    label: 'paypal',
                    height: 55
                },
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                description: 'Tài khoản Spotify Premium',
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
                    // Gọi API để cập nhật trạng thái premium
                    AnxiosInstance.post('profile/')
                        .then(() => {
                            setUser(prevUser => ({...prevUser, is_premium: true}));
                            alert("Chúc mừng! Bạn đã nâng cấp lên tài khoản Premium thành công!");
                        })
                        .catch(err => {
                            console.error("Lỗi khi cập nhật trạng thái premium:", err);
                        });
                },
                onError: (err) => {
                    console.error("Lỗi thanh toán:", err);
                }
            }).render(paypalRef.current);
        }
        
        // Cleanup function
        return () => {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="main">
            <div className="premium-container">
                <h1 className="premium-title">Nâng cấp tài khoản Premium</h1>
                
                <div className="premium-description">
                    <p>Tận hưởng âm nhạc không giới hạn, không quảng cáo với gói Premium.</p>
                </div>
                
                <div className="premium-price">
                    <h2>$5.00 USD / tháng</h2>
                </div>
                
                <div className="premium-payment">
                    <div ref={paypalRef} className="paypal-button-container"></div>
                </div>
                
                <div className="premium-features">
                    <h3>Đặc quyền Premium:</h3>
                    <ul>
                        <li>Nghe nhạc không quảng cáo</li>
                        <li>Tải nhạc để nghe offline</li>
                        <li>Âm thanh chất lượng cao</li>
                        <li>Truy cập tất cả nội dung Premium</li>
                    </ul>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default PayPal;