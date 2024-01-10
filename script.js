// Finally the site is ready
// It took me more than 30 hours to build this

let currentSong = new Audio();
console.log("JavaScript Time");
let songs;
let currFol;
function secondsToMinutesSeconds(seconds) {
  // Ensure input is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const min = Math.floor(seconds / 60);
  const remainSec = Math.floor(seconds % 60);
  const formattedMint = String(min).padStart(2, "0");
  const formattedSec = String(remainSec).padStart(2, "0");

  return `${formattedMint}:${formattedSec}`;
}
async function getSongs(folder) {
  currFol = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  console.log(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const iterator of songs) {
    let temp = iterator;
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
    <img src="img/music.svg" class="invert-color" alt="" />
    <div class="info">
    <div>${temp
      .replaceAll("%20", " ")
      .replaceAll(".mp3", "")
      .replace("/", " ")}</div>
                  <div>Lakshay</div>
                  </div>
                  <div class="playNow">
                  <span>Play Now</span>
                  <img src="img/play.svg" class="invert-color" alt="" />
                  </div></li>`;
    // console.log(iterator);
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(
        "/" + e.querySelector(".info").firstElementChild.innerHTML.trim()
      );
      currentSong.volume = 0.2;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 20;
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFol}` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track)
    .replace(".mp3", "")
    .replaceAll("/", "");
  console.log(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
  // currentSong.volume("20%");
  // audio.play();
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/Songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141B34"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img
        src="/Songs/${folder}/cover.jpg"
        alt="Lofi Beats"
      />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log(item.currentTarget.dataset);
      songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0].replace(".mp3", ""));
      currentSong.volume = 0.2;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 20;
    });
  });
}
async function main() {
  await getSongs("Songs/badassSongs");
  console.log(songs[0].replace(".mp3", ""));
  playMusic(songs[0].replace(".mp3", ""), true);
  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  let index2 = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (currentSong.currentTime === currentSong.duration) {
      ++index2;
      if (index2 < songs.length) {
        index2++;
        playMusic(songs[index2].replace(".mp3", ""));
      }
    }
  });
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  document.querySelector(".hamBurger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  previous.addEventListener("click", () => {
    console.log("Previous Clicked");
    let index = songs.indexOf(
      "/" + currentSong.src.split("/").slice(-1)[0].replace(" ", "%20")
    );
    if (index - 1 >= 0) {
      playMusic(songs[index - 1].replace(".mp3", ""));
    }
  });
  next.addEventListener("click", () => {
    console.log("Next Clicked");
    let index = songs.indexOf(
      "/" + currentSong.src.split("/").slice(-1)[0].replace(" ", "%20")
    );
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1].replace(".mp3", ""));
    }
  });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;

      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
    // currentSong.volume = 0;
  });
}

main();
