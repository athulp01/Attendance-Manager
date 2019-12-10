/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

//function for adding a course
$('#form-add').submit(function(event) {
  event.preventDefault();
  courseName = $('#input-course').val();
  Cdata = {
    name: courseName,
    num: 0,
  };
  $.ajax({
    type: 'POST',
    url: '/u/addcourse',
    data: Cdata,
    success: function(res) {
    },

  });

  $('#course-list').append(`<li class="list-group-item d-flex 
  justify-content-between align-items-center">
    ${courseName}
    <span class="badge badge-primary badge-pill">0</span>
    </li>`);
  $('#input-course').val('');
});



//function for removing a course
$('#form-remove').submit(function(event) {
  $.ajax({
    type: 'POST',
    url: '/u/removecourse',
    data: $('#form-remove').serialize(),
  });
});

//show the date selection modal for removing a bunked class
function showModal(element) {
  $(document).ready(()=>{
    const courseName = $("#course-select-edit :selected").text();
    $.ajax({
      type: 'GET',
      url: `/u/getdate/${courseName}`,
      success: function(res) {
        let dates = res["courses"][0]["date_bunked"];
        let html = "";
        console.log(dates);
        dates.forEach((element,idx) => {
          dateobj = new Date(element)
          html = html.concat(`
          <div class="form-check ml-1">
          <input class="form-check-input" type="radio" name="date" value="${idx}" id="${idx}">
          <label class="form-check-label" for="exampleRadios1">
          ${dateobj.toDateString()}
          </label></div>`)
        });
        $("#dateradio").html(html);
        $('#modalEdit').modal('show');
      }
    });
  });
}

//function to remove a bunked class
function edit() {
  $(document).ready(() => {
    let data = {
      name: $("#course-select-edit :selected").text(),
      idx: $("input[name='date']:checked").val()
    }
    $.ajax({
      type: 'POST',
      url:  '/u/removedate',
      data: data,
      success: function(res) {
        $('#modalEdit').modal('hide');
        $('#successtoast').toast('show');
      }
    })
  });
}

