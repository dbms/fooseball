
function createTeam() {
    $('#loadingmessage').show();
    $.ajax(
        {
            type: "POST",
            url: "/CreateTeam",
            data: {
                team_name: $('#id_txt_teamName').val().trim(),
                player1_name: $('#id_txt_player1').val().trim(),
                player2_name: $('#id_txt_player2').val().trim()
            },
            success: function (data) {
                $('loadingmessage').hide();
                console.log(data);
                // displayDocs(data);
            }
        });
}