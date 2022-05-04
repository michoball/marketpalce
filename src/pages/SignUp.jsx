import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCapy = { ...formData };
      delete formDataCapy.password;
      formDataCapy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCapy);
      toast.success("Login is Success!");
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      toast.error("Login is Failed!");
    }
  };

  return (
    <Fragment>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            className="nameInput"
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={onChange}
          />
          <input
            className="emailInput"
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              className="passwordInput"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              autoComplete="off"
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <div className="linkBlock">
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
          </div>

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton" type="submit">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />

        <div className="linkBlock">
          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default SignUp;
