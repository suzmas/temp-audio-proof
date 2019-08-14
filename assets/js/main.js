function addAnnotationNote(player, time, text) {
  const noteContainer = document.getElementById('annotations-container');
  const note = document.createElement('div');
  note.classList.add('note');
  note.innerHTML = `<p>${text}</p>`;
  const jumpButton = document.createElement('button');
  jumpButton.innerText = 'Jump to note';
  jumpButton.classList = 'jump-button primary-btn';
  jumpButton.dataset.timestamp = time;
  jumpButton.addEventListener('click', () => {
    player.jumpToTime(time);
  });
  note.appendChild(jumpButton);
  noteContainer.appendChild(note);
}

function addAnnotationTick(parentEl, position) {
  const tick = document.createElement('span');
  tick.classList = 'tick';
  parentEl.appendChild(tick);
  tick.style.left = position;
}

function clearAnnotations() {
  document.querySelectorAll('.note').forEach((el) => {
    el.remove();
  });
  document.querySelectorAll('.tick').forEach((el) => {
    el.remove();
  });
}

function Player(track, els) {
  this.track = track;
  this.els = els;
  this.playbackPosition = 0;
  this.duration = 0;
  this.paused = false;
  this.initializeSound();
  this.initializeControlEvents();

  this.step = () => {
    const seek = this.sound.seek() || 0;
    this.els.timer.innerHTML = this.formatTime(Math.round(seek));
    this.els.progress.style.width = `${((seek / this.sound.duration()) * 100 || 0)}%`;
    if (this.sound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  };
  this.seek = (percent) => {
    const seekPosition = this.sound.duration() * percent;
    this.sound.seek(seekPosition);
  };
  this.jumpToTime = (timestamp) => {
    this.sound.seek(timestamp);
  };
  this.adjustSpeed = (speed) => {
    const speedNum = Number(speed);
    this.sound.rate(speedNum);
  };
  this.play = () => {
    this.sound.play();
    this.els.pauseBtn.classList.remove('hidden');
    this.els.playBtn.classList.add('hidden');
  };
  this.pause = () => {
    this.sound.pause();
    this.els.pauseBtn.classList.add('hidden');
    this.els.playBtn.classList.remove('hidden');
  };
  this.formatTime = (secs) => {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = secs - minutes * 60 || 0;
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  };
}

Player.prototype.initializeSound = function initializeSound() {
  const player = this;
  this.sound = new Howl({
    src: this.track,
    html5: true,
    onplay: () => {
      requestAnimationFrame(player.step.bind(player));
    },
    onload: () => {
      this.els.duration.innerHTML = this.formatTime(Math.round(this.sound.duration()));
      this.els.title.innerText = this.track;
    },
    onseek: () => {
      requestAnimationFrame(player.step.bind(player));
    },
    onend: () => {
      player.els.pauseBtn.classList.add('hidden');
      player.els.playBtn.classList.remove('hidden');
    },
  });
};

Player.prototype.initializeControlEvents = function initializeControlEvents() {
  this.els.playBtn.addEventListener('click', () => { this.play(); });
  this.els.pauseBtn.addEventListener('click', () => { this.pause(); });
  this.els.bar.addEventListener('click', (event) => {
    const containerWidth = this.els.bar.offsetWidth;
    const clickPos = event.offsetX;
    this.seek(clickPos / containerWidth);
  });
  this.els.speedControl.addEventListener('click', () => {
    const el = this.els.speedControl;
    const speedNum = Number(el.dataset.speed);
    const newSpeed = speedNum === 3 ? 1 : speedNum + 1;
    this.adjustSpeed(newSpeed);
    el.dataset.speed = newSpeed;
    el.innerText = `${newSpeed}x`;
  });
  this.els.annotater.addEventListener('click', () => {
    this.pause();
    const timestamp = this.sound.seek();
    const annotationTimestamp = this.formatTime(Math.round(timestamp));
    const pixelPosition = `${((timestamp / this.sound.duration()) * 100 || 0)}%`;
    addAnnotationNote(this, timestamp, `Annotation at: ${annotationTimestamp} \n bler bler bler`);
    addAnnotationTick(this.els.bar, pixelPosition);
  });
};

const els = {
  progress: document.getElementById('progress'),
  bar: document.getElementById('bar'),
  duration: document.getElementById('duration'),
  timer: document.getElementById('timer'),
  playBtn: document.getElementById('playBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  annotater: document.getElementById('annotate'),
  speedControl: document.getElementById('speedControl'),
  title: document.getElementById('title'),
};

let currentplayer;
document.querySelectorAll('.new-player').forEach((el) => {
  el.addEventListener('click', () => {
    els.playBtn.style.color = 'black';
    const audioFile = el.dataset.audiofile;
    currentplayer = new Player(audioFile, els);
    el.parentElement.querySelectorAll('button').forEach((btn) => {
      if (btn !== el) {
        btn.disabled = true;
      }
    });
  });
});
