/* eslint-disable react/prop-types */
// import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";

const VideoPlayer = ({
  volume,
  playing,
  setPlaying,
  playerRef,
  id,
  movieType,
  setTitle
}) => {
  const [key, setKey] = useState();

  const delay = () => {
    setTimeout(() => {
      setPlaying(true);
    }, 2000);
  };

  const readyHandler = () => {
    playerRef.current.seekTo(2, "seconds");
    delay();
  };

  const progressHandler = (progress) => {
    if (progress.played >= 0.85) {
      setPlaying((prevPlaying) => {
        if (prevPlaying) {
          return false; // This will ensure the state is set to false
        }
        return prevPlaying; // No change to the state
      });
      playerRef.current.seekTo(2, "seconds");
    }
  };

  const getKey = async () => {
    const config = {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_AUTH}`
      }
    };
    try {
      let movie;
      let logo;

      if (movieType === "movie") {
        movie = await axios.get(
          `${import.meta.env.VITE_TMDB_URL}/movie/${id}/videos?language=en-US`,
          config
        );
      }
      if (movieType === "tv") {
        movie = await axios.get(
          `${import.meta.env.VITE_TMDB_URL}/tv/${id}/videos?language=en-US`,
          config
        );
      }

      logo = await axios.get(
        `${import.meta.env.VITE_TMDB_URL}/${movieType}/${id}/images`,
        config
      );

      logo = logo.data["logos"];

      if (!movie) {
        throw new Error("video not found");
      }

      for (var item of movie.data.results) {
        if (item.type.toLowerCase() === "trailer") {
          setKey(item.key);
          break;
        }
      }

      if (logo) {
        for (var any of logo) {
          if (any["iso_639_1"] === "en") {
            setTitle(any["file_path"]);
            return;
          }
        }
        setTitle(logo[0]["file_path"]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!key) {
      getKey();
    }
  }, []);

  return (
    <div className="player-wrapper h-full">
      <ReactPlayer
        className="react-player"
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${key}`}
        playing={playing}
        controls={false} // Disable default controls
        volume={volume}
        height="100%"
        width="100%"
        onReady={readyHandler}
        onPause={() => setPlaying(false)}
        progressInterval={1000}
        onProgress={progressHandler}
      />
    </div>
  );
};

export default VideoPlayer;
