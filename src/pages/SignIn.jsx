import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user);
      if (userCredential.user) {
        toast.success("welcome again !");
        navigate("/");
      }
    } catch (error) {
      const errorCode = error.code;

      toast.error(`Please Sign Up First! errorCode :${errorCode}`, {
        autoClose: 3000,
      });
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
          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default SignIn;
