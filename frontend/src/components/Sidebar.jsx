import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white p-4">
      <nav className="flex flex-col gap-2">

        <button
          onClick={() => navigate("/")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Home
        </button>

        <button
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Explore
        </button>

        <hr className="border-gray-700 my-2" />

        <button
          onClick={() => navigate("/history")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          History
        </button>

        <button
          onClick={() => navigate("/playlist")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Playlists
        </button>

        <hr className="border-gray-700 my-2" />

        <button
          onClick={() => navigate("/dashboard")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/tweets")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Tweets
        </button>

        <button
          onClick={() => navigate("/account")}
          className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Settings
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;