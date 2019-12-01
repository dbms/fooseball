window.onload = function () {
    getTeamDetails();
    getMatchDetails();
    getLeaderBoard();
}

// get  teams details
function getTeamDetails() {
    $.ajax(
        {
            type: "GET",
            url: "/GetTeamDetails",
            success: function (data) {
                $('#id_tbl_displayTeamDetails').empty();

                for (var i = 0; i < data.length; i++) {
                    t = '<tr>';
                    t += '<td style="width:70px">' + (parseInt(i) + 1) + '</td>';
                    t += '<td>' + data[i]["pk"] + '</td>';
                    t += '<td>' + data[i]["fields"]["player1_name"] + '</td>';
                    t += '<td>' + data[i]["fields"]["player2_name"] + '</td>';
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
                    t += '<td><button id="id_btn_A_plus_' + data[i]["pk"] + '" class="btn btn-success btn-xs" onclick="scoring(this.id)"> + </button> <button id="id_btn_A_minu_' + data[i]["pk"] + '" class="btn btn-success btn-xs" onclick="scoring(this.id)"> - </button> <span id="id_score_teamA_' + data[i]["pk"] + '">' + data[i]["fields"]["team1score"] + '</span> : <span id="id_score_teamB_' + data[i]["pk"] + '">' + data[i]["fields"]["team2score"] + '</span> <button id="id_btn_B_plus_' + data[i]["pk"] + '" class="btn btn-success btn-xs" onclick="scoring(this.id)"> + </button> <button id="id_btn_B_minu_' + data[i]["pk"] + '" class="btn btn-success btn-xs" onclick="scoring(this.id)"> - </button></td>';
                    if (data[i]["fields"]["status"] == "ongoing") {
                        t += '<td><button class="btn btn-success btn-sm" id="btn_save_score_' + data[i]["pk"] + '" onclick="saveScore(this.id)">Save</td>';
                    }
                    else {
                        t += '<td readonly><button class="btn btn-danger btn-sm" id="btn_save_score_' + data[i]["pk"] + '" onclick="saveScore(this.id)" disabled>Save</td>';
                    }
                    t += '</tr>';
                    $('#id_tbl_displayMatchDetails').append(t);
                }
            }
        });
}

// get  teams details
function getLeaderBoard() {
    $.ajax(
        {
            type: "GET",
            url: "/GetLeaderBoard",
            success: function (data) {
                $('#id_tbl_displayLeaderboard').empty();

                for (var i = 0; i < data.length; i++) {
                    t = '<tr>';
                    t += '<td style="width:70px">' + (parseInt(i) + 1) + '</td>';
                    t += '<td>' + data[i]["pk"] + '</td>';
                    t += '<td>' + data[i]["fields"]["player1_name"] + ", " + data[i]["fields"]["player2_name"] + '</td>';
                    t += '<td>' + data[i]["fields"]["matches_won"] + '</td>';
                    t += '<td>' + data[i]["fields"]["matches_lost"] + '</td>';
                    t += '<td>' + data[i]["fields"]["matches_draw"] + '</td>';
                    t += '<td>' + data[i]["fields"]["points"] + '</td>';
                    t += '<td>' + data[i]["fields"]["date"].substring(0, 16).replace("T", " ") + '</td>';
                    t += '</tr>';
                    $('#id_tbl_displayLeaderboard').append(t);
                }
            }
        });
}

function saveScore(matchid) {
    scoreA = document.getElementById("id_score_teamA_" + matchid.substring(15, matchid.length)).innerText;
    scoreB = document.getElementById("id_score_teamB_" + matchid.substring(15, matchid.length)).innerText;

    var match_status = '';
    if (scoreA > scoreB)
        match_status = "Team 1 Won"
    else if (scoreA < scoreB)
        match_status = "Team 2 Won"
    else
        match_status = "Match Draw"

    $('#loadingmessage').show();
    $.ajax(
        {
            type: "POST",
            url: "/SaveScore",
            data: {
                scoreA: scoreA,
                scoreB: scoreB,
                MatchID: matchid.substring(15, matchid.length),
                status: match_status
            },
            success: function (data) {
                if (data.outResponse == 'Successfully Updated')
                    swal("Successfully Updated", "", "success");
                else
                    swal("Match does not exists", "Try Again!", "error");

                getMatchDetails();
                getTeamDetails();
                getLeaderBoard();
                $('#loadingmessage').hide();
            }
        });

}
function scoring(id) {
    span_id = "id_score_team" + id.substring(7, 8) + "_" + id.substring(14, id.length);
    if (id.substring(9, 13) == 'plus')
        document.getElementById(span_id).innerText = parseInt(document.getElementById(span_id).innerText) + 1;
    else {
        old_value = parseInt(document.getElementById(span_id).innerText);
        if (old_value > 0)
            document.getElementById(span_id).innerText = old_value - 1;
    }
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
                if (data.outResponse == 'Successfully Saved')
                    swal("Saved Successfully", "", "success");
                else
                    swal("Team Already Created", "Try Changing TeamName!", "error");

                getTeamDetails();
                getLeaderBoard();
                $('#loadingmessage').hide();
                $('#id_txt_teamName').val('');
                $('#id_txt_player1').val('');
                $('#id_txt_player2').val('');
            }
        });
}

// start match 
function startMatch() {
    var team1 = $('#id_ddl_teams1').val();
    var team2 = $('#id_ddl_teams2').val();

    if (team1 == team2) {
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
                if (data.outResponse == 'Successfully Saved')
                    swal("Saved Successfully", "", "success");
                else
                    swal("Match already in progress", "Try Again!", "error");

                getMatchDetails();
                $('#loadingmessage').hide();
                $('#id_ddl_teams1').val('');
                $('#id_ddl_teams2').val('');
            }
        });
}