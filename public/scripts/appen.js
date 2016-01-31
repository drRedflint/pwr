
(function () {
  /* globals io */
  var socket = io();

  function handleServerState(data) {
    var knapp;

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        knapp = document.querySelector('[reciever*="' + key + '"]');
        knapp.classList.toggle('on', data[key]);
      }
    }
  }

  function hitSwitch(evt) {
    var el = evt.target;
    var turnPowerOff = el.classList.contains('on');
    var data = {
      'reciever': el.getAttribute('reciever'),
      'turn_on': turnPowerOff
    };

    socket.emit('switch',  data);
  }

  function allOff() {
    var data = {
      'reciever': '1|2|3|4',
      'turn_on': false
    };

    socket.emit('switch',  data);
  }

  function bindEvts() {
    var switchBtns = document.querySelectorAll('.knapp:not(.kill)');
    var offBtn = document.querySelector('.knapp.kill');

    for (var i = 0; i < switchBtns.length; i++) {
      switchBtns[i].addEventListener('click', hitSwitch);
    }

    offBtn.addEventListener('click', allOff);
    socket.on('server_state', handleServerState);
  }

  bindEvts();
  socket.emit('client_state');
}());
