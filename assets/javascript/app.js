let config = {
    apiKey: "AIzaSyBHhZDk4Uw8z-Yzn6AcxAPmVKDSKfZT9i8",
    authDomain: "https://maccabe1888.github.io/Train-Scheduler/",
    databaseURL: "https://train-scheduler-e9907.firebaseio.com",
    projectID: "train-scheduler-e9907",
    messagingSenderId: "984877380458"
};

firebase.initializeApp(config);

let database = firebase.database();

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

    //Create local temporary object for holding train data
	let newTrain = {
		name: name,
		destination: destination,
		firstTime: firstTime,
		frequency: frequency,
		nextArrival: nextArrival,
		minutesAway: minutesAway,
		currentTime: currentTime.format("hh:mm A")
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
	let nextArrival = childSnapshot.val().nextArrival;
	let minutesAway = childSnapshot.val().minutesAway;
    let currentTime = childSnapshot.val().currentTime;

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
        minutesAwayDisplay.text(minutesAway),
    );

    $("#train-schedule > tbody").append(newRow);
    
})