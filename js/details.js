function addCourse() {
    $(document).ready(function() {
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
                alert("succes")
            }
        })
        $('#course-list').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${course_name}
                                    <span class="badge badge-primary badge-pill">0</span>
                                    </li>`)
        $('#input-course').val('')
    })
    
}