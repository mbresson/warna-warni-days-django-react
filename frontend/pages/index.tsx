import Head from "next/head";
import { useAuth } from "../utils/AuthProvider";

const Index: React.FC<{}> = () => {
  const auth = useAuth();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className="w-full max-w-xs m-auto">
        Welcome {JSON.stringify(auth)}!
      </div>
    </>
  );
};

export default Index;
