import "bootstrap/dist/css/bootstrap.min.css";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import LogoutBtn from "./LogoutBtn";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";
import { MdPersonAddAlt1 } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";

const src =
  "https://logos-world.net/wp-content/uploads/2023/07/Threads-Logo.png";

function Header() {
  const currUser = JSON.parse(localStorage.getItem("user-threads"));
  const [user] = useRecoilState(userAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="container sticky top-0 z-10 bg-white">
        <header className="flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div className="col-6 col-md-3 mb-2 mb-md-0">
            <a
              href="/"
              className="d-inline-flex link-body-emphasis text-decoration-none"
            >
              <img className="w-16 h-10" src={src} alt="Logo" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="col-6 col-md-2 text-end d-md-none">
            <button onClick={toggleMenu} className="btn btn-outline-secondary">
            <CiMenuBurger />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="col-6 col-md-2 text-end d-none d-md-flex">
            <div className="flex justify-end gap-x-5">
              {currUser && (
                <div className="flex gap-x-5">
                  <Link to={"/getsuggetion"}>
                    <MdPersonAddAlt1 className="w-10 h-10" />
                  </Link>
                  <Link to={"/chat"}>
                    <IoChatboxOutline className="w-10 h-10" />
                  </Link>
                  <Link to={currUser.user ? `${currUser?.user.username}` : `${currUser.username}`} >
                  {/* <Link to={`/${currUser?.user.username}`}> */}
                    <MdAccountCircle className="w-10 h-10" />
                  </Link>
                </div>
              )}
              {user && user[0] !== null ? (
                <div>
                  <LogoutBtn />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="d-md-none bg-light p-3">
            {currUser && (
              <div className="grid grid-cols-2 gap-y-7">
                <Link to={"/getsuggetion"} className="d-block">
                  <MdPersonAddAlt1 className="w-9 h-9" />
                  Suggestion
                </Link>
                <Link to={"/chat"} className="d-block">
                  <IoChatboxOutline className="w-9 h-9" />
                  Chat
                </Link>
                <Link to={currUser.user ? `${currUser?.user.username}` : `${currUser.username}`} className="d-block">
                  <MdAccountCircle className="w-9 h-9" />
                  Profile
                </Link>
                {user[0] !== null && (
                  <div className="mt-2">
                    <LogoutBtn />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
