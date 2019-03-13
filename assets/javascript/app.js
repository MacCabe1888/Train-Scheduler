let trainArrival = new Audio("assets/audio/Electric-train-arriving-at-a-station-sound-effect.mp3");

$("#submit").on("click", function(event) {

    event.preventDefault();

    let name = $("#name").val().trim();
    let destination = $("#destination").val().trim();
    let firstTime = $("#first-time").val().trim();
    let frequency = $("#frequency").val().trim();

    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(frequency, "minutes");
    let currentTime = moment();
    let diffInTime = moment(currentTime).diff(moment(firstTimeConverted), "minutes");
    let timeRemainder = diffInTime % frequency;
    let minutesAway = frequency - timeRemainder;
    let nextArrival = moment().add(minutesAway, "minutes").format("LT");
    let nextArrivalDisplay = $("<td>");
    let minutesAwayDisplay = $("<td>");

    let newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        nextArrivalDisplay.text(nextArrival),
        minutesAwayDisplay.text(minutesAway)
    );

    $("#train-schedule > tbody").append(newRow);

    let secsTillFirstUpdate = 60 - currentTime.format("ss");
    let firstUpdateTimer = setInterval(firstUpdate, 1000 * secsTillFirstUpdate);

    function firstUpdate() {
        minutesAway--;
        if (!minutesAway > 0) {
            trainArrival.play();
            minutesAway = frequency;
            nextArrivalDisplay.text(moment().add(minutesAway, "minutes").format("LT"));
        }
        minutesAwayDisplay.text(minutesAway);
        clearInterval(firstUpdateTimer);
        setInterval(nextUpdate, 60000);
        nextUpdate;
    }

    function nextUpdate() {
        minutesAway--;
        if (!minutesAway > 0) {
            trainArrival.play();
            minutesAway = frequency;
            nextArrivalDisplay.text(moment().add(minutesAway, "minutes").format("LT"));
        }
        minutesAwayDisplay.text(minutesAway);
    }

    firstUpdate;
 
})