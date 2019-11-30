
$(document).ready(function() {

    $('#regForm').submit((event) => {
        $.ajax({
            type    :   'POST',
            url     :   '/reg',
            data    :   $("#regForm").serialize(),
            success :   function(res) {
                $('.toast').toast("show")
                $("#regForm").trigger("reset");
            }
        })
        event.preventDefault()
    })

})