import React, { useEffect, useState, createRef } from "react";
import Video from "twilio-video";

const TOKENS = [
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0LTE2NjQ4ODMyOTgiLCJpc3MiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0Iiwic3ViIjoiQUMxNWJiZjIyZWNlNmNhODVlZjkwNDRhNGI3ZjZlN2VmNyIsImV4cCI6MTY2NDg4Njg5OCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiY3ZleGEiLCJ2aWRlbyI6eyJyb29tIjoicmVhY3QxIn19fQ.8caZ32V-jlxz4HLRHvXolMKg3Jjuh4ijR1pX0K5vagk",
    //"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0LTE2NjQ4ODM0NDgiLCJpc3MiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0Iiwic3ViIjoiQUMxNWJiZjIyZWNlNmNhODVlZjkwNDRhNGI3ZjZlN2VmNyIsImV4cCI6MTY2NDg4NzA0OCwiZ3JhbnRzIjp7ImlkZW50aXR5Ijoic3ZldGxpIiwidmlkZW8iOnsicm9vbSI6InJlYWN0MSJ9fX0.csYu5usp3a1NEt8NBeUPYoQwR64LrYYwbU1QQBS3shM"
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0LTE2NjQ4ODM2ODkiLCJpc3MiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0Iiwic3ViIjoiQUMxNWJiZjIyZWNlNmNhODVlZjkwNDRhNGI3ZjZlN2VmNyIsImV4cCI6MTY2NDg4NzI4OSwiZ3JhbnRzIjp7ImlkZW50aXR5Ijoic3ZldGxpMiIsInZpZGVvIjp7InJvb20iOiJyZWFjdDEifX19.NjXMCAhIgx9LDoKc_6Yiobr9TPAt6lUpk3hBRaBLFZU",
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0LTE2NjQ4ODQwMDIiLCJpc3MiOiJTSzI1NjRmMTZmYjFiYTU3MmY3NThiMGQ2YjE5YTBjZWQ0Iiwic3ViIjoiQUMxNWJiZjIyZWNlNmNhODVlZjkwNDRhNGI3ZjZlN2VmNyIsImV4cCI6MTY2NDg4NzYwMiwiZ3JhbnRzIjp7ImlkZW50aXR5Ijoic3ZldGxpMyIsInZpZGVvIjp7InJvb20iOiJyZWFjdDEifX19.sVI5SlLv7_m9oBEDg4J-gK2PQhpal3Q-Rdx_IE1GCvA"
];

const INITIAL_STATE = {
  state: "disconnected"
};
const videoMe = createRef();
const videoOther = createRef();

export default function App() {
  // let videoRoom = INITIAL_STATE;
  const [videoRoom, setVideoRoom] = useState(INITIAL_STATE);
  const [currentToken, setCurrentToken] = useState(TOKENS[0]);
  const [guest, setGuest] = useState(null);

  const handleRoomDisconnect = room => {
    room.localParticipant.tracks.forEach(publication => {
      console.log(publication);
      const attachedElements = publication.track.detach();
      console.log({ attachedElements });
      attachedElements.forEach(element => element.remove());
    });

    setVideoRoom(INITIAL_STATE);
  };

  const handleUserConnected = participant => {
    console.log({ participant });
    console.log({ videoRoom }, videoRoom.participants);
    console.log(`Participant "${participant.identity}" connected`);
    participant.tracks.forEach(track => {
      console.log("participants track", track.attach);
      // track.attach(videoOther);
    });

    participant.on("trackAdded", track => {
      console.log("trackAdded", track.attach);
      // document.getElementById('remote-media-div').appendChild(track.attach());
    });
  };

  const handleTokenChange = event => {
    setCurrentToken(event.target.value);
  };

  const handleClick = () => {
    Video.connect(currentToken, {
      name: "room",
      audio: false,
      video: { width: 300 }
    })
        .then(room => {
          // videoRoom = room;
          setVideoRoom(room);
          initialiseVideo();
          console.log({ room });
          room.on("disconnected", handleRoomDisconnect);
          // room.on("participantConnected", handleUserConnected);

          const localParticipant = room.localParticipant;
          console.log(
              `Connected to the Room as LocalParticipant "${
                  localParticipant.identity
              }"`
          );

          room.participants.forEach(participant => {
            console.log(
                `Participant "${participant.identity}" is connected to the Room`
            );
              setGuest(participant.identity);

            participant.tracks.forEach(publication => {
              if (publication.isSubscribed) {
                const track = publication.track;

                videoOther.current.appendChild(track.attach());
              }
            });

            participant.on("trackSubscribed", track => {
              videoOther.current.appendChild(track.attach());
            });
          });

          // Log any Participants already connected to the Room
          room.on("participantConnected", participant => {
            console.log(`Participant "${participant.identity}" connected`);
            setGuest(participant.identity);
            participant.tracks.forEach(publication => {
              if (publication.isSubscribed) {
                const track = publication.track;

                videoOther.current.appendChild(track.attach());
              }
            });

            participant.on("trackSubscribed", track => {
              videoOther.current.appendChild(track.attach());
            });
          });

          // Log Participants as they disconnect from the Room
          room.once("participantDisconnected", participant => {
            console.log(
                `Participant "${
                    participant.identity
                }" has disconnected from the Room`
            );
          });
        })
        .catch(error => {
          console.error(error);
        });
  };

  const initialiseVideo = () => {
    Video.createLocalVideoTrack().then(track => {
      const localMediaContainer = videoMe.current;
      track.attach(localMediaContainer);
    });
  };

  const handleDisconnect = () => {
    videoRoom.disconnect();
  };

  const isConnected = videoRoom.state === "connected";
  return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Select a profile</h2>
        <select onChange={handleTokenChange} value={currentToken}>
          {TOKENS.map((token, i) => (
              <option key={i} value={token}>
                Token  / profile {i + 1}
              </option>
          ))}
        </select>
        {isConnected ? (
            <button onClick={handleDisconnect}>Disconnect</button>
        ) : (
            <button onClick={handleClick}>Call</button>
        )}
        <div>
          <p>Room ID: {videoRoom.name}</p>
          <p>This is you</p>
          <video
              style={{ width: "300px", height: "auto" }}
              id="local-video"
              ref={videoMe}
          />
            <p>This is the other person - {guest}</p>
          <div
              style={{ width: "300px", height: "auto" }}
              id="remote-video"
              ref={videoOther}
          />
        </div>
      </div>
  );
}
