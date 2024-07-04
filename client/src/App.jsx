// import { useState } from "react";
import { Routes, Route } from "react-router-dom";
// import "./App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getWidth } from "./utils/dvWidthSlice.js";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Shared/Signup";
import Registration from "./components/Registration";
import Regform from "./components/Regform";
// import Browse from "./pages/Shared/BrowseShared";
import Browse from "./pages/Browse";
import ManageProfiles from "./pages/ManageProfiles";
import BrowseShared from "./pages/Shared/BrowseShared";
import ProtectedRoute from "./pages/Shared/ProtectedRoute.jsx";

import Logout from "./pages/Logout.jsx";
import AuthRoute from "./pages/Shared/AuthRoute.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import GenreMovies from "./pages/GenreMovies.jsx";
import GenreTV from "./pages/GenreTV.jsx";
import Search from "./pages/Search.jsx";
import Mylist from "./pages/Mylist.jsx";

function App() {
  // const [profileClick, setProfileClick] = useState(false)
  const[editClick,setEditClick] = useState(false)
  // const [accountClick,setAccountClick] = useState(false)
  const [accountClick,setAccountClick] = useState(false)
  const [accountLoader, setAccountLoader] = useState(false);
  const [email,setEmail] = useState("")
  const [loaded,setLoaded] = useState(false)
  const [addProfile,setAddProfile] = useState()
  const { data, profile } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const handleEvent = () => {
    dispatch(getWidth(
      Math.max(
        window.innerWidth,
        document.body.offsetWidth,
        document.body.clientWidth)
    ));
  };

  useEffect(() => {
    window.addEventListener("load", handleEvent);
    window.addEventListener("resize", handleEvent);

    return () => {
      window.removeEventListener("load", handleEvent);
      window.removeEventListener("resize", handleEvent);
    };
  }, []);
 
  return (
    <Routes>

    <Route element={<AuthRoute setAccountClick={setAccountClick} />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Signin />} />
      <Route path="signup" element={<Signup setEmail={setEmail} />}>
        <Route index element={<Registration />} />
        <Route path="regform" element={<Regform email={email} />} />
      </Route>
    </Route>

      <Route path="logout" element={<Logout />} />

      <Route element={<ProtectedRoute setLoaded={setLoaded} addProfile={addProfile} editClick={editClick}/>}>
        <Route path="browse" element={<BrowseShared setAccountLoader={setAccountLoader} setAccountClick={setAccountClick} accountClick={accountClick}/>}>
          <Route index element={<Browse data={data} profile={profile} accountClick={accountClick} setAccountClick={setAccountClick} accountLoader={accountLoader} setAccountLoader={setAccountLoader} setEditClick={setEditClick} loaded={loaded} addProfile={addProfile} setAddProfile={setAddProfile} />} />
          <Route path=":id" element={<MovieDetail/>} />
          <Route path='genre/movies' element={<GenreMovies/>} />
          <Route path='genre/tv_shows' element={<GenreTV/>} />
          <Route path='search' element={<Search/>} />
          <Route path='mylist' element={<Mylist/>} />
        </Route>
        <Route path="ManageProfiles" element={<ManageProfiles editClick={editClick} setEditClick={setEditClick} setAccountClick={setAccountClick} loaded={loaded} />} />
      </Route>

    </Routes>
  );
}

export default App;
