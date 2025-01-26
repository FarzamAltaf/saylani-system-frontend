import { Image, Button } from "antd";
import { Link } from "react-router";

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-blue-600">
                        <span>
                            <Image
                                src="https://res.cloudinary.com/dd2alel5h/image/upload/v1737360953/logo_saylaniwelfare.22bf709605809177256c_fm7fvu.png"
                                height={50}
                                preview={false}
                            />
                        </span>
                    </div>

                    {/* Buttons for Signup and Signin */}
                    <div className="flex gap-4">
                        <Link to="/signup">
                            <Button type="primary" className="bg-blue-600">
                                Signup
                            </Button>
                        </Link>
                        <Link to="/signin">
                            <Button type="default" className="border-blue-600 text-blue-600">
                                Signin
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
