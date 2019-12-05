
$(document).ready(function() {
  $('#regForm').submit(function(event) {
    $('#reg-btn').prop('disabled', true);
    $('#reg-btn').html(
        `<span class="spinner-border spinner-border-sm" role="status" ">
        </span> Registering...`);
    const data = $(this).serializeArray();
    console.log(data);
    event.preventDefault();
    if (data[2]['value'] != data[3]['value']) {
      $('#tool-pass').tooltip('show');
      $('#inp-pass').val('');
      $('#tool-pass').val('');
    } else {
      $.ajax({
        type: 'POST',
        url: '/register',
        data: $('#regForm').serialize(),
        complete: function(res) {
          if (res.status != 409) {
            $('#successtoast').toast('show');
            $('#regForm').trigger('reset');
            $('#tab-login').click();
          } else {
            $('#errortoast').toast('show');
            $('#regForm').trigger('reset');
          }
          $('#reg-btn').html('');
          $('#reg-btn').text('Submit');
          $('#reg-btn').prop('disabled', false);
        },
      });
    }
  });

$('#loginForm').submit((event) => {
    event.preventDefault();
    $('#reg-btn').prop('disabled', true);
    $('#reg-btn').html(
        `<span class="spinner-border spinner-border-sm" role="status" ">
        </span> Logging in...`);
    $.ajax({
      type: 'POST',
      url: '/login',
      data: $('#loginForm').serialize(),
      complete: function(res) {
        console.log(res.status);
        if (res.status == 401) {
          $('#passtoast').toast('show');
          $('#loginForm').trigger('reset');
        } else {
          let tmp = window.location.href.split('/');
          window.location.href = `http://${tmp[2]}/u/`;
        }
      },
    });
  });
});
