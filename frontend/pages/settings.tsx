import Head from "next/head";
import Link from "next/link";
import React from "react";
import AccountDeletionForm from "components/Forms/AccountDeletionForm";
import PasswordChangeForm from "components/Forms/PasswordChangeForm";
import PreferencesForm from "components/Forms/PreferencesForm";

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

      <div className="border border-dashed border-gray-500 p-4 sm:p-8 my-4">
        <h3 className="section-title">Preferences</h3>

        <PreferencesForm />
      </div>

      <div className="border border-dashed border-gray-500 p-4 sm:p-8 my-4">
        <h3 className="section-title">Change my password</h3>

        <PasswordChangeForm />
      </div>

      <div className="border border-dashed border-gray-500 p-4 sm:p-8 my-4">
        <h3 className="section-title">Delete my account</h3>

        <AccountDeletionForm />
      </div>
    </>
  );
};

export default Settings;
