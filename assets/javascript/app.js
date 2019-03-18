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

    if (typeof childSnapshot.val().nextArrival !== "undefined") {
        nextArrival = childSnapshot.val().nextArrival;
        let currentTime = moment();
        minutesAway = 1 + moment(childSnapshot.val().nextArrival, "LT").diff(moment(currentTime), "minutes");
        if (minutesAway <= 0) {
            let nextArrivalConverted = moment(nextArrival, "LT").add(1, "days");
            minutesAway = 1 + moment(nextArrivalConverted).diff(moment(currentTime), "minutes");
        }
    }

    let newRow = $("<tr>").append(
        $("<td>").html('<button class="train-edit" id="' + childSnapshot.key + '">Edit</button>'),
        $("<td>").html('<div class="train-info train-name" edit_type="click">' + name + '</div>'),
        $("<td>").html('<div class="train-info train-destination" edit_type="click">' + destination + '</div>'),
        $("<td>").html('<div class="train-frequency">' + frequency + '</div>'),
        nextArrivalDisplay.html('<div class="train-info train-arrival" edit_type="click">' + nextArrival + '</div>'),
        minutesAwayDisplay.html('<div class="train-minutes-away">' + minutesAway + '</div>')
    );

    $("#train-schedule > tbody").append(newRow);

    $(document).on("click", ".train-edit", function(event) {

        event.preventDefault();

        $(this).text("Save");
        $(this).attr("class", "train-save");

        $(this).closest("tr").find(".train-info").css("background", "rgb(225, 240, 255)");
        $(this).closest("tr").find(".train-info").attr("contenteditable", "true");
        
    })

    $(document).on("click", ".train-save", function(event) {

        event.preventDefault();

        $(this).text("Edit");
        $(this).attr("class", "train-edit");

        $(this).closest("tr").find(".train-info").css("background", "lightsteelblue");
        $(this).closest("tr").find(".train-info").attr("contenteditable", "false");

        let name = $(this).closest("tr").find(".train-name").text();
        let destination = $(this).closest("tr").find(".train-destination").text();
        let frequency = $(this).closest("tr").find(".train-frequency").text();
        let nextArrival = $(this).closest("tr").find(".train-arrival").text();
        let minutesAway = $(this).closest("tr").find(".train-minutes-away").text();

        let currentTime = moment();
        if (nextArrival === currentTime.format("LT")) {
            trainArrival.play();
            nextArrival = moment(nextArrival, "LT").add(frequency, "minutes").format("LT");
            let nextArrivalDisplay = $(this).closest("tr").find(".train-arrival");
            nextArrivalDisplay.text(nextArrival);
        }
        
        minutesAway = 1 + moment(nextArrival, "LT").diff(moment(currentTime), "minutes");
        if (minutesAway <= 0) {
            let nextArrivalConverted = moment(nextArrival, "LT").add(1, "days");
            minutesAway = 1 + moment(nextArrivalConverted).diff(moment(currentTime), "minutes");
        }
        let minutesAwayDisplay = $(this).closest("tr").find(".train-minutes-away");
        minutesAwayDisplay.html('<div class="train-minutes-away">' + minutesAway + '</div>');

        if ($(this).attr("id") === childSnapshot.key) {
            let updates = {};
            updates[childSnapshot.key] = {
                name: name,
                destination: destination,
		        firstTime: firstTime,
                frequency: frequency,
                nextArrival: nextArrival
            };
            database.ref().update(updates);
        }

    })

    let secsTillFirstUpdate = 60 - currentTime.format("ss");
    let firstUpdateTimer = setInterval(firstUpdate, 1000 * secsTillFirstUpdate);

    function firstUpdate() {
        minutesAway = minutesAwayDisplay.text();
        minutesAway--;
        if (!minutesAway > 0) {
            trainArrival.play();
            minutesAway = frequency;
            nextArrival = nextArrivalDisplay.text();
            nextArrival = moment(nextArrival, "LT").add(minutesAway, "minutes").format("LT");
            nextArrivalDisplay.html('<div class="train-info train-arrival" edit_type="click">' + nextArrival + '</div>');
            let updates = {};
            updates[childSnapshot.key] = {
                name: name,
                destination: destination,
		        firstTime: firstTime,
                frequency: frequency,
                nextArrival: nextArrival
            };
            database.ref().update(updates);
        }
        minutesAwayDisplay.text(minutesAway);
        clearInterval(firstUpdateTimer);
        setInterval(nextUpdate, 60000);
        nextUpdate;
    }

    function nextUpdate() {
        minutesAway = minutesAwayDisplay.text();
        minutesAway--;
        if (!minutesAway > 0) {
            trainArrival.play();
            minutesAway = frequency;
            nextArrival = nextArrivalDisplay.text();
            nextArrival = moment(nextArrival, "LT").add(minutesAway, "minutes").format("LT");
            nextArrivalDisplay.html('<div class="train-info train-arrival" edit_type="click">' + nextArrival + '</div>');
            let updates = {};
            updates[childSnapshot.key] = {
                name: name,
                destination: destination,
		        firstTime: firstTime,
                frequency: frequency,
                nextArrival: nextArrival
            };
            database.ref().update(updates);
        }
        minutesAwayDisplay.text(minutesAway);
    }

    firstUpdate;

})