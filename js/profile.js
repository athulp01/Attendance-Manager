$("#form-add").submit(function(event) {
    event.preventDefault()
    course_name = $('#input-course').val()
    Cdata = {
            name: course_name,
            num: 0
    }
    $.ajax({
        type    :   'POST',
        url     :   '/u/addcourse',
        data    :   Cdata,
        success :   function(res) {
        }
        
    })
    $('#course-list').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
    ${course_name}
    <span class="badge badge-primary badge-pill">0</span>
    </li>`)
    $('#input-course').val('')

})

$(document).ready(function() {
    $("#course-select-edit").change(function() {
        let course = $("#course-select-edit :selected").text()
        $("#change-num").val($(`#${course}_bunked`).text())
    })
})

$("#form-remove").submit(function(event) {
    $.ajax({
        type    :   'POST',
        url     :   '/u/removecourse',
        data    :   $("#form-remove").serialize(),
    })
})

function editCourse() {
    $.ajax({
        type    :   'POST',
        url     :   '/u/editcourse',
        data    :   $("#form-edit").serialize(),
    })
}