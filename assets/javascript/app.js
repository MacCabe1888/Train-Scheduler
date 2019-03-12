$("#submit").on("click", function(event) {

    event.preventDefault();

    let name = $("#name").val().trim();
    let destination = $("#destination").val().trim();
    let firstTime = $("#first-time").val().trim();
    let frequency = $("#frequency").val().trim();

    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    let currentTime = moment();
    console.log("Current time: " + moment(currentTime).format("LT"));

    let diffInTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffInTime);

    let timeRemainder = diffInTime % frequency;
    console.log(timeRemainder);

    let minutesAway = frequency - timeRemainder;
    console.log("Minutes away: " + minutesAway);

    let nextArrival = moment().add(minutesAway, "minutes").format("LT");
    console.log("Arrival time: " + moment(nextArrival, "LT").format("hh:mm"));

    let newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
    );

    $("#train-schedule > tbody").append(newRow);
 
})