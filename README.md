# Train-Scheduler
A train schedule app that incorporates Firebase and Moment.js.

### Overview

This subway-themed app allows you to customize a tabular train schedule by alternately adding, editing, or deleting data rows, each of which displays the following information about a specific train:

* Train Name
* Destination
* Frequency
* Next Arrival
* Minutes Away

The table is continuously and automatically updated each minute, on the minute, in real time, meaning that you will never need to refresh the page to make the schedule reflect the passage of time. In particular, each train's entry in the "Minutes Away" column is decremented by one each minute and resets to the frequency (the number of minutes between consecutive arrivals) upon reaching zero, at which moment the "Next Arrival" time will increase accordingly to reflect the fact that one train has just arrived and to anticipate the arrival of the next train. (You may hear the sound of the train arriving as well!)

### Adding a Train

1. Scroll down to the form entitled "Add Train."
2. Fill out the form with your new train's information:
    * Train Name
    * Destination
    * First Train Time (HH:mm - military time)
        - i.e., the first known arrival time of the train, in 24-hour format (e.g., "06:00" = 6:00 AM, "18:00" = 6:00 PM)
        - If the time entered is later in the day than the current time, then the table will be filled in according to the assumption that you are referring to the stated time *yesterday*. If you wish to indicate that the first train is to arrive later *today*, you can do this by adding the train and subsequently editing the train's "Next Arrival" time. (See "Editing a Train" below.)
    * Frequency (min)
        - i.e., the number of minutes between consecutive arrivals
        - The lower the number, the more frequent the arrivals will be.
3. Click "Submit."
4. Scroll up to the table entitled "Current Train Schedule." Your train will have been appended as a new bottom row.

### Editing a Train

1. Click "Edit" next to the name of the train whose information you wish to edit.
2. The information in the "Train Name," "Destination," and "Next Arrival" columns will be highlighted, indicating that you can now edit these fields.
3. Click on the highlighted regions to edit the corresponding text.
4. After typing in your changes, click "Save."

### Deleting a Train

1. Click "Delete" next to the name of the train you wish to remove from the table.
2. Click "OK" on the pop-up to confirm that you wish to delete the train. Otherwise, click "Cancel."
3. If you clicked "OK," then the row will immediately disappear from the table.