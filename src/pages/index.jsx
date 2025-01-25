import { Layout } from "antd"
import Header from "./userLayout/header"
import Hero from "./userLayout/userComponents/hero"
import Features from "./userLayout/userComponents/features"
import Footer from "./userLayout/footer"

const { Content } = Layout

const Index = () => {
    return (
        <Layout className="min-h-screen">
            <Header />
            <Content>
                <Hero />
                <Features />
            </Content>
            <Footer />
        </Layout>
    )
}

export default Index