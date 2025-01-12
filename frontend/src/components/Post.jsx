import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import moment from "moment";
import TemporaryDrawer from "./Reply";
import LinearProgress from "@mui/material/LinearProgress";

const src =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-wqsTzlPABpn0on8er9bjhCNT0OmXf65Xbw&s";

function Post({ post, postedBy }) {
  const [liked, setLiked] = useState(false);
  const [user, setUser ] = useState(null);
  const [deletingPosts, setDeletingPosts] = useState(false);
  const navigate = useNavigate();
  const currUser  = JSON.parse(localStorage.getItem("user-threads"));
  const username = useParams();

  const handleOnClick = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  const handleLikeUnlike = async () => {
    setLiked(!liked);

    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    setDeletingPosts(true);
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return;
      }

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setDeletingPosts(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser  = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setUser (data);
      } catch (error) {
        console.log("Error:", error.message);
        setUser (null);
      }
    };

    getUser ();
  }, [postedBy]);

  if (!user) {
    return null;
  }

  return (
    <>
      {deletingPosts && (
        <LinearProgress color="inherit" className="w-10/12 mx-auto" />
      )}
      <Link to={`/${user.username}/post/${post._id}`}>
        <div className="mx-auto mt-3 pt-6 pl-8 w-full md:w-6/12">
          <div className="flex items-center">
            <Avatar
              className="mt-1"
              src={user?.profilePic}
              alt="User  Avatar"
              onClick={handleOnClick}
            />
            <div className="ml-5" onClick={handleOnClick}>
              <p className="text-lg font-semibold">@{user?.username}</p>
              <p className="text-xs">{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>

          <div className="px-3 mt-3">
            {post.img && (
              <img
                className="w-full rounded-lg"
                src={post.img}
                alt="Post Photo"
              />
            )}
          </div>

          <div className="px-3 mt-3 truncate">{post.text}</div>
        </div>
      </Link>

      <div className="px-4 flex gap-x-5 mx-auto pt-4 w-full md:w-5/12 cursor-pointer">
        <div className="flex gap-x-1">
          {liked === false ? (
            <FaRegHeart className="h-6 w-5" onClick={handleLikeUnlike} />
          ) : (
            <FaHeart className="h-6 w-5" onClick={handleLikeUnlike} />
          )}
          <p className="font-sm">{post.likes.length + (liked ? 1 : 0)}</p>
        </div>

        <div className="flex gap-x-1 w-1/12">
          <TemporaryDrawer post={post} />
          <p className="font-sm">{post.replies.length}</p>
        </div>

        <div className="flex gap-x-1">
          <RiShareForwardLine className="h-6 w-7" />
        </div>

        {currUser ?.username === user?.username && (
          <div className="flex">
            <MdDelete className="h-6 w-7 ml-auto" onClick={handleDeletePost} />
          </div>
        )}
      </div>
      <br />
      <hr className="mx-auto w-full md:w-5/12" />
    </>
  );
}

export default Post;