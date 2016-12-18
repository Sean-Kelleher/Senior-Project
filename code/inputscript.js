//so i need to make the form send info to the db, and the populate function get info from the db

function sendToDb(){

};

//this populates the list of events to choose from when choosing to make connections
function populate(){
	//add all the events in the db, getting names of stuff from the events table
	var events = [];
	for (var i=0; i< events.length; i++)
	{
		$('.eventlist').append('<option>' + events[i] + '</option>');
	}
};
			
$(document).ready(populate);