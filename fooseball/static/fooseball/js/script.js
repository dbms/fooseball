window.onload = function () {
    getTeamDetails();
    getMatchDetails();
}

// get  teams details
function getTeamDetails() {
    $.ajax(
        {
            type: "GET",
            url: "/GetTeamDetails",
            success: function (data) {
                $('#id_tbl_displayTeamDetails').empty();

                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    t = '<tr>';
                    t += '<td style="width:70px">' + (parseInt(i) + 1) + '</td>';
                    t += '<td>' + data[i]["pk"] + '</td>';
                    t += '<td>' + data[i]["fields"]["player1_name"] + '</td>';
                    t += '<td>' + data[i]["fields"]["player1_name"] + '</td>';
                    t += '<td>' + data[i]["fields"]["points"] + '</td>';
                    t += '<td>' + data[i]["fields"]["date"].substring(0, 16).replace("T", " ") + '</td>';
                    t += '</tr>';
                    $('#id_tbl_displayTeamDetails').append(t);
                }
                // fill ddls
                var option = "";
                $('#id_ddl_teams1').empty();
                $('#id_ddl_teams2').empty();
                var option = '<option value="">Select</option>';
                for (i = 0; i < data.length; i++) {
                    option += '<option value="' + data[i]["pk"] + '">' + data[i]["pk"] + '</option>';
                }
                $('#id_ddl_teams1').append(option);
                $('#id_ddl_teams2').append(option);
            }
        });
}

// get  teams details
function getMatchDetails() {
    $.ajax(
        {
            type: "GET",
            url: "/GetMatchDetails",
            success: function (data) {
                $('#id_tbl_displayMatchDetails').empty();
                for (var i = 0; i < data.length; i++) {
                    t = '<tr>';
                    t += '<td style="width:70px">' + (parseInt(i) + 1) + '</td>';
                    t += '<td>' + data[i]["fields"]["team1"] + '</td>';
                    t += '<td>' + data[i]["fields"]["team2"] + '</td>';
                    t += '<td>' + data[i]["fields"]["status"] + '</td>';
                    t += '<td>' + (data[i]["fields"]["date"]).substring(0, 16).replace("T", " ") + '</td>';
                    t += '<td><span>' +  + '</span></td>';
                    t += '</tr>';
                    $('#id_tbl_displayMatchDetails').append(t);
                }
            }
        });
}
// create team
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
                console.log(data.outResponse);
                if (data.outResponse == 'Successfully Saved')
                    swal("Saved Successfully", "", "success");
                else
                    swal("Team Already Created", "Try Changing TeamName!", "error");
                
                getTeamDetails();
                $('#loadingmessage').hide();

            }
        });
}

// start match 
function startMatch() {
    var team1 = $('#id_ddl_teams1').val();
    var team2 = $('#id_ddl_teams2').val();

    if(team1 == team2){
        alert("Please Select Different Teams");
        return false;
    }

    $('#loadingmessage').show();
    $.ajax(
        {
            type: "POST",
            url: "/CreateMatch",
            data: {
                team1: team1,
                team2: team2
            },
            success: function (data) {
                console.log(data.outResponse);
                if (data.outResponse == 'Successfully Saved')
                    swal("Saved Successfully", "", "success");
                else
                    swal("Match already in progress", "Try Again!", "error");
                
                getMatchDetails();
                $('#loadingmessage').hide();
            }
        });
}