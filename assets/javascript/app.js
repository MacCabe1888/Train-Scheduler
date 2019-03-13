let config = {
    apiKey: "AIzaSyBHhZDk4Uw8z-Yzn6AcxAPmVKDSKfZT9i8",
    authDomain: "train-scheduler-e9907.firebaseapp.com",
    databaseURL: "https://train-scheduler-e9907.firebaseio.com",
    projectId: "train-scheduler-e9907",
    storageBucket: "train-scheduler-e9907.appspot.com",
    messagingSenderId: "984877380458"
};

firebase.initializeApp(config);

let database = firebase.database();

let trainArrival = new Audio("assets/audio/Electric-train-arriving-at-a-station-sound-effect.mp3");

$("#submit").on("click", function() {

    event.preventDefault();

    let name = $("#name").val().trim();
    let destination = $("#destination").val().trim();
    let firstTime = $("#first-time").val().trim();
    let frequency = $("#frequency").val().trim();

    //Create local temporary object for holding train data
	let newTrain = {
		name: name,
		destination: destination,
		firstTime: firstTime,
		frequency: frequency
    };
    
	//Save/upload train data to the database.
    database.ref().push(newTrain);
 
})

database.ref().on("child_added", function(childSnapshot) {

 	//Set variables for form input field values equal to the stored values in firebase.
 	let name = childSnapshot.val().name;
 	let destination = childSnapshot.val().destination;
 	let firstTime = childSnapshot.val().firstTime;
 	let frequency = childSnapshot.val().frequency;

    let currentTime = moment();
    let diffInTime = moment(currentTime).diff(moment(firstTime, "HH:mm"), "minutes");
    if (diffInTime < 0) {
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "days");
    diffInTime = moment(currentTime).diff(moment(firstTimeConverted), "minutes");
    }
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