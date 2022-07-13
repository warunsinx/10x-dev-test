import type { NextPage } from "next";
import Head from "next/head";
import MainView from "../components/MainView";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>10xBank</title>
        <meta name="description" content="10xBank" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainView />
    </div>
  );
};

export default Home;
