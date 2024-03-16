import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
        <img
          src={currentUser.avatar}
          alt="profile pic"
          className="rounded-full self-center h-24 w-24 object-cover cursor-pointer mt-2 mb-3"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border m-2 p-3 rounded-lg"
          value={currentUser.username}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border m-2 p-3 rounded-lg"
          value={currentUser.email}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border m-2 p-3 rounded-lg"
        />
        <button className="bg-black text-white rounded-lg m-2 p-3 hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between m-2">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
