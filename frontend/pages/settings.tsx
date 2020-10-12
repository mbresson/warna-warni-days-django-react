import Head from "next/head";
import Link from "next/link";
import React from "react";
import AccountDeletionForm from "../components/AccountDeletionForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

const Settings: React.FC<{}> = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <h2 className="main-title">Settings</h2>

      <Link href="/">
        <button className="big choice block m-auto my-8">
          <a>&lt;- Back to home page</a>
        </button>
      </Link>

      <h3 className="section-title">Change my password</h3>

      <PasswordChangeForm />

      <h3 className="section-title">Delete my account</h3>

      <AccountDeletionForm />
    </>
  );
};

export default Settings;
