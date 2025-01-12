import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Loader from "./Loader.jsx";

function UserHeader({ user }) {
  const { username } = useParams();
  const currUser = JSON.parse(localStorage.getItem("user-threads"));
  const src =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW_7S1tTbik8e9it64VbcIApAwno9hZeJmSg&s";
  const [loading, setLoading] = useState(false);

  const [following, setFollowing] = useState(
    user.followers.includes(currUser._id)
  );

  const copyUrl = () => {
    const currUrl = window.location.href;
    navigator.clipboard.writeText(currUrl); // Copy URL to clipboard
    alert("Profile URL Copied To Clipboard...");
  };

  const handleFollowUnfollow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setFollowing(!following);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center px-4 sm:px-10">
        <img
          src={user?.profilePic || src}
          className="w-28 h-28 border-2 border-black rounded-full"
          alt="Profile"
        />
        <div className="ml-0 sm:ml-7 mt-4 sm:mt-0">
          <h1 className="text-3xl font-semibold text-gray-900">{user?.name}</h1>
          <p className="text-lg mt-1 text-gray-500">@{user?.username}</p>
        </div>
      </div>
      <p className="mt-2 ml-0 sm:ml-44 text-gray-700">Bio: {user?.bio}</p>
      <div className="mt-4 flex flex-col sm:flex-row space-x-0 sm:space-x-6">
        <div className="ml-0 sm:ml-44">
          <span className="font-bold text-gray-900">
            {user?.followers.length}
          </span>
          <span className="text-gray-500"> Followers</span>
        </div>
        <div className="mt-2 sm:mt-0">&bull;</div>
        <div>
          <span className="font-bold text-gray-900">
            {user?.following.length}
          </span>
          <span className="text-gray-500"> Following</span>
        </div>
      </div>

      <div className="ml-0 sm:ml-44 mt-4 flex flex-col sm:flex-row">
        <button
          type="button"
          className="btn btn-outline-dark me-2 btn-sm"
          onClick={copyUrl}
        >
          Share Profile
        </button>
        {(currUser.user ? (currUser.user.username === username) : (currUser.username === username)) ? (
          <>
            <Link to="/update">
              <button
                type="button"
                className="btn btn-outline-dark me-2 btn-sm"
              >
                Edit Profile
              </button>
            </Link>
            <Link to="/newpost">
              <button
                type="button"
                className="btn btn-outline-dark me-2 btn-sm"
              >
                Create Post
              </button>
            </Link>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-outline-dark me-2 btn-sm"
            onClick={handleFollowUnfollow}
          >
            {loading && <Loader />}
            {following ? "Unfollow" : "Follow"} Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default UserHeader;
