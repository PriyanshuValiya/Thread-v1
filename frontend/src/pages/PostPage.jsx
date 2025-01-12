import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TiArrowSync } from "react-icons/ti";
import TemporaryDrawer from "../components/Reply.jsx";
import Comment from "../components/Comment.jsx";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { MdDelete } from "react-icons/md";

function PostPage() {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const { username, pid } = useParams();
  const currUser = useRecoilValue(userAtom);

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

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        setPost(data);
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, [pid]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res2 = await fetch(`/api/users/profile/${username}`);
        const data2 = await res2.json();

        if (data2.error) {
          alert(data2.error);
          return;
        }

        setUser(data2);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [pid]);

  return (
    <>
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex items-start">
          <Avatar className="mt-1" src={user?.profilePic} alt="User  Avatar" />

          <div className="ml-5">
            <p className="text-lg font-semibold">@{user?.username}</p>
            <p className="text-xs">{moment(post?.createdAt).fromNow()}</p>
          </div>
        </div>

        <div className="px-3 mt-3">
          <img className="w-full rounded-lg" src={post?.img} alt="Post Photo" />
        </div>

        <div className="px-3 mt-3">{post?.text}</div>

        <div className="flex pt-3 cursor-pointer">
          <div>
            {liked === false ? (
              <FaRegHeart className="h-6 w-5" onClick={handleLikeUnlike} />
            ) : (
              <FaHeart className="h-6 w-5" onClick={handleLikeUnlike} />
            )}
          </div>

          <div className="ml-6">
            <TemporaryDrawer post={post} />
          </div>

          <div>
            <TiArrowSync className="h-6 w-7" />
          </div>

          <div className="ml-3">
            <RiShareForwardLine className="h-6 w-7" />
          </div>

          {currUser?._id === user?._id && (
            <div className="ml-auto">
              <MdDelete className="h-6 w-7" />
            </div>
          )}
        </div>

        <div className="mt-3">
          <p>
            {post?.likes.length + (liked ? 1 : 0)} likes &bull;{" "}
            {post?.replies.length} replies
          </p>
        </div>
        <br />
        <hr className="mx-auto mt-3 w-full" />
        <br />
        <h2 className="font-semibold text-3xl mb-4">All Replies..</h2>

        {post?.replies.map((reply) => (
          <Comment key={reply._id} reply={reply} />
        ))}
      </div>
    </>
  );
}

export default PostPage;
