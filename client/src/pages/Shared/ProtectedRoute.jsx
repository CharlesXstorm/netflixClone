/* eslint-disable react/prop-types */
// import React from 'react'
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setData, setProfile } from "../../utils/profileSlice";

const ProtectedRoute = ({
  setLoaded,
  addProfile,
  editClick
}) => {
  const [auth, setAuth] = useState();
  const [ready, setReady] = useState();

  const dispatch = useDispatch();

  let selectedProfile = JSON.parse(localStorage.getItem("Profile")) ?? null;

  const getUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          withCredentials: true
        }
      };

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth`,
        config
      );
      return res.data.data;
    } catch (err) {
      return err.response.data.data;
    }
  };

  //getUser ////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();

      if (!user) {
        setAuth(false);
        setReady(true);
      } else {
        dispatch(setData(user));
        dispatch(setProfile(selectedProfile));
        setAuth(true);
        setReady(true);
        setLoaded(true);
      }
    };
    fetchData();
  }, [addProfile, editClick]);

  return <>{ready && <>{auth ? <Outlet /> : <Navigate to="/" />}</>}</>;
};

export default ProtectedRoute;
