import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ErrorsList from "./ErrorsList";

type Properties = {
  onCancel: () => void;
  onPasswordSubmitted: (password: string) => void;
  errors?: string[];
};

const PasswordCheckModal: React.FC<Properties> = (props) => {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    ref.current = document.querySelector("#portal-root");
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="absolute top-0 left-0 w-screen h-screen bg-opacity-90 bg-gray-300">
      <form
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="text-center border border-gray-500 bg-white screen-modal p-6 absolute"
        onSubmit={(e) => {
          e.preventDefault();
          props.onPasswordSubmitted(password);
        }}
      >
        <div>
          <label className="text-xl block mb-4" htmlFor="password">
            Enter your current password for this operation
          </label>

          <input
            className="max-w-md"
            id="password"
            type="password"
            placeholder="***"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {props.errors && <ErrorsList errors={props.errors} />}

        <div className="mt-8">
          <button className="medium positive-feeling" type="submit">
            Submit
          </button>

          <strong className="mx-5 text-xl">or</strong>

          <button className="medium mixed-feeling" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>,
    ref.current
  );
};

export default PasswordCheckModal;
