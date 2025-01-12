import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import LinearProgress from "@mui/material/LinearProgress";
import { FaEye } from "react-icons/fa6";
import { IoEyeOff } from "react-icons/io5";

function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user?.user?.name || user?.name || "",
    username: user?.user?.username || user?.username || "",
    email: user?.user?.email || user?.email || "",
    password: "",
    bio: user?.user?.bio || user?.bio || "",
  });
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user?.user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    console.log(user.length);
    if(user.length >= 0) {
      window.location.reload();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/update/${user.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        alert(data.error || "Failed to update profile");
        console.error(data.error);
        setLoading(false);
        return;
      }

      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      navigate(`/${data.user.username}`);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row mt-3">
      <h1 className="col-12 col-md-8 offset-md-2 text-3xl font-semibold text-center text-md-left">
        Update Profile On Threads
      </h1>
      <div className="col-12 col-md-8 offset-md-2 mt-5">
        <form className="needs-validation" onSubmit={handleSubmit}>
          <div className="row pb-1">
            <div className="col-12 col-md-4 text-center text-md-left pt-3">
              <img
                className="w-64 h-64 rounded-full border-2 border-black mx-auto mx-md-0"
                src={imgUrl || user?.user?.profilePic || "/default-avatar.png"}
                alt="profile"
              />
            </div>
            <div className="col-12 col-md-8 mt-4 mt-md-0">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={inputs.name}
                  required
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="flex gap-x-3 input-group has-validation">
                  <input
                    className="form-control"
                    type={view ? "text" : "password"}
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                  />
                  {!view ? (
                    <FaEye
                      className="mt-2 h-5 w-5"
                      onClick={() => setView(true)}
                    />
                  ) : (
                    <IoEyeOff
                      className="mt-2 h-5 w-5"
                      onClick={() => setView(false)}
                    />
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Update Profile Picture
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Bio
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="1"
              placeholder="Enter Your Biography Here..."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-Mail
            </label>
            <input
              className="form-control"
              type="text"
              value={inputs.email}
              required
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>

          {loading && <LinearProgress color="inherit" />}

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
