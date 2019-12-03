function showModal(element) {
    $(document).ready(()=>{
        var course_name = element.children[0].innerText
        $("#modalTitle").text(course_name)
        $("#modalBunk").modal("show")
    })
}

function extractNum(text) {
    var num = Number(text.replace(/\D/g, ''))
    return num
}

function bunk() {
    let name = $("#modalTitle").text()
    let num = extractNum($(`#${name}-num`).text()) + 1

    var data = {
        name:   name,
    }
    $.ajax({
        type    :   'POST',
        url     :   '/u/bunk',
        data    :   data,
        success :   function(res) {
            $("#modalBunk").modal("hide")
            $(`#${name}-num`).text(`${num} classes bunked!`)
        }
    })
}