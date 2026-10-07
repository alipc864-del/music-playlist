const songs = [
    {
        title: "Song One",
        artist: "Artist One",
        src: "song1.mp3",
        cover: "song1.jpg",
        theme: "#d00000"
    },
    {
        title: "Song Two",
        artist: "Artist Two",
        src: "song2.mp3",
        cover: "song2.jpg",
        theme: "#8b8fc7"
    },
    {
        title: "Song Three",
        artist: "Artist Three",
        src: "song3.mp3",
        cover: "song3.jpg",
        theme: "#56634b"
    }
];

const audio = document.getElementById("audioPlayer");
const cover = document.getElementById("cover");
const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const searchInput = document.getElementById("searchInput");

let currentSong = 0;

function changeTheme(color) {
    document.documentElement.style.setProperty("--theme-color", color);
}

function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;
    audio.src = song.src;

    changeTheme(song.theme);

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
}

function playSong() {
    audio.play();
    playBtn.textContent = "⏸";
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

playBtn.addEventListener("click", function () {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener("click", function () {
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playSong();
});

nextBtn.addEventListener("click", function () {
    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);
    playSong();
});

audio.addEventListener("loadedmetadata", function () {
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", function () {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", function () {
    audio.volume = volume.value;
});

audio.addEventListener("ended", function () {
    nextBtn.click();
});

function formatTime(time) {
    if (isNaN(time)) {
        return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return minutes + ":" + seconds.toString().padStart(2, "0");
}

searchInput.addEventListener("input", function () {
    const search = searchInput.value.toLowerCase();

    document.querySelectorAll(".song").forEach(function (song) {
        const title = song.querySelector("strong").textContent.toLowerCase();
        const artistName = song.querySelector("span").textContent.toLowerCase();

        if (title.includes(search) || artistName.includes(search)) {
            song.style.display = "flex";
        } else {
            song.style.display = "none";
        }
    });
});

document.querySelectorAll(".song").forEach(function (songElement) {
    songElement.addEventListener("click", function (event) {
        if (
            event.target.classList.contains("favorite") ||
            event.target.classList.contains("remove")
        ) {
            return;
        }

        const index = Number(songElement.dataset.index);

        loadSong(index);
        playSong();
    });
});

document.querySelectorAll(".favorite").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.stopPropagation();

        if (button.textContent === "♡") {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }
    });
});

document.querySelectorAll(".remove").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.stopPropagation();

        button.closest(".song").remove();
    });
});

loadSong(0);
