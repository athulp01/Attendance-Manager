/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
function showModal(element) {
  $(document).ready(()=>{
    const courseName = element.children[0].innerText;
    $('#modalTitle').text(courseName);
    $('#modalBunk').modal('show');
  });
}

function extractNum(text) {
  const num = Number(text.replace(/\D/g, ''));
  return num;
}

function bunk() {
  const name = $('#modalTitle').text();
  const num = extractNum($(`#${name}-num`).text()) + 1;

  const data = {
    name: name,
  };
  $.ajax({
    type: 'POST',
    url: '/u/bunk',
    data: data,
    success: function(res) {
      $('#modalBunk').modal('hide');
      location.reload();
    },
  });
}
