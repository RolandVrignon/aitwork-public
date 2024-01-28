import React, { useEffect, useState } from "react";

const Avatar = ({ Request, user, setUser, handleAvatarChange }) => {
  const [avatar, setAvatar] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const arr = [
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/24_hXiAQMpow.png?updatedAt=1682989406754",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/23_lnynwJAQ-.png?updatedAt=1682989406528",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/22_2622WDJvy.png?updatedAt=1682989406257",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/21__3lRLO-ia.png?updatedAt=1682989405919",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/13_URAHgpwQdI.png?updatedAt=1682989404402",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/20__bwZZGF3-.png?updatedAt=1682989404316",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/15_oC5kWIJMb.png?updatedAt=1682989404296",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/17_87Jv06qMlW.png?updatedAt=1682989404274",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/18_1dO7qKFJY.png?updatedAt=1682989404298",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/19_Zt2nhX2Tn.png?updatedAt=1682989404249",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/14_7qgRkUU1t.png?updatedAt=1682989404195",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/16_wpXhKlqUK.png?updatedAt=1682989404180",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/12__S1bdptg-.png?updatedAt=1682989404100",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/11_syj4b4ppQ.png?updatedAt=1682989403846",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/05_ZX61D-luAH.png?updatedAt=1682989400739",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/02_1GIJGXN0r.png?updatedAt=1682989400721",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/03_J9gQJNfB1.png?updatedAt=1682989400707",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/10_O1nSN_YiM.png?updatedAt=1682989400697",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/06_miaEkNfkMz.png?updatedAt=1682989400674",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/04_JqS-jRq7s.png?updatedAt=1682989400667",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/01_6q-2AqlFBg.png?updatedAt=1682989400674",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/09_CzL-qNnap.png?updatedAt=1682989400664",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/07_GqrLO5THN.png?updatedAt=1682989400659",
      "https://ik.imagekit.io/z0tzxea0wgx/Cogitum/Avatar/08_9t0gtB9j1.png?updatedAt=1682989400583",
    ];

    setAvatar(arr);
  }, []);

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  const handleSubmit = async () => {
    if (selectedIndex === null) {
      return;
    }

    const profilePic = avatar[selectedIndex];

    try {
      await Request.Put("/protected/user/update/profilepic", {
        profilePic,
      });
      setUser({ ...user, profilePic });
      handleAvatarChange();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Error updating profile picture. Please try again.");
    }
  };

  return (
    <div className="choose-avatar">
      <div className="cross" onClick={() => handleAvatarChange()}>
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-900 dark:text-gray-200"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <div className="avatar-container">
        <ul>
          {avatar.map((url, index) => (
            <li
              key={index}
              onClick={() => handleClick(index)}
              className={index === selectedIndex ? "active" : ""}
            >
              <img
                src={`${url}&tr=w-1000,h-auto`}
                alt={`Avatar ${index + 1}`}
                className="avatar-image"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="validate">
        <button
          disabled={!selectedIndex}
          onClick={handleSubmit}
        >
          Modifier avatar
        </button>
      </div>
    </div>
  );
};

export default Avatar;
