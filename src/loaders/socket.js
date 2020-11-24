module.exports = (server) => {
  let io = require("socket.io").listen(server);
  // io.set('transports', ['websocket']);
  const randomInt = require("random-int");
  const nsGame = io.of("game");
  let hostInfo = [];
  const randCode = () => {
    return randomInt(10000);
  };
  const findInfobyHostId = (hostId) => {
    let ind = -1;
    hostInfo.forEach((item, index) => {
      if (item.hostId === hostId) {
        ind = index;
      }
    });
    return ind;
  };
  const findInfobyCodePin = (codePin) => {
    let ind = -1;
    hostInfo.forEach((item, index) => {
      if (item.codePin === codePin) {
        ind = index;
      }
    });
    return ind;
  };
  const getSocketsbyRoomName = (roomName) => {
    if (typeof nsGame.adapter.rooms[roomName] !== "undefined") {
      let socketsId = nsGame.adapter.rooms[roomName].sockets;
      let sockets = [];
      for (const k in socketsId) {
        sockets.push(nsGame.connected[k]);
      }
      return sockets;
    } else {
      return null;
    }
  };
  const getUserNamebyRoomeName = (roomName) => {
    return getSocketsbyRoomName(roomName)
      ? getSocketsbyRoomName(roomName).map((socket) =>
          socket.username ? socket.username : "host"
        )
      : null;
  };
  const getIDbyRoomeName = (roomName) => {
    return getSocketsbyRoomName(roomName)
      ? getSocketsbyRoomName(roomName).map((socket) => socket.id)
      : null;
  };
  const outRoom = (socket, codepin) => {
    socket.leave(codepin);
  };
  nsGame.on("connection", function (socket) {
    socket.on("host-join", () => {
      let codePin = randCode().toString();
      socket.join(codePin);
      hostInfo.push({
        hostId: socket.id,
        codePin: codePin,
        playersId: [],
        playersName: [],
        start: false,
      });
      socket.emit("showGamePin", {
        pin: codePin,
      });
    });
    socket.on("join-room", (data) => {
      console.log(socket.id);
      if (getUserNamebyRoomeName(data.pin) !== null) {
        socket.join(data.pin);
        socket.username = data.username;
        let playersName = getUserNamebyRoomeName(data.pin);
        let playersId = getIDbyRoomeName(data.pin);
        hostInfo.forEach((item) => {
          if (item.codePin === data.pin) {
            item.playersName = playersName;
            item.playersId = playersId;
          }
        });
        nsGame.to(data.pin).emit("player-lobby", {
          players: playersName,
          playerJoin: data.username,
        });
        socket.emit("check-join-room", {
          result: true,
        });
      } else {
        socket.emit("check-join-room", {
          result: false,
        });
      }
    });
    socket.on("startGame", (data) => {
      let index = findInfobyHostId(socket.id);
      if (index !== -1) {
        hostInfo[index].hostId = "redirectedId";
      }
      hostInfo[index].start = true;
      nsGame.to(data.pin).emit("redirect", { redirect: "/playing-game/" });
      socket.emit("redirect", { redirect: "/game/" + data.gameId });
    });
    socket.on("current-length-game", (data) => {
      console.log(data);
      nsGame.emit("get-current-length-game", data);
    });
    socket.on("change-hostId", (data) => {
      let index = findInfobyHostId("redirectedId");
      if (index !== -1) {
        hostInfo[index].hostId = data.hostId;
        socket.join(hostInfo[index].codePin);
        let playersName = getUserNamebyRoomeName(hostInfo[index].codePin);
        let playersId = getIDbyRoomeName(hostInfo[index].codePin);
        hostInfo[index].playersName = playersName;
        hostInfo[index].playersId = playersId;
      }
    });
    socket.on("join-room-again", (data) => {
      socket.join(data.reCode);
      socket.username = data.username;
    });
    socket.on("choose-answer", (data) => {
      nsGame
        .to(hostInfo[findInfobyCodePin(data.codePin)].hostId)
        .emit("anwser-to-host", {
          answer: data.answer,
          username: data.username,
        });
    });
    socket.on("payload-data", () => {
      let code = hostInfo[findInfobyHostId(socket.id)]
        ? hostInfo[findInfobyHostId(socket.id)].codePin
        : null;

      socket.emit("number-player", {
        arrNamePlayer: code ? getUserNamebyRoomeName(code) : [],
      });
    });
    // nsGame.to(hostId).emit("number-player", {
    //   // arrNamePlayer: index !== -1 ? hostInfo[ind].players : [],
    //   arrNamePlayer: ["abc,cd,emf,cmnr"],
    // });
    // socket.on("change-hostId", (data) => {
    //   let oldHostId = hostId;
    //   hostId = data.hostId;

    //   let ind = findInfobyHostId(hostId);
    //   console.log;
    //   nsGame.to(hostId).emit("number-player", {
    //     // arrNamePlayer: index !== -1 ? hostInfo[ind].players : [],
    //     arrNamePlayer: ["abc,cd,emf,cmnr"],
    //   });
    // });
    socket.on("kick-player-out-room", (codePin) => {
      outRoom(socket, codePin);
    });
    socket.on("kick-player-request", (key) => {
      let index = findInfobyHostId(socket.id);
      let socketId = hostInfo[index].playersId[key];
      nsGame.to(socketId).emit("kick-player-response", hostInfo[index].codePin);
      for (let j = 0; j < hostInfo[index].playersId.length; j++) {
        if (hostInfo[index].playersId[j] === socketId) {
          hostInfo[index].playersId.splice(j, 1);
          hostInfo[index].playersName.splice(j, 1);
          break;
        }
      }
      nsGame
        .to(hostInfo[index].hostId)
        .emit("refreshPlayer", { players: hostInfo[index].playersName });
      nsGame.to(socketId).emit("kick");
    });
    socket.on("disconnect", () => {
      for (let i = 0; i < hostInfo.length; i++) {
        if (hostInfo[i].hostId === socket.id) {
          let hostCodePin = hostInfo[i].codePin;
          if (hostInfo[i].start === true) {
            hostInfo[i].start = false;
            return;
          }
          outRoom(socket, hostCodePin);
          console.log("host out room");
          nsGame.to(hostCodePin).emit("host-disconnect");
          hostInfo.splice(i, 1);
          break;
        } else {
          for (let j = 0; j < hostInfo[i].playersId.length; j++) {
            if (hostInfo[i].playersId[j] === socket.id) {
              let playerCodepin = hostInfo[i].codePin;
              let playerDisName = hostInfo[i].playersName[j];
              if (hostInfo[i].start === true) {
                return;
              }
              outRoom(socket, playerCodepin);
              hostInfo[i].playersId.splice(j, 1);
              hostInfo[i].playersName.splice(j, 1);
              nsGame.to(playerCodepin).emit("player-disconnect", {
                players: hostInfo[i].playersName,
                playerDis: playerDisName,
              });
              break;
            }
          }
        }
      }
    });
  });
  return io;
};
