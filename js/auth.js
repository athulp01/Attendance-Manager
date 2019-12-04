
$(document).ready(function() {

    $('#regForm').submit(function(event) {
        let data = $(this).serializeArray()
        console.log(data)
        event.preventDefault()

        if(data[2]["value"] != data[3]["value"]) {
            $("#tool-pass").tooltip("show")
            $("#inp-pass").val('')
            $("#tool-pass").val('')
        }else {
            $.ajax({
                type    :   'POST',
                url     :   '/register',
                data    :   $("#regForm").serialize(),
                success :   function(res) {
                    $('.toast').toast("show")
                    $("#regForm").trigger("reset");
                }
            })
        }
    })

  /*  $('#loginForm').submit((event) => {
        event.preventDefault()
        console.log($("#loginForm").serializeArray())
        $.ajax({
            type    :   'POST',
            url     :   '/login',
            data    :   $("#loginForm").serialize(),
            complete :   function(xhr) {
                if(xhr.status == 401) {
                    $("#mismatch-alert").show().delay(3000).fadeOut()
                    $("#loginForm").trigger("reset");
                }
            }
        })
    })*/

})