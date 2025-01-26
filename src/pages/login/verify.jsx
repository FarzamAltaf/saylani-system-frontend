import { useState, useRef, useEffect } from 'react';
import { Form, Button, message } from 'antd';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const Verification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cookieOtp, setCookieOtp] = useState();
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    useEffect(() => {
        const users = Cookies.get("user");
        if (users) {
            const user = JSON.parse(users);
            setEmail(user.email);
        }
        const CookieOTP = Cookies.get("verificationCode");
        setCookieOtp(CookieOTP);
    }, [])

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const updatedOtp = [...otp];
        updatedOtp[index] = element.value;
        setOtp(updatedOtp);

        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key !== 'Backspace' && otp[index]) {
            inputRefs.current[index].setSelectionRange(0, 1);
        }
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            console.log("Input otp", otpValue);
            console.log("Cookie otp", cookieOtp);

            if (otpValue === cookieOtp) {
                message.success('Your Email verified');
                Cookies.remove("verificationCode");
                Cookies.set("status", true, { expires: 2 });
                navigate("/user/update-password");
            }
            else {
                message.error('Invalid OTP');
                Cookies.set("status", false, { expires: 2 });
            }
        } else {
            message.error('Please enter a valid 6-digit OTP');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Verification Code</h2>
                <p className="text-gray-600 mb-2 text-center">
                    We have sent you an OTP to {email}
                </p>
                <Form onFinish={handleSubmit}>
                    <div className="flex justify-between mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 border-2 rounded bg-gray-100 text-center text-xl font-bold"
                            />
                        ))}
                    </div>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600"
                        >
                            Verify
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Verification;
