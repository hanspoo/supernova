// import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";
import { Typography } from "antd";

const { Title } = Typography;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center", padding: "0 25px" }}>
        <Title level={3} style={{ color: "white" }}>
          Supernova
        </Title>
      </Header>
      <Content style={{ padding: "25px" }}>
        <p>A prototypical kafka web socket consumer based on nextjs</p>
        <Component {...pageProps} />
      </Content>
    </Layout>
  );
}

export default MyApp;
