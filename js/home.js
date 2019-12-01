function showModal(element) {
    $(document).ready(()=>{
        var course_name = element.children[0].innerText
        $("#modalTitle").text(course_name)
        $("#modalBunk").modal()
    })
}