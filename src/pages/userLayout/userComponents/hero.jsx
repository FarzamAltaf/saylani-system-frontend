import { Button } from "antd"

const Hero = () => {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Our Amazing Platform</h1>
                    <p className="text-xl mb-8">
                        Discover the power of innovation and creativity with our cutting-edge solutions.
                    </p>
                    <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-blue-100 border-0">
                        Get Started
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Hero

